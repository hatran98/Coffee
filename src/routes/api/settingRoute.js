const express = require('express');
const router = express.Router();
const { changePassword, updateSettings , fetchSettings , createDiscount,checkDiscount , updateDiscount , getDiscountById , deleteDiscount} = require('../../controllers/SettingController');
const authenticateUser = require('../../middlewares/jwtMiddleware');

router.put('/change-password', authenticateUser, changePassword);
router.put('/update-settings', authenticateUser, updateSettings);
router.post('/create-discount', createDiscount);
router.post('/check-discount', checkDiscount);
router.patch('/update-discount/:id', updateDiscount);
router.get('/fetch-settings', fetchSettings);
router.get('/discount/:id', getDiscountById);
router.delete('/delete-discount/:id', deleteDiscount);
module.exports = router;