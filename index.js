require('dotenv').config();
const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const path = require('path');
const app = express();
app.use(morgan('dev'))
app.use(cors()); 
// Import kết nối database
require('./src/database/db'); // Import file db.js để thiết lập kết nối MongoDB

const PORT = process.env.PORT || 3000;
// Import routes
const indexRoute = require('./src/routes/indexRoute');
const adminRoute = require('./src/routes/adminRoute');
const apiRoute = require('./src/routes/api/index')
// Cấu hình EJS làm template engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/src/views"); // Đảm bảo đường dẫn tới đúng thư mục views

// Cấu hình bodyParser để đọc dữ liệu từ form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Đường dẫn tĩnh cho các file CSS, JS
app.use(express.static(path.join(__dirname, 'public')));

// Sử dụng các route
app.use('/', indexRoute);  
app.use('/', adminRoute);  
app.use('/', apiRoute);


app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
