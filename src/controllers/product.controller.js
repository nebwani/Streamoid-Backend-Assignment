import ProductSchema from "../models/product.model"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { Op } from "sequelize";
import fs from "fs"
import csv from "csv-parser"


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


//upload products

const uploadProducts = asyncHandler(async(req, res)=>{
    if(!req.file){
        throw new ApiError(400, "No file uploaded");
    }

    const filePath = req.file.path;
    const validRows = [];
    const failedRows = [];

    const stream =  fs.createReadStream(filePath).pipe(csv())

    stream.on("data", (row) => {
    try {
      const { sku, name, brand, color, size, mrp, price, quantity } = row;

      if (!sku || !name || !brand || !mrp || !price) {
        throw new Error("Missing required fields");
      }

      if (Number(price) > Number(mrp)) {
        throw new Error("Price cannot exceed MRP");
      }

      if (Number(quantity) < 0) {
        throw new Error("Invalid quantity");
      }

      validRows.push({
        sku,
        name,
        brand,
        color,
        size,
        mrp: parseFloat(mrp),
        price: parseFloat(price),
        quantity: parseInt(quantity),
      });
    } catch (err) {
      failedRows.push({ row, error: err.message });
    }
  });

  stream.on("end", async() => {
    await ProductSchema.bulkCreate(validRows, { ignoreDuplicates: true });
    fs.unlinkSync(filePath);
    return res.status(200).json(new ApiResponse(200, {stored: validRows.length, failedRows}));
  });
})

export {listProducts, searchProducts, uploadProducts};