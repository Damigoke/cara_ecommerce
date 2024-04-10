import { cartModel } from "../model/cartModel";
import { createOrderSchema, alternative } from './../utill/utill';
import express, { Request, Response, NextFunction } from 'express';
import {v4 as uuidv4} from 'uuid';

export async function CreateOrder(req: Request | any, res: Response) { 
    console.log("Halleluyah")
    try {
        const verified = req.user as { [key: string]: string };
        const id = uuidv4();
        console.log(id)
        const { size, price } = req.body;
        const validResult = createOrderSchema.validate(req.body, alternative)
            if(validResult.error){
                res.status(400).json({Error:validResult.error.details[0].message})
            }
        const cartRecord = await cartModel.create({
            id,
            size,
            price,
            userId: verified?.id
        })
          console.log(cartRecord)
        const allcart = await cartModel.findAll()
      
        return res.status(200).json({ message: 'Order created sucessfully', cartRecord })
    } catch (error) { 
        console.log(error);
        res.status(500).json({ message: 'Invalid Server Error'})
    } 
} 

export async function getOrder(req: Request, res: Response) {
     try {
       
        const limit = req.query?.limit as number | undefined;
        const offset = req.query?.offset as number | undefined
     const cart = await cartModel.findAndCountAll({
        limit: limit,
        offset: offset
     });
    return res.status(200).json({msg: "You have successfully retrieve all data", data: cart.rows, count: cart.count, success: true});
      } catch (error) {
       console.error(error);
    
     return res.status(500).json({ success: false });
       }
}
    
    export async function deleteOrder(req: Request, res: Response) {
        try {
          const id = req.params.id;
        const carts = await cartModel.findOne({
            where:{id}
        });
        if(!carts){
            return res.status(400).json({
                msg: "Cannot find the user"
            })
        }
        const deleteCart = await carts.destroy();

       return res.status(200).json({ data: deleteCart, msg: "You have successfully deleted the product", success: true });
         } catch (error) {
          console.error(error);
       
        return res.status(500).json({ success: false });
          }
    }
       
    export async function deleteAllOrder(req: Request, res: Response) {
        try {
        const carts = await cartModel.findAll();
        if(!carts || carts.length === 0){
            return res.status(400).json({
                msg: "Cannot find the user"
            })
        }
        const deleteCart = await cartModel.destroy({ where: {} });

       return res.status(200).json({ data: deleteCart, msg: "You have successfully deleted all the product", success: true });
         } catch (error) {
          console.error(error);
       
        return res.status(500).json({ success: false });
          }
       }
   
