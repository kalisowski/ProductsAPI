const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(express.json());
app.use('/api/products', require('./routes/productRoutes'));

app.listen(port, () => console.log(`Server running on port ${port}`));
