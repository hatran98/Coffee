require('dotenv').config();
const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser'); 
const morgan = require('morgan');
const path = require('path');
const app = express();
app.use(morgan('dev'));
app.use(cors()); 
app.use(cookieParser());


// Import kết nối database
require('./src/database/db'); // Import file db.js để thiết lập kết nối MongoDB

const User = require('./src/model/userModel'); // Import model User
const Settings = require('./src/model/settingModel'); // Import model Settings

const PORT = process.env.PORT || 3000;

// Import routes
const indexRoute = require('./src/routes/indexRoute');
const adminRoute = require('./src/routes/adminRoute');
const apiRoute = require('./src/routes/api/index')
const authRoute = require('./src/routes/authRoute')
// Middlewares
const checkAdmin = require('./src/middlewares/jwtMiddleware')
// Cấu hình EJS làm template engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/src/views"); // Đảm bảo đường dẫn tới đúng thư mục views

// Cấu hình bodyParser để đọc dữ liệu từ form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Đường dẫn tĩnh cho các file CSS, JS
app.use(express.static(path.join(__dirname, 'public')));

// Tạo dữ liệu mẫu nếu chưa có (tài khoản admin và cài đặt mặc định)
const createDefaultData = async () => {
  try {
    // Kiểm tra xem có tài khoản admin chưa
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      // Tạo tài khoản admin nếu chưa có
      const newAdmin = new User({
        username: 'admin',
        password: 'password123', // Bạn có thể mã hóa mật khẩu bằng bcrypt
      });
      await newAdmin.save();
      // Tạo cài đặt mặc định
      const newSettings = new Settings({
        bank_name: 'Ngân hàng XYZ',
        bank_account_number: '1234567890',
        modal_text: 'Chào mừng bạn đến với hệ thống quản lý!',
        admin_account_id: newAdmin._id,
      });
      await newSettings.save();

      console.log('Tạo tài khoản admin và cài đặt mặc định thành công!');
    } else {
      console.log('Tài khoản admin đã tồn tại.');
    }
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu:', error);
  }
};

// Tạo dữ liệu mẫu khi server khởi động
createDefaultData();

// Sử dụng các route
app.use('/', authRoute)
app.use('/', indexRoute);  
app.use('/', apiRoute);
app.use('/',checkAdmin, adminRoute);  
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
