"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteproduct = exports.updateproduct = exports.createproduct = exports.getSingleProducts = exports.allWooCommerceProducts = exports.createcategoryEndpoint = void 0;
const productModel_1 = require("../model/productModel");
const config_1 = __importDefault(require("../config/config"));
// import multer from "multer";
// import fs from "fs";
// import path from "path";
// const storage = multer.diskStorage({
//   destination: function (
//     req: any,
//     file: any,
//     cb: (arg0: null, arg1: string) => void
//   ) {
//     const uploadDir = "uploads";
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   filename: function (
//     req: any,
//     file: { originalname: string },
//     cb: (arg0: null, arg1: string) => void
//   ) {
//     const ext = path.extname(file.originalname);
//     cb(null, uuidv4() + ext);
//   },
// });
//const upload = multer({ storage: storage });
async function createcategoryEndpoint(req, res) {
    try {
        const data = req.body;
        const consumerKey = "ck_221132231c8f0ef300cff6f468e047f1d8fa0b7e";
        const consumerSecret = "cs_0af5d1b608af89c023c529637a66bdcfe1d11185";
        const _method = "POST";
        const response = await config_1.default.post('products/categories', data);
        const responseData = response.data;
        return responseData;
    }
    catch (error) {
        console.error(error);
    }
}
exports.createcategoryEndpoint = createcategoryEndpoint;
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
        const Data = {
            name: data.name,
            type: data.type,
            regular_price: data.regular_price + "",
            sale_price: data.sale_price + "",
            description: data.description,
            short_description: data.short_description,
            categories: [
                {
                    id: data.categories[0].id
                },
                {
                    id: data.categories[1].id
                }
            ],
            images: [
                {
                    src: data.images[0].src
                }
            ]
        };
        const verified = req.user;
        const productResult = await createproductEndpoint(Data);
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
        const consumerKey = "ck_e576d6900528be88b08ddda9cfb0c38a8261fc86";
        const consumerSecret = "cs_0e83f4e256cc79c784e4dff583bddc6c7e8598e0";
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
        const consumerKey = "ck_e576d6900528be88b08ddda9cfb0c38a8261fc86";
        const consumerSecret = "cs_0e83f4e256cc79c784e4dff583bddc6c7e8598e0";
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
