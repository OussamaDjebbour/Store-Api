import 'dotenv/config';
import 'express-async-errors';
// async errors

import express from 'express';
const app = express();

import { connectDB } from './db/connect.js';
import { productsRouter } from './routes/products.js';

import { notFound as notFoundMiddleware } from './middleware/not-found.js';
import { errorHandlerMiddleware as errorMiddleware } from './middleware/error-handler.js';

// Middleware
app.use(express.json());

// Routes

app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">Products route</a>');
});

app.use('/api/v1/products', productsRouter);

// Products Route

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT ?? 3000;

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port: ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
