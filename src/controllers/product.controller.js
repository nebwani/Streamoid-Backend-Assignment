import ProductSchema from "../models/product.model"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"


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