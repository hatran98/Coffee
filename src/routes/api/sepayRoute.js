const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/PaymentController');

router.post('/create-payment-transaction', paymentController.createPaymentTransaction);

router.get('/payment/callback', paymentController.handlePaymentCallback);

module.exports = router;
