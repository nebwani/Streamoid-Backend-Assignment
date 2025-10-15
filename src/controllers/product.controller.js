import ProductSchema from "../models/product.model"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { Op } from "sequelize";


// List Products
const listProducts = asyncHandler(async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1)*limit;

    const products = ProductSchema.findAll({offset, limit});

    return res
        .status(200)
        .json(new ApiResponse(200, products, "Products fetched successfully"));
})

// search products

const searchProducts = asyncHandler(async(req, res) => {
    const {brand, color, minPrice, maxPrice} = req.query;

    const where = {};

    if(brand) where.brand = brand;
    if(color) where.color = color;
    if(minPrice || maxPrice){
        if(minPrice) where.price[Op.gte] = parseFloat(minPrice);
        if(maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const products = await ProductSchema.findAll({where});

    return res.status(200).json(new ApiResponse(200, products, "Filtered products fetched successfully!"));
})

export {listProducts, searchProducts};