import express from 'express';
import {
  getAllProductsStatic,
  getAllProducts,
} from '../controllers/products.js';
export const productsRouter = express.Router();

productsRouter.route('/').get(getAllProducts);
productsRouter.route('/static').get(getAllProductsStatic);
