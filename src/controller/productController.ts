import { updateProductSchema, alternative } from './../utill/utill';
import express, { Request, Response, NextFunction } from 'express';
import {v4 as uuidv4} from 'uuid';
import { productModel } from '../model/productModel';
// import login from '../model/userModel';

import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req: any, file: { originalname: string; }, cb: (arg0: null, arg1: string) => void) {
        const ext = path.extname(file.originalname);
        cb(null, uuidv4() + ext);
    }
});

const upload = multer({ storage: storage });

export async function CreateProduct(req: Request | any, res: Response) {
    try {
        const verified = req.user as { [key: string]: string };
        const id = uuidv4();
        const { name, brand, category, description, price } = req.body;
        const image = req.file.filename

        const productRecord = await productModel.create({
            id,
            name,
            image,
            brand,
            category,
            description: description.toString(), // Convert description to a string
            price: parseFloat(price),
            userId: verified?.id
        });

        const allProducts = await productModel.findAll();

        return res.status(200).json({ message: 'Product created successfully', allProducts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const uploadProductImages = upload.single('image');
 

export async function getProduct(req: Request, res: Response) {
     try {
       
        const limit = req.query?.limit as number | undefined;
        const offset = req.query?.offset as number | undefined
     const users = await productModel.findAndCountAll({
        limit: limit,
        offset: offset
     });
    return res.status(200).json({msg: "You have successfully retrieve all data", data: users.rows, count: users.count, success: true});
      } catch (error) {
       console.error(error);
    
     return res.status(500).json({ success: false });
       }
    }


    export async function UpdateProduct(req:Request, res:Response){
        try {
            const id = req.params.id


            const validResult = updateProductSchema.validate(req.body, alternative)
            if(validResult.error){
                res.status(400).json({Error:validResult.error.details[0].message})
            }
            const updateProduct = await productModel.findOne({where: {id} });
            if(!updateProduct){
                res.status(400).json({data: "Cannot Update the Product"})
            }
            const updatedProduct = await updateProduct?.update(req.body);
           return res.status(200).json({ data: updatedProduct, success: true });
        } catch (error) {
            console.error(error)
        return res.status(500).json({ success: false, error });
        }
    }

    export async function deleteProduct(req: Request, res: Response) {
        try {
          const id = req.params.id;
        const products = await productModel.findOne({
            where:{id}
        });
        if(!products){
            return res.status(400).json({
                msg: "Cannot find the user"
            })
        }
        const deleteProduct = await products.destroy();

       return res.status(200).json({ data: deleteProduct, msg: "You have successfully deleted the product", success: true });
         } catch (error) {
          console.error(error);
       
        return res.status(500).json({ success: false });
          }
    }
       
    export async function deleteAllProduct(req: Request, res: Response) {
        try {
        const products = await productModel.findAll();
        if(!products || products.length === 0){
            return res.status(400).json({
                msg: "Cannot find the user"
            })
        }
        const deleteProduct = await productModel.destroy({ where: {} });

       return res.status(200).json({ data: deleteProduct, msg: "You have successfully deleted all the product", success: true });
         } catch (error) {
          console.error(error);
       
        return res.status(500).json({ success: false });
          }
       }
   
