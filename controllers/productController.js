const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

const getProducts = asyncHandler(async (req, res) => {
  const { sort, search } = req.query;
  let findQuery = {};
  let sortQuery = {};
  if (search) {
    if (search == 'available') {
      findQuery = { amount: { $gt: 0 } };
    } else if (search == 'unavailable') {
      findQuery = { amount: { $eq: 0 } };
    } else {
      findQuery = {
        name: { $regex: search, $options: 'i' },
      };
    }
  }
  if (sort) {
    if (sort === 'name') {
      sortQuery = { name: 1 };
    }
    if (sort === 'price') {
      sortQuery = { price: 1 };
    }
    if (sort === 'amount') {
      sortQuery = { amount: 1 };
    }
  }

  const products = await Product.find(findQuery).sort(sortQuery);
  res.status(200).json(products);
});

const addProduct = asyncHandler(async (req, res) => {
  const { name, price, desc, amount, unit } = req.body;
  if ((!name || !price || !desc || !amount, !unit)) {
    res.status(400).json({ message: 'Please fill in all fields' });
  }
  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    res.status(400).json({ message: 'Product already exists' });
  }
  const product = await Product.create({
    name,
    price,
    desc,
    amount,
    unit,
  });
  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.desc = req.body.desc || product.desc;
    product.amount = req.body.amount || product.amount;
    product.unit = req.body.unit || product.unit;
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.status(200).json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

const stateofProducts = asyncHandler(async (req, res) => {
  const products = await Product.aggregate([
    {
      $project: {
        _id: 0,
        name: 1,
        amount: 1,
        price: 1,
        value: { $multiply: [{ $toInt: '$amount' }, '$price'] },
      },
    },
  ]);
  res.status(200).json(products);
});

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  stateofProducts,
};
