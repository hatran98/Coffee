const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho Transaction
const transactionSchema = new Schema(
  
  {
    transactionId: {
      type: String,
      required: true,
    },
    gateway: {
      type: String,
      required: true, // Cổng thanh toán (ví dụ: KienLongBank)
    },
    transactionDate: {
      type: Date,
      required: true, // Thời gian giao dịch
    },
    accountNumber: {
      type: String,
      required: true, // Số tài khoản người gửi
    },
    subAccount: {
      type: String,
      required: true, // Số tài khoản phụ (subAccount)
    },
    code: {
      type: String,
      default: null, // Mã giao dịch (nếu có)
    },
    content: {
      type: String,
      required: true, // Nội dung giao dịch
    },
    transferType: {
      type: String,
      enum: ['in', 'out'], // Loại giao dịch: 'in' (chuyển vào) hoặc 'out' (chuyển ra)
      required: true,
    },
    description: {
      type: String,
      required: true, // Mô tả chi tiết giao dịch
    },
    transferAmount: {
      type: Number,
      required: true, // Số tiền giao dịch
    },
    referenceCode: {
      type: String,
      required: true, // Mã tham chiếu
    },
    accumulated: {
      type: Number,
      default: 0, // Số dư tích lũy
    },
    orderId : {
      type: String,
      required: true
    }
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model từ schema
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
