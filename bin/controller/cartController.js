"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.deleteorder = exports.getsingleorder = exports.allWooCommerceOrder = exports.updateOrderStatus = exports.confirmOrder = exports.createorder = void 0;
const cartModel_1 = require("../model/cartModel");
const userModel_1 = __importDefault(require("../model/userModel"));
const config_1 = __importDefault(require("../config/config"));
// interface OrderData {
//   id: number;
//   status: string;
//   lineItems: any[]; // Assuming lineItems is an array of any type
// }
async function orderproductEndpoint(data) {
    try {
        const consumerKey = 'ck_e576d6900528be88b08ddda9cfb0c38a8261fc86';
        const consumerSecret = 'cs_0e83f4e256cc79c784e4dff583bddc6c7e8598e0';
        const _method = 'POST';
        const response = await config_1.default.post(`orders?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&method=${_method}`, data);
        const responseData = response.data;
        return responseData;
    }
    catch (error) {
        console.error(error);
    }
}
async function createorder(req, res) {
    try {
        const data = req.body;
        const productIds = req.params.productIds;
        console.log(productIds);
        const verified = req.user;
        const result = await orderproductEndpoint(data);
        const { id, status, line_items } = result;
        const lineItems = line_items.map((line_item) => line_item.price).join(',');
        await cartModel_1.cartModel.create({
            id,
            status,
            price: parseFloat(lineItems),
            productId: productIds,
            userId: verified?.id
        });
        return res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.createorder = createorder;
async function confirmOrder(req, res) {
    try {
        const userId = req.params.id;
        const user = await userModel_1.default.findOne({
            where: {
                id: userId
            },
            include: [
                {
                    model: cartModel_1.cartModel,
                    as: 'order'
                },
            ],
        });
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //const cart = await cartModel.update({ status: 'paid' }, { where: { userId: id } })
        //  const carts = await cartModel.findAll({where :{userId:id}})
        return res.status(200).json({ msg: "You have successfully retrieve all data", data: user, success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
}
exports.confirmOrder = confirmOrder;
async function updateOrderStatus(req, res) {
    try {
        const userId = req.params.id;
        //const cart = await cartModel.update({ status: 'paid' }, { where: { userId: id } })
        const updateOrderStatus = await cartModel_1.cartModel.update({ status: 'processing' }, { where: { userId: userId } });
        return res.status(200).json({ msg: "You have successfully retrieve all data", data: updateOrderStatus, success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
}
exports.updateOrderStatus = updateOrderStatus;
async function allWooCommerceOrder(req, res) {
    try {
        const userId = req.query;
        const response = await config_1.default.get('orders', {
            params: {
                customer: userId // Filter orders by customer ID
            }
        });
        res.json(response.data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.allWooCommerceOrder = allWooCommerceOrder;
async function getsingleorder(req, res) {
    try {
        const id = req.params.id;
        const userId = req.query;
        const response = await config_1.default.get(`orders/${id}`);
        res.json({ data: response.data });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.getsingleorder = getsingleorder;
async function singleWooCommerceEndpoint(id) {
    try {
        const response = await config_1.default.get(`orders/${id}`);
        const productId = response.data.id;
        // Return the product ID along with the response data
        return { productId };
    }
    catch (error) {
        console.error(error);
    }
}
async function deleteproductEndpoint(productId) {
    try {
        const id = await singleWooCommerceEndpoint(productId);
        console.log("id ;", id);
        const consumerKey = 'ck_e576d6900528be88b08ddda9cfb0c38a8261fc86';
        const consumerSecret = 'cs_0e83f4e256cc79c784e4dff583bddc6c7e8598e0';
        const _method = 'DELETE';
        const response = await config_1.default.delete(`orders/${id?.productId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&method=${_method}`, {
            force: true
        });
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}
async function deleteorder(req, res) {
    try {
        const productId = req.params.productId;
        const deletedProduct = await deleteproductEndpoint(productId);
        const deletedProducts = await deleteOrder(productId);
        res.json({ message: "You have successfully delete an order", data: deletedProduct });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.deleteorder = deleteorder;
async function deleteOrder(productId) {
    try {
        const deleteCart = await cartModel_1.cartModel.destroy({ where: { id: productId } });
        return deleteCart;
    }
    catch (error) {
        console.error(error);
    }
}
exports.deleteOrder = deleteOrder;
