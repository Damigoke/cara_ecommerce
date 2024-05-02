"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.deleteorder = exports.allWooCommerceOrder = exports.createorder = void 0;
const cartModel_1 = require("../model/cartModel");
const config_1 = __importDefault(require("../config/config"));
// interface OrderData {
//   id: number;
//   status: string;
//   lineItems: any[]; // Assuming lineItems is an array of any type
// }
async function orderproductEndpoint(data) {
    try {
        const consumerKey = 'ck_221132231c8f0ef300cff6f468e047f1d8fa0b7e';
        const consumerSecret = 'cs_0af5d1b608af89c023c529637a66bdcfe1d11185';
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
// export async function getOrder(req: Request, res: Response) {
//      try {
//         const limit = req.query?.limit as number | undefined;
//         const offset = req.query?.offset as number | undefined
//      const cart = await cartModel.findAndCountAll({
//         limit: limit,
//         offset: offset
//      });
//     return res.status(200).json({msg: "You have successfully retrieve all data", data: cart.rows, count: cart.count, success: true});
//       } catch (error) {
//        console.error(error);
//      return res.status(500).json({ success: false });
//        }
// }
async function allWooCommerceOrder(req, res) {
    try {
        const response = await config_1.default.get('orders');
        res.json(response.data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.allWooCommerceOrder = allWooCommerceOrder;
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
        const consumerKey = 'ck_221132231c8f0ef300cff6f468e047f1d8fa0b7e';
        const consumerSecret = 'cs_0af5d1b608af89c023c529637a66bdcfe1d11185';
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
