const express = require('express');
const router = express.Router();
const { changePassword, updateSettings , fetchSettings , createDiscount,checkDiscount} = require('../../controllers/SettingController');
const authenticateUser = require('../../middlewares/jwtMiddleware');

router.put('/change-password', authenticateUser, changePassword);
router.put('/update-settings', authenticateUser, updateSettings);
router.post('/create-discount', createDiscount);
router.post('/check-discount', checkDiscount);
router.get('/fetch-settings', fetchSettings);
module.exports = router;