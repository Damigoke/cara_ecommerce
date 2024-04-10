"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllProduct = exports.deleteProduct = exports.UpdateProduct = exports.getProduct = exports.uploadProductImages = exports.CreateProduct = void 0;
const utill_1 = require("./../utill/utill");
const uuid_1 = require("uuid");
const productModel_1 = require("../model/productModel");
// import login from '../model/userModel';
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Multer configuration for file upload
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './uploads'; // Define your upload directory
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
async function CreateProduct(req, res) {
    try {
        const verified = req.user;
        const id = (0, uuid_1.v4)();
        const { name, brand, category, description, price } = req.body;
        // Assuming 'images' is the name of the field for the image files in your form
        const image = req.file.filename; // Access filenames assigned by multer
        const productRecord = await productModel_1.productModel.create({
            id,
            name,
            image,
            brand,
            category,
            description: description.toString(), // Convert description to a string
            price: parseFloat(price),
            userId: verified?.id
        });
        const allProducts = await productModel_1.productModel.findAll();
        return res.status(200).json({ message: 'Product created successfully', allProducts });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
exports.CreateProduct = CreateProduct;
// Route handler with multer middleware for image upload
exports.uploadProductImages = upload.single('image');
; // Change 'images' to the field name used in your HTML form
async function getProduct(req, res) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        const users = await productModel_1.productModel.findAndCountAll({
            limit: limit,
            offset: offset
        });
        return res.status(200).json({ msg: "You have successfully retrieve all data", data: users.rows, count: users.count, success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
}
exports.getProduct = getProduct;
async function UpdateProduct(req, res) {
    try {
        const id = req.params.id;
        const validResult = utill_1.updateProductSchema.validate(req.body, utill_1.alternative);
        if (validResult.error) {
            res.status(400).json({ Error: validResult.error.details[0].message });
        }
        const updateProduct = await productModel_1.productModel.findOne({ where: { id } });
        if (!updateProduct) {
            res.status(400).json({ data: "Cannot Update the Product" });
        }
        const updatedProduct = await updateProduct?.update(req.body);
        return res.status(200).json({ data: updatedProduct, success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error });
    }
}
exports.UpdateProduct = UpdateProduct;
async function deleteProduct(req, res) {
    try {
        const id = req.params.id;
        const products = await productModel_1.productModel.findOne({
            where: { id }
        });
        if (!products) {
            return res.status(400).json({
                msg: "Cannot find the user"
            });
        }
        const deleteProduct = await products.destroy();
        return res.status(200).json({ data: deleteProduct, msg: "You have successfully deleted the product", success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
}
exports.deleteProduct = deleteProduct;
async function deleteAllProduct(req, res) {
    try {
        const products = await productModel_1.productModel.findAll();
        if (!products || products.length === 0) {
            return res.status(400).json({
                msg: "Cannot find the user"
            });
        }
        const deleteProduct = await productModel_1.productModel.destroy({ where: {} });
        return res.status(200).json({ data: deleteProduct, msg: "You have successfully deleted all the product", success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
}
exports.deleteAllProduct = deleteAllProduct;
