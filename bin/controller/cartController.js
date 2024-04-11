"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllOrder = exports.deleteOrder = exports.getOrder = exports.CreateOrder = void 0;
const cartModel_1 = require("../model/cartModel");
const productModel_1 = require("../model/productModel");
const utill_1 = require("./../utill/utill");
const uuid_1 = require("uuid");
async function CreateOrder(req, res) {
    console.log("Halleluyah");
    try {
        const { productIds } = req.query;
        console.log(productIds);
        const verified = req.user;
        const id = (0, uuid_1.v4)();
        console.log(id);
        const { size, price } = req.body;
        const validResult = utill_1.createOrderSchema.validate(req.body, utill_1.alternative);
        if (validResult.error) {
            res.status(400).json({ Error: validResult.error.details[0].message });
        }
        const cartRecord = await cartModel_1.cartModel.create({
            id,
            size,
            price,
            productId: productIds,
            userId: verified?.id
        });
        const allcart = await cartModel_1.cartModel.findAll({
            include: [
                {
                    model: productModel_1.productModel,
                    as: 'orders'
                }
            ]
        });
        console.log(allcart);
        return res.status(200).json({ message: 'Order created sucessfully', allcart });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Invalid Server Error' });
    }
}
exports.CreateOrder = CreateOrder;
async function getOrder(req, res) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        const cart = await cartModel_1.cartModel.findAndCountAll({
            limit: limit,
            offset: offset
        });
        return res.status(200).json({ msg: "You have successfully retrieve all data", data: cart.rows, count: cart.count, success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
}
exports.getOrder = getOrder;
async function deleteOrder(req, res) {
    try {
        const id = req.params.id;
        const carts = await cartModel_1.cartModel.findOne({
            where: { id }
        });
        if (!carts) {
            return res.status(400).json({
                msg: "Cannot find the user"
            });
        }
        const deleteCart = await carts.destroy();
        return res.status(200).json({ data: deleteCart, msg: "You have successfully deleted the product", success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
}
exports.deleteOrder = deleteOrder;
async function deleteAllOrder(req, res) {
    try {
        const carts = await cartModel_1.cartModel.findAll();
        if (!carts || carts.length === 0) {
            return res.status(400).json({
                msg: "Cannot find the user"
            });
        }
        const deleteCart = await cartModel_1.cartModel.destroy({ where: {} });
        return res.status(200).json({ data: deleteCart, msg: "You have successfully deleted all the product", success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
}
exports.deleteAllOrder = deleteAllOrder;
