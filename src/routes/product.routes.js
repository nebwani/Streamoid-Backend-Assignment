import express from "express";
import multer from "multer";
import { listProducts, searchProducts, uploadProducts } from "../controllers/product.controller.js";


const router = express.Router();
const upload = multer({ dest: "uploads/" });


router.get("/", listProducts)
router.get("/search", searchProducts)

export default router;