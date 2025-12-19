import Product from '../models/product.js';

export const getAllProductsStatic = async (req, res) => {
  // const search = 'din';
  const products = await Product.find({
    // name: { $regex: search, $options: 'i' },
  }).select('name createdAt price');
  res.status(200).json({ products, nbHits: products.length });
};

export const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
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

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };

    const regEx = /\b(<|<=|=|>|>=)\b/g;

    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    console.log(filters);

    const options = ['price', 'rating'];

    filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');

      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  console.log(queryObject);

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
