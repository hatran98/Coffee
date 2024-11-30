const mongoose = require('mongoose');

// Khai báo schema cho discount
const discountSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true, // Đảm bảo mã giảm giá là duy nhất
        minlength: [10, 'Mã giảm giá phải có ít nhất 10 ký tự'],
        maxlength: [10, 'Mã giảm giá không được vượt quá 10 ký tự'],
      },
    amount: {
        type: Number,
        required: true, // Giá trị giảm giá
    },
    type: {
        type: String,
        enum: ['fixed', 'percentage'], // Loại giảm giá: cố định hoặc phần trăm
        required: true,
    },
    expiresAt: {
        type: Date,
        required: false, // Thời gian hết hạn, có thể rỗng
    },
    used: {
        type: Boolean,
        default: false, // Để theo dõi xem mã giảm giá đã được sử dụng hay chưa
    },
    usedAt: {
        type: Date,
        required: false, // Thời gian sử dụng mã giảm giá
    },
    usedByOrderId: {
        type: String,
        ref: 'Order', // Nếu bạn lưu thông tin về đơn hàng, liên kết với bảng đơn hàng
        required: false, 
    }
}, { 
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt` vào mỗi bản ghi
});

// Tạo model từ schema
const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;
