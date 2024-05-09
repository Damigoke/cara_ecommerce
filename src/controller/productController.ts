import { updateProductSchema, alternative } from "./../utill/utill";
import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { productModel } from "../model/productModel";
import api from "../config/config";

import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (
    req: any,
    file: any,
    cb: (arg0: null, arg1: string) => void
  ) {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (
    req: any,
    file: { originalname: string },
    cb: (arg0: null, arg1: string) => void
  ) {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  },
});

const upload = multer({ storage: storage });
export async function allWooCommerceProducts(
  req: Request | any,
  res: Response
) {
  try {
    const response = await api.get("products");
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getSingleProducts(req: Request | any, res: Response) {
  try {
      const productId = req.params.productId
    const response = await api.get(`products/${productId}`);
    // Return the product ID along with the response data
    res.json({ data: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function callWooCommerceEndpoint(productId: number) {
  try {
    const response = await api.get(`products/${productId}`);
    const productIds = response.data.id;
    // Return the product ID along with the response data
    return { productIds };
  } catch (error) {
    console.error(error);
  }
}

async function createproductEndpoint(data: any) {
  try {
    console.log(data);
    const consumerKey = "ck_221132231c8f0ef300cff6f468e047f1d8fa0b7e";
    const consumerSecret = "cs_0af5d1b608af89c023c529637a66bdcfe1d11185";
    const _method = "POST";
    const response = await api.post(
      'products',
      data
    );
    const responseData = response.data;
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function createproduct(req: Request | any, res: Response) {
  try {
    const data = req.body;

    const Data = {
  name: data.name,
  type: data.type,
  regular_price: data.regular_price+"",
  sale_price: data.sale_price+"",
  description: data.description,
  short_description: data.short_description,
  categories:[
    {
      id: data.categories[0].id
    },
    {
      id:data.categories[1].id
    }
  ],
  images: [
    {
      src:data.images[0].src 
    }
  ]

    }
    
   

    const verified = req.user as { [key: string]: string };
    const productResult = await createproductEndpoint(Data);
    const {
      id,
      name,
      images,
      categories,
      description,
      regular_price,
    } = productResult;

    const imagesString = images
      .map((image: { src: string }) => image.src)
      .join(",");
    const category = categories
      .map((category: { name: string }) => category.name)
      .join(",");

    await productModel.create({
      id,
      name,
      image: imagesString,
      category: category,
      description: description,
      price: parseFloat(regular_price),
      userId: verified?.id,
    });
    res.json(productResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateproductEndpoint(data: any, productId: number) {
  try {
    const id = await callWooCommerceEndpoint(productId);
    console.log(id);
    const consumerKey = "ck_221132231c8f0ef300cff6f468e047f1d8fa0b7e";
    const consumerSecret = "cs_0af5d1b608af89c023c529637a66bdcfe1d11185";
    const _method = "PUT";
    const response = await api.put(
      `products/${id?.productIds}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&method=${_method}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateproduct(req: Request | any, res: Response) {
  try {
    const productId = req.params.productId;
    console.log(productId);
    const data = req.body;
    const updateProductResult = await updateproductEndpoint(data, productId);
    const {
      name,
      images,
      categories,
      description,
      regular_price,
    } = updateProductResult;
    const imagesString = images
      .map((image: { src: string }) => image.src)
      .join(",");
    const category = categories
      .map((category: { name: string }) => category.name)
      .join(",");
    const updatedProduct = await productModel.update(
      {
        name,
        image: imagesString,
        category,
        description,
        price: regular_price,
      },
      { where: { id: productId } }
    );
    res.json(updateProductResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteproductEndpoint(productId: any) {
  try {
    console.log(productId);
    const id = await callWooCommerceEndpoint(productId);
    console.log(id);
    const consumerKey = "ck_221132231c8f0ef300cff6f468e047f1d8fa0b7e";
    const consumerSecret = "cs_0af5d1b608af89c023c529637a66bdcfe1d11185";
    const _method = "DELETE";
    const response = await api.delete(
      `products/${id?.productIds}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&method=${_method}`,
      {
        force: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteproduct(req: Request | any, res: Response) {
  try {
    const productId = req.params.productId;
    const deletedProduct = await deleteproductEndpoint(productId);
    await productModel.destroy({
      where: { id: productId },
    });
    res.json(deletedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const uploadProductImages = upload.single("image");