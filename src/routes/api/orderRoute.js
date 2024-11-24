const express = require('express');
const router = express.Router();
const OrderController = require('../../controllers/OderController');

// Route để thêm báo giá mới
router.post('/', OrderController.createOrder);

module.exports = router;
