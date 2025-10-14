import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const ProductSchema = sequelize.define("Product", {
    sku: 
    {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,

    },
    name:
    {
        type: DataTypes.STRING,
        allowNull: false,
    },
    brand:
    {
        type: DataTypes.STRING,
        allowNull: false,
    },
    color:
    {
        type: DataTypes.STRING,
    },
    size:
    {
        type: DataTypes.STRING,
    },
    mrp:
    {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    price:
    {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    quantity:
    {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
})

export default ProductSchema;