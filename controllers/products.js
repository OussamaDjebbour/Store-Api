import Product from '../models/product.js';

export const getAllProductsStatic = async (req, res) => {
  // const search = 'din';
  const products = await Product.find({
    // name: { $regex: search, $options: 'i' },
  }).sort('name');
  res.status(200).json({ products, nbHits: products.length });
};

export const getAllProducts = async (req, res) => {
  const { featured, company, name, sort } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }

  let result = Product.find(queryObject);

  if (sort) {
    const sortList = sort.trim().split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }

  const products = await result;

  res.status(200).json({ products, nbHits: products.length });
};
