const express = require('express');
const app = express.Router();
const orderRoute = require ('./orderRoute');
const productRoute = require ('./productRoute');
const sepayRoute = require('./sepayRoute')
app.use('/orders', orderRoute);
app.use('/products', productRoute);
app.use('/sepay', sepayRoute);
module.exports = app;