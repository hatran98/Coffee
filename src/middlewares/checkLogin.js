// middlewares/jwtMiddleware.js
const jwt = require('jsonwebtoken');

const checkAdmin = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.redirect('/admin/login'); // Nếu không có token, điều hướng về trang login
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Kiểm tra quyền admin (ví dụ, nếu decoded.role === 'admin')
    if (decoded.role === 'admin') {
      next(); // Cho phép tiếp tục truy cập vào các route admin
    } else {
      return res.redirect('/dashboard'); // Điều hướng về trang khác nếu không phải admin
    }
  } catch (error) {
    console.error('Token không hợp lệ:', error);
    return res.redirect('/login'); // Nếu token không hợp lệ, điều hướng về trang login
  }
};

module.exports = checkAdmin;
