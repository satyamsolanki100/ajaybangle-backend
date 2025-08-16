const Product = require('../models/Product');

// GET /api/products?keyword=&category=&minPrice=&maxPrice=&sort=price|-price|newest|popularity&page=1&limit=12
const getProducts = async (req, res) => {
  const {
    keyword = '',
    category,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    limit = 12
  } = req.query;

  const query = {};
  if (keyword) query.name = { $regex: keyword, $options: 'i' };
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  let sortObj = { createdAt: -1 };
  if (sort === 'price') sortObj = { price: 1 };
  if (sort === '-price') sortObj = { price: -1 };
  if (sort === 'popularity') sortObj = { popularity: -1 };

  const pageNum = Number(page);
  const pageSize = Number(limit);

  const [items, total] = await Promise.all([
    Product.find(query).sort(sortObj).skip((pageNum - 1) * pageSize).limit(pageSize),
    Product.countDocuments(query)
  ]);

  res.json({
    items,
    total,
    page: pageNum,
    pages: Math.ceil(total / pageSize)
  });
};

// GET /api/products/:idOrSlug
const getProduct = async (req, res) => {
  const id = req.params.id;
  let product = null;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(id);
  } else {
    product = await Product.findOne({ slug: id });
  }
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// Admin: POST /api/products
const createProduct = async (req, res) => {
  const body = req.body;
  const p = await Product.create(body);
  res.status(201).json(p);
};

// Admin: PUT /api/products/:id
const updateProduct = async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
};

// Admin: DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
