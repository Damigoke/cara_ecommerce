import { DataTypes, Model } from 'sequelize';
import dbconnection from '../config/index';
import { Sequelize } from 'sequelize';

export interface CartAttributes {
    id: string;
    size: string;
    price: number;
    userId: string;
}

export interface cartInstance extends Model<CartAttributes>, CartAttributes { }

const sequelize = dbconnection()

export const cartModel = sequelize.define<cartInstance>('carts', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    size: {
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
    console.log("cart model Connected")
})

export default cartModel;