import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();
// export const DATABASE_URL = String(process.env.DATABASE_URL)
// const connection = mysql.createConnection(DATABASE_URL)
// console.log('Connected to PlanetScale!')
// connection.end()

// export const DB_NAME = String(process.env.DB_NAME);
// export const DB_HOST = String(process.env.DB_HOST);
// export const DB_USER = String(process.env.DB_USER) ;
// export const DB_PASSWORD = String(process.env.DB_PASSWORD);
export const DB_URL = String(process.env.DB_URL);
export const jwtsecret = process.env.JWT_SECRET as string;