import express from 'express';
import { getAllProducts } from '../controllers/products.js';
export const productsRouter = express.Router();

productsRouter.route('/').get(getAllProducts);
