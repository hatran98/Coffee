const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/PaymentController');
router.post('/process-sepay-payment' , paymentController.processPayment);
router.post('/fallback' , paymentController.fallback);
module.exports = router;