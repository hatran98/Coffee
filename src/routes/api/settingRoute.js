const express = require('express');
const router = express.Router();
const { changePassword, updateSettings , fetchSettings , createDiscount,checkDiscount , updateDiscount , getDiscountById , deleteDiscount , createSpecialProduct , getSpecialProducts,updateSpecialProduct , deleteSpecialProduct} = require('../../controllers/SettingController');
const authenticateUser = require('../../middlewares/jwtMiddleware');

router.put('/change-password', authenticateUser, changePassword);
router.put('/update-settings', authenticateUser, updateSettings);
router.post('/create-discount', createDiscount);
router.post('/check-discount', checkDiscount);
router.post('/create-special-product',authenticateUser, createSpecialProduct);
router.patch('/update-discount/:id', updateDiscount);
router.post('/update-special-product/:id', authenticateUser, updateSpecialProduct);
router.get('/fetch-settings', fetchSettings);
router.get('/discount/:id', getDiscountById);
router.get('/get-special-products', authenticateUser, getSpecialProducts);
router.delete('/delete-discount/:id', deleteDiscount);
router.delete('/delete-special-product/:id', authenticateUser, deleteSpecialProduct);
module.exports = router;