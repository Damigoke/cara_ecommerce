import { cartModel } from "../model/cartModel";
import { productModel } from "../model/productModel";
import User from "../model/userModel"
import { createOrderSchema, alternative } from './../utill/utill';
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import api from "../config/config";


// interface OrderData {
//   id: number;
//   status: string;
//   lineItems: any[]; // Assuming lineItems is an array of any type
// }
async function orderproductEndpoint(data: any) {
    try {
        const consumerKey = 'ck_e576d6900528be88b08ddda9cfb0c38a8261fc86' 
        const consumerSecret = 'cs_0e83f4e256cc79c784e4dff583bddc6c7e8598e0'
        const _method = 'POST'
        const response = await api.post(`orders?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&method=${_method}`, data);
        const responseData = response.data;
        return responseData
    } catch (error: any) {
        console.error(error);
    }
}

export async function createorder(req: Request | any, res: Response) {
    try {
        const data = req.body
      const productIds = req.params.productIds
      console.log(productIds)
      const verified = req.user as { [key: string]: string };
      const result = await orderproductEndpoint(data);
      const { id, status, line_items } = result
      
    const lineItems = line_items.map((line_item: { price: string }) => line_item.price).join(',');

    await cartModel.create({
        id,
        status,
        price: parseFloat(lineItems),
        productId: productIds,
        userId: verified?.id
    });

       return res.json(result)
    } catch (error: any) {
        console.error(error);
         res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function confirmOrder(req: Request, res: Response) {
     try {

         const userId = req.params.id;
         const user = await User.findOne({
             where: {
                 id: userId
             },
             include: [
                 {
                model: cartModel,
                as: 'order'
                 },
             ],
         });
       
        const limit = req.query?.limit as number | undefined;
        const offset = req.query?.offset as number | undefined
         //const cart = await cartModel.update({ status: 'paid' }, { where: { userId: id } })
        //  const carts = await cartModel.findAll({where :{userId:id}})
    return res.status(200).json({msg: "You have successfully retrieve all data", data: user, success: true});
      } catch (error) {
       console.error(error);
    
     return res.status(500).json({ success: false });
       }
}

export async function updateOrderStatus(req: Request, res: Response) {
     try {

         const userId = req.query.id;

         if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ success: false, msg: 'Invalid or missing userId' });
        }
         const user = userId as string;
         
        const ids = req.body.id;
        if (!Array.isArray(ids) || ids.some(id => isNaN(parseInt(id)))) {
            return res.status(400).json({ success: false, msg: 'Invalid ID format' });
        }
         const data = {
             status: "completed"
         }

        await Promise.all(ids.map(async (id: number) => {
            await api.put(`orders/${id}`, data);
        }));
        const updateOrderStatus = await cartModel.update({ status: 'completed' }, { where: { userId: user } })
    return res.status(200).json({msg: "You have successfully retrieve all data", data: updateOrderStatus, success: true});
      } catch (error) {
       console.error(error);
    
     return res.status(500).json({ success: false });
       }
}
    
export async function allWooCommerceOrder(req: Request | any, res: Response) {

    try {
        const userId = req.query
        const response = await api.get('orders', {
            params: {
                customer: userId // Filter orders by customer ID
            }
        });
        res.json(response.data);
    } catch (error: any) {
        console.error(error);
         res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getsingleorder(req: Request | any, res: Response) {

    try {
        const id = req.params.id
        const userId = req.query
        const response = await api.get(`orders/${id}`);
    res.json({ data: response.data });
    } catch (error: any) {
     console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function singleWooCommerceEndpoint(id: number) {

    try {
      const response = await api.get(`orders/${id}`);
      const productId = response.data.id;
        // Return the product ID along with the response data
        return { productId };
    } catch (error: any) {
        console.error(error);
    }
}

async function deleteproductEndpoint(productId: number) { 
    try {
        const id = await singleWooCommerceEndpoint(productId);
        console.log("id ;", id)
        const consumerKey = 'ck_e576d6900528be88b08ddda9cfb0c38a8261fc86'
        const consumerSecret = 'cs_0e83f4e256cc79c784e4dff583bddc6c7e8598e0'
        const _method = 'DELETE'
        const response = await api.delete(`orders/${id?.productId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&method=${_method}`, {
                            force: true
                        });
        return response.data;
    } catch (error: any) {
        console.error(error);
    }
}

export async function deleteorder(req: Request | any, res: Response) { 
    try {
      const productId = req.params.productId;
        const deletedProduct = await deleteproductEndpoint(productId)
        const deletedProducts = await deleteOrder(productId)
      res.json({ message: "You have successfully delete an order", data: deletedProduct });
    } catch (error: any) {
        console.error(error);
         res.status(500).json({ error: 'Internal Server Error' });
    }
}
    export async function deleteOrder(productId: number) {
        try {
        const deleteCart = await cartModel.destroy({ where: { id: productId } });

       return deleteCart;
         } catch (error) {
          console.error(error);
          }
    }
   
