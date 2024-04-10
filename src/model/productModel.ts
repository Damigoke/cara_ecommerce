import { DataTypes, Model } from 'sequelize';
import dbconnection from '../config/index';
import { Sequelize } from 'sequelize';
import { cartModel } from './cartModel';

export interface ProductAttributes {
    id: string;
    name: string;
    image: string;
    brand: string;
    category: string;
    description: string;
    price: number;
    userId: string;
}

export interface productInstance extends Model<ProductAttributes>, ProductAttributes { }

const sequelize = dbconnection()

export const productModel = sequelize.define<productInstance>('products', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, 
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        unique: true
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID
    }
});

sequelize.sync({ alter: false }).then(() => {
    console.log("poduct model Connected")
})