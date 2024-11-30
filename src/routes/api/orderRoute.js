const express = require('express');
const router = express.Router();
const OrderController = require('../../controllers/OrderController');
const orderModel = require('../../model/orderModel');
router.get('/', (req, res) => {
    res.render('order/order');
});
router.post('/', OrderController.createOrder);
router.get('/admin/orders', OrderController.fetchOrder) 
module.exports = router;
