
import { DataTypes, Model } from "sequelize";
import dbconnection from "../config/index";
import { productModel } from './productModel';
import { cartModel } from './cartModel';

export interface IUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

interface UserInstance extends Model<IUser>, IUser {
    isAdmin: boolean;
}

const sequelize = dbconnection()

const User = sequelize.define<UserInstance>('user', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, 
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
    },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

sequelize.sync({ alter: false }).then(() => {
    console.log("User model Connected")
})
//User.hasMany(Post);
User.hasMany(productModel, { as: 'products' });
productModel.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

export default User;
