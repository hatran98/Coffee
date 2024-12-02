const express = require('express');
const router = express.Router();
const productController = require('../../controllers/ProductController');

// Route để thêm báo giá mới
router.put('/productId/limit', productController.updateProductLimit);
router.delete('/delete-product/:productId', productController.deleteProduct);
router.post('/special-product', productController.checkSpecialProductCondition);
module.exports = router;
