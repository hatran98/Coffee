// routes/authRoute.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/userModel'); // Import model User
const checkAdmin = require('../middlewares/jwtMiddleware')
// Route hiển thị form đăng nhập
router.get('/admin/login', (req, res) => {
    if (req.cookies.auth_token) {
      return res.redirect('/admin'); 
    }
  
    res.render('login', { errorMessage: null });
  });

// Route xử lý đăng nhập
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Kiểm tra xem người dùng có tồn tại không
      const user = await User.findOne({ username });
      if (!user) {
        return res.render('login', { errorMessage: 'Tài khoản không tồn tại!' });
      }
  
      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.render('login', { errorMessage: 'Mật khẩu không đúng!' });
      }
  
      // Kiểm tra biến JWT_SECRET
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET không được cung cấp trong .env');
      }
  
      // Tạo token JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Lưu token vào cookie
      res.cookie('auth_token', token, { httpOnly: true });
  
      // Điều hướng đến trang admin sau khi đăng nhập thành công
      res.redirect('/admin');
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
  });

router.get('/admin/logout', async (req,res) => {
    res.clearCookie('auth_token');
    res.redirect('/login');
} )
module.exports = router;
