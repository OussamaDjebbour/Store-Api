import Product from '../models/product.js';

export const getAllProductsStatic = async (req, res) => {
  // const search = 'din';
  const products = await Product.find({
    // name: { $regex: search, $options: 'i' },
  }).select('name createdAt price');
  res.status(200).json({ products, nbHits: products.length });
};

export const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields } = req.query;
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

  if (fields) {
    const fieldsList = fields.trim().split(',').join(' ');
    result = result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result.skip(skip).limit(limit);

  const products = await result;

  res.status(200).json({ products, nbHits: products.length });
};
