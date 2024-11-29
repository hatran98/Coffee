const axios = require('axios');
const transaction = require('../model/transactionModel');
const order = require('../model/orderModel');
const processPayment = async (req,res) => {
    const { account, bank, amount, description } = req.body;

    if (!account || !bank || !amount || !description) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    // Tạo URL mã QR từ thông tin thanh toán
    const qrCodeUrl = generateSePayQrCodeUrl(account, bank, amount, description);

    // Trả về URL mã QR từ SePay
    return res.json({
        success: true,
        qrCodeUrl
    });
}

const generateSePayQrCodeUrl = (account, bank, amount, description) => {
    const url = `https://qr.sepay.vn/img?acc=${account}&bank=${bank}&amount=${amount}&des=${description}`;
    return url;
}


const fallback = async (req, res) => {
    try {
      const {
        gateway,
        transactionDate,
        accountNumber,
        subAccount,
        code,
        content,
        transferType,
        description,
        transferAmount,
        referenceCode,
        accumulated,
        id, // Thay đổi từ id sang transactionId
      } = req.body;
  
      // Biểu thức chính quy để lấy mã đơn hàng từ content
      const regex = /Thanh toan don hang (\w{24})/; // Biểu thức chính quy tìm mã đơn hàng 24 ký tự
      const match = content.match(regex);
      
      // Kiểm tra xem có tìm thấy mã đơn hàng trong content không
      if (!match || !match[1]) {
        return res.status(400).json({
          message: "Order ID not found in content",
        });
      }
      
      const orderId = match[1]; // Lấy mã đơn hàng
  
      // Kiểm tra xem transaction với transactionId đã tồn tại chưa
      const existingTransaction = await transaction.findOne({ transactionId: id });
      if (existingTransaction) {
        return res.status(400).json({
          message: "Transaction with this ID already exists",
        });
      }
  
      // Tạo mới transaction
      const newTransaction = await transaction.create({
        transactionId: id, 
        gateway,
        transactionDate,
        accountNumber,
        subAccount,
        code,
        content,
        transferType,
        description,
        transferAmount,
        referenceCode,
        accumulated,
        orderId, 
      });

      const updatedOrder = await order.findOneAndUpdate(
        { _id: orderId },
        { $set: { payment_status: "paid" } },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
  
      return res.status(201).json({
        message: "Transaction saved successfully",
        transaction: newTransaction,
      });
    } catch (error) {
      console.error("Error saving transaction:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };
  

  


  const checkPayment = async (req, res) => {
    const { orderId } = req.params;  // Nhận orderId từ params

    try {
        // Kiểm tra nếu orderId là số, chuyển về chuỗi để khớp với SchemaString trong DB
        const orderIdString = String(orderId);

        // Tìm transaction với orderId (chú ý tìm với orderId là chuỗi)
        const transactionData = await transaction.findOne({ orderId: orderIdString });

        if (!transactionData) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        return res.json({ success: true, message: 'Transaction found', transactionData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


module.exports = {processPayment , fallback , checkPayment };
