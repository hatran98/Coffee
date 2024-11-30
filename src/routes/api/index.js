const express = require('express');
const app = express.Router();
const orderRoute = require ('./orderRoute');
const productRoute = require ('./productRoute');
const sepayRoute = require('./sepayRoute')
const settingRoute = require('./settingRoute')
app.use('/orders', orderRoute);
app.use('/products', productRoute);
app.use('/sepay', sepayRoute);
app.use('/settings', settingRoute);
module.exports = app;