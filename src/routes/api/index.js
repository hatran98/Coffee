const express = require('express');
const app = express.Router();
const orderRoute = require ('./orderRoute');
const productRoute = require ('./productRoute');
app.use('/orders', orderRoute);
app.use('/products', productRoute);
module.exports = app;