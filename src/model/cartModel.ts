import { DataTypes, Model } from 'sequelize';
import dbconnection from '../config/index';
import User from './userModel';
import { productModel } from './productModel';
import { Sequelize } from 'sequelize';

export interface CartAttributes {
    id: number;
    status: string;
    price: number;
    productId: number;
    userId: string;
}

export interface cartInstance extends Model<CartAttributes>, CartAttributes { }

const sequelize = dbconnection()

export const cartModel = sequelize.define<cartInstance>('carts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,

    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
        model: productModel,
        key: 'id',
      },
    },
    userId: {
        type: DataTypes.UUID,
        references: {
        model: User,
        key: 'id',
      },
    }
});

sequelize.sync({ alter: false }).then(() => {
    console.log("cart model Connected")
})

export default cartModel;