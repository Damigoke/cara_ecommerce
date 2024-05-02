"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteproduct = exports.updateproduct = exports.createproduct = exports.allWooCommerceProducts = void 0;
const uuid_1 = require("uuid");
const productModel_1 = require("../model/productModel");
const config_1 = __importDefault(require("../config/config"));
// import login from '../model/userModel';
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        cb(null, (0, uuid_1.v4)() + ext);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
async function allWooCommerceProducts(req, res) {
    try {
        const response = await config_1.default.get('products');
        res.json(response.data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.allWooCommerceProducts = allWooCommerceProducts;
async function callWooCommerceEndpoint(productId) {
    try {
        const response = await config_1.default.get(`products/${productId}`);
        const productIds = response.data.id;
        // Return the product ID along with the response data
        return { productIds };
    }
    catch (error) {
        console.error(error);
    }
}
async function createproductEndpoint(data) {
    try {
        const consumerKey = 'ck_221132231c8f0ef300cff6f468e047f1d8fa0b7e';
        const consumerSecret = 'cs_0af5d1b608af89c023c529637a66bdcfe1d11185';
        const _method = 'POST';
        const response = await config_1.default.post(`products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&method=${_method}`, data);
        const responseData = response.data;
        return responseData;
    }
    catch (error) {
        console.error(error);
    }
}
async function createproduct(req, res) {
    try {
        const data = req.body;
        const verified = req.user;
        const productResult = await createproductEndpoint(data);
        const products = await CreateProduct(data, verified);
        console.log(products);
        res.json(productResult);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.createproduct = createproduct;
async function updateproductEndpoint(data, productId) {
    try {
        const id = await callWooCommerceEndpoint(productId);
        console.log(id);
        const consumerKey = 'ck_221132231c8f0ef300cff6f468e047f1d8fa0b7e';
        const consumerSecret = 'cs_0af5d1b608af89c023c529637a66bdcfe1d11185';
        const _method = 'PUT';
        const response = await config_1.default.put(`products/${id?.productIds}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&method=${_method}`, data);
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}
async function updateproduct(req, res) {
    try {
        const productId = req.params.productId;
        console.log(productId);
        const data = req.body;
        const updateProductResult = await updateproductEndpoint(data, productId);
        const updatedProducts = await UpdateProduct(data, productId);
        res.json(updateProductResult);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.updateproduct = updateproduct;
async function deleteproductEndpoint(productId) {
    try {
        console.log(productId);
        const id = await callWooCommerceEndpoint(productId);
        console.log(id);
        const consumerKey = 'ck_221132231c8f0ef300cff6f468e047f1d8fa0b7e';
        const consumerSecret = 'cs_0af5d1b608af89c023c529637a66bdcfe1d11185';
        const _method = 'DELETE';
        const response = await config_1.default.delete(`products/${id?.productIds}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&method=${_method}`, {
            force: true
        });
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}
async function deleteproduct(req, res) {
    try {
        const productId = req.params.productId;
        const deletedProduct = await deleteproductEndpoint(productId);
        const deletedProducts = await deleteProduct(productId);
        res.json(deletedProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.deleteproduct = deleteproduct;
async function CreateProduct(data, verified) {
    try {
        //const { result } = await createproduct(req, res);
        const { id, name, images, categories, description, regular_price } = await createproductEndpoint(data);
        const imagesString = images.map((image) => image.src).join(',');
        const category = categories.map((category) => category.name).join(',');
        const productRecord = await productModel_1.productModel.create({
            id,
            name,
            image: imagesString,
            category: category,
            description: description,
            price: parseFloat(regular_price),
            userId: verified?.id
        });
        return productRecord;
    }
    catch (error) {
        console.log(error);
    }
}
const uploadProductImages = upload.single('image');
// export async function getProduct(req: Request, res: Response) {
//     try {
//         const limit = req.query?.limit as number | undefined;
//         const offset = req.query?.offset as number | undefined;
//         const products = await productModel.findAll({
//             limit: limit,
//             offset: offset
//         });
//         return res.status(200).json(products);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ success: false });
//     }
// }
async function UpdateProduct(data, productId) {
    try {
        const { name, images, categories, description, regular_price } = await updateproductEndpoint(data, productId);
        const imagesString = images.map((image) => image.src).join(',');
        const category = categories.map((category) => category.name).join(',');
        const updatedProduct = await productModel_1.productModel.update({ name, image: imagesString, category, description, price: regular_price, }, { where: { id: productId, } });
        return updatedProduct;
    }
    catch (error) {
        console.error(error);
    }
}
async function deleteProduct(productId) {
    try {
        const deleteProduct = await productModel_1.productModel.destroy({ where: { id: productId } });
        return deleteProduct;
    }
    catch (error) {
        console.error(error);
    }
}
// export async function deleteAllProduct(req: Request, res: Response) {
//     try {
//     const products = await productModel.findAll();
//     if(!products || products.length === 0){
//         return res.status(400).json({
//             msg: "Cannot find the user"
//         })
//     }
//     const deleteProduct = await productModel.destroy({ where: {} });
//    return res.status(200).json({ data: deleteProduct, msg: "You have successfully deleted all the product", success: true });
//      } catch (error) {
//       console.error(error);
//     return res.status(500).json({ success: false });
//       }
//    }
