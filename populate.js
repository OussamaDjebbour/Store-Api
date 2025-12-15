import 'dotenv/config';

import { connectDB } from './db/connect.js';
import Product from './models/product.js';

// import './products.json';
import jsonProducts from './products.json' with { type: 'json' };


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany()
    await Product.create(jsonProducts)
    console.log('suceess!!!');
    process.exit(0)
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
};

start();
