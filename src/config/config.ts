import dotenv from 'dotenv';
import mysql from 'mysql2';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; 

dotenv.config();
 export const DATABASE_URL = String(process.env.DATABASE_URL)

// export const DB_NAME = String(process.env.DB_NAME);
// export const DB_HOST = String(process.env.DB_HOST);
// export const DB_USER = String(process.env.DB_USER) ;
// export const DB_PASSWORD = String(process.env.DB_PASSWORD);
export const DB_URL = String(process.env.DB_URL);
export const jwtsecret = process.env.JWT_SECRET as string;

  
// Create a new instance of the WooCommerce API 
const api = new WooCommerceRestApi({ 
    url: "https://woo-impossibly-dependable-whispers.wpcomstaging.com/", 
  
     // Enter your api key 
    consumerKey: 'ck_e576d6900528be88b08ddda9cfb0c38a8261fc86', 
    
    // Enter your secret given by woocommerce 
    consumerSecret: 'cs_0e83f4e256cc79c784e4dff583bddc6c7e8598e0', 
    version: "wc/v3" // Set the API version 
}); 
export default api;