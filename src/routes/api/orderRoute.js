const express = require('express');
const router = express.Router();
const OrderController = require('../../controllers/OrderController');

router.get('/', (req, res) => {
    res.render('order/order');
});
router.post('/', OrderController.createOrder);

module.exports = router;
