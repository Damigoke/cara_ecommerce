import express, { Request, Response, NextFunction } from 'express';
import {v4 as uuidv4} from 'uuid';
import  User  from '../model/userModel';
import { registerUserSchema, alternative, loginUserSchema } from '../utill/utill';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {productInstance} from '../model/productModel';
import { jwtsecret } from '../config/config';
import { productModel } from '../model/productModel';

export async function createUser(req: Request, res: Response) {
  try {
    const { first_name, last_name, email, password, confirmed_password } = req.body;
    const idv4 = uuidv4()

    const resultValidation = registerUserSchema.validate(req.body, alternative)
    
    if(resultValidation.error){
      return res.status(500).json({ error: resultValidation.error.details[0].message });
    }
    
    if (confirmed_password !== password) {
      return res.status(500).json({ error: "Password does not match" });
    }

    const hashPassword = await bcrypt.hash(password, 8)

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      const newUser = await User.create({ id: idv4, first_name, last_name, email, password: hashPassword });
      return res.status(200).json({ message: "User Created Successfully", data: newUser });
    }
    return res.status(400).json({ error: 'Email is already taken' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  };
}


export async function loginUser(req: Request, res: Response) {
  try {
    const {  email, password } = req.body;

    const resultValidation = loginUserSchema.validate(req.body, alternative)

    if(resultValidation.error){
      return res.status(400).json({error:resultValidation.error.details[0].message})
    }

    const user = await User.findOne({
      where: { email:email }
    }) as unknown as {[key: string]:string};
    
    let token = ""
    if (user.email === 'fopefaokunla@gmail.com') {
        const id  = user.id;

      token = jwt.sign({ id, role: 'admin' }, jwtsecret, { expiresIn: '1h' });
    } else {
      const id  = user.id;

    token = jwt.sign({ id }, jwtsecret, { expiresIn: '1h' });
    }
    

    const loginValidation = await bcrypt.compare(password, user.password)
    if(loginValidation){
      return res.status(200).json({data: user, token, success: true})
    }
    res.status(400).json({error:"Invalid email/password"});
  } catch (error) {
    console.error(error);

    return res.status(500).json({ Error: "Internal server error", success:false })
  };
}

export async function deleteUser(req: Request, res: Response) {
        try {
          const id = req.params.id;
        const user = await User.findOne({
            where:{id}
        });
        if(!user){
            return res.status(400).json({
                msg: "Cannot find the user"
            })
        }
        const deleteUser = await user.destroy();

       return res.status(200).json({ data: deleteUser, msg: "You have successfully deleted the product", success: true });
         } catch (error) {
          console.error(error);
       
        return res.status(500).json({ success: false });
          }
}
    
export async function getUserAndProduct(req: Request, res: Response) {
  try {
    const users = await User.findAndCountAll({
  include: [
    {
      model:productModel,
      as: 'products'
    }
  ]
});

    return res.status(200).json({
      data: users,
      count: users.count,
      success: true
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ Error: "Internal server error", success: false });
  }
}