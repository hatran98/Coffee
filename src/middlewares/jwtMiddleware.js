require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('../model/userModel');

// Sử dụng cookie-parser middleware

const authenticateUser = async (req, res, next) => {
    // Kiểm tra xem có token trong cookie không
    const token = req.cookies.auth_token; // Lấy token từ cookie 'auth_token'
    
    if (!token) {
        // Nếu không có token, tiếp tục với middleware, để có thể chuyển hướng từ trang login
        return res.redirect('/login');
    }

    try {
        // Giải mã token và xác thực thông tin người dùng
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
        const user = await User.findOne({ _id: decoded.id });

        if (!user) {
            return res.status(401).json({ message: 'Người dùng không hợp lệ' });
        }

        // Lưu thông tin người dùng vào req.user để sử dụng trong các middleware và route sau
        req.user = user;

        next(); // Tiến hành xử lý tiếp theo
    } catch (error) {
        // Xử lý các lỗi liên quan đến xác thực và giải mã token
        return res.status(401).json({ message: 'Lỗi xác thực hoặc token không hợp lệ' });
    }
};

module.exports = authenticateUser;
