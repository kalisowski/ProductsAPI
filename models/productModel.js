const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  desc: {
    type: String,
    required: [true, 'Please add a description'],
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
  },
  unit: {
    type: String,
    required: [true, 'Please add a unit'],
  },
});

module.exports = mongoose.model('product', productSchema);
