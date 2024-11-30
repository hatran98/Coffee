const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Để mã hóa mật khẩu

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Đảm bảo tên đăng nhập là duy nhất
  },
  password: {
    type: String,
    required: true,
  },
  is_logged_in: {
    type: Boolean,
    default: false, // Trạng thái đăng nhập
  },
}, {
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

// Mã hóa mật khẩu trước khi lưu vào database
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Kiểm tra mật khẩu khi đăng nhập
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Tạo model từ schema
const User = mongoose.model('User', userSchema);

module.exports = User;
