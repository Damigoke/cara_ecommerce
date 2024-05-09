"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteproduct = exports.updateproduct = exports.createproduct = exports.getSingleProducts = exports.allWooCommerceProducts = void 0;
const uuid_1 = require("uuid");
const productModel_1 = require("../model/productModel");
const config_1 = __importDefault(require("../config/config"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "uploads";
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        cb(null, (0, uuid_1.v4)() + ext);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
async function allWooCommerceProducts(req, res) {
    try {
        const response = await config_1.default.get("products");
        res.json(response.data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.allWooCommerceProducts = allWooCommerceProducts;
async function getSingleProducts(req, res) {
    try {
        const productId = req.params.productId;
        const response = await config_1.default.get(`products/${productId}`);
        // Return the product ID along with the response data
        res.json({ data: response.data });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.getSingleProducts = getSingleProducts;
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
        console.log(data);
        const consumerKey = "ck_221132231c8f0ef300cff6f468e047f1d8fa0b7e";
        const consumerSecret = "cs_0af5d1b608af89c023c529637a66bdcfe1d11185";
        const _method = "POST";
        const response = await config_1.default.post('products', data);
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
        const dd = {
            name: data.name,
            type: data.type,
            regular_price: data.regular_price + "",
            sale_price: data.sale_price + "",
            description: data.description,
            short_description: data.short_description,
            categories: [
                {
                    id: data.category[0].id
                },
                {
                    id: data.category[1].id
                }
            ],
            images: [
                {
                    src: data.image[0].src
                }
            ]
        };
        const verified = req.user;
        const productResult = await createproductEndpoint(dd);
        const { id, name, images, categories, description, regular_price, } = productResult;
        const imagesString = images
            .map((image) => image.src)
            .join(",");
        const category = categories
            .map((category) => category.name)
            .join(",");
        await productModel_1.productModel.create({
            id,
            name,
            image: imagesString,
            category: category,
            description: description,
            price: parseFloat(regular_price),
            userId: verified?.id,
        });
        res.json(productResult);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.createproduct = createproduct;
async function updateproductEndpoint(data, productId) {
    try {
        const id = await callWooCommerceEndpoint(productId);
        console.log(id);
        const consumerKey = "ck_221132231c8f0ef300cff6f468e047f1d8fa0b7e";
        const consumerSecret = "cs_0af5d1b608af89c023c529637a66bdcfe1d11185";
        const _method = "PUT";
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
        const { name, images, categories, description, regular_price, } = updateProductResult;
        const imagesString = images
            .map((image) => image.src)
            .join(",");
        const category = categories
            .map((category) => category.name)
            .join(",");
        const updatedProduct = await productModel_1.productModel.update({
            name,
            image: imagesString,
            category,
            description,
            price: regular_price,
        }, { where: { id: productId } });
        res.json(updateProductResult);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.updateproduct = updateproduct;
async function deleteproductEndpoint(productId) {
    try {
        console.log(productId);
        const id = await callWooCommerceEndpoint(productId);
        console.log(id);
        const consumerKey = "ck_221132231c8f0ef300cff6f468e047f1d8fa0b7e";
        const consumerSecret = "cs_0af5d1b608af89c023c529637a66bdcfe1d11185";
        const _method = "DELETE";
        const response = await config_1.default.delete(`products/${id?.productIds}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&method=${_method}`, {
            force: true,
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
        await productModel_1.productModel.destroy({
            where: { id: productId },
        });
        res.json(deletedProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.deleteproduct = deleteproduct;
const uploadProductImages = upload.single("image");
