import Joi from 'joi';

export const registerUserSchema = Joi.object().keys({
    first_name: Joi.string().required(), 
    last_name: Joi.string().required(), 
    email:Joi.string().trim().lowercase().required(), 
    password: Joi.string().regex(/^[A-Za-z0-5]{2,8}$/).required(),
    confirmed_password: Joi.any().equal(Joi.ref('password')).required().label('confirm password').messages({'any.only': '{{#label}} does not match'})
});

export const alternative = {
    abortEarly:false,
    errors: {
        wrap: {
            label: '',
        },
    },

};

export const loginUserSchema = Joi.object().keys({
    email:Joi.string().trim().lowercase().required(), 
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
});

export const createProductSchema = Joi.object().keys({
    name: Joi.string().trim().required(), 
    Image: Joi.string().trim().required(), 
    brand: Joi.string().trim().required(), 
    category: Joi.string().trim().required(), 
    description: Joi.string().trim().required(), 
    price: Joi.number().required(), 
})

export const updateProductSchema = Joi.object().keys({  
    name: Joi.string().trim().required(), 
    Image: Joi.string().trim().required(), 
    brand: Joi.string().trim().required(), 
    category: Joi.string().trim().required(), 
    description: Joi.string().trim().required(), 
    price: Joi.number().required(),
})

export const createOrderSchema = Joi.object().keys({
    size: Joi.string().trim().required(),  
    price: Joi.number().required(), 
})