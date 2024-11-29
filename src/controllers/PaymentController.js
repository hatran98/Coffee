const axios = require('axios');
const transaction = require('../model/transactionModel');
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
      console.log("Received GET request for fallback:", req.body);
  
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
        id, // Lấy id từ req.body
      } = req.body;
  
      console.log("content" , content)
      // Kiểm tra xem transaction với ID này đã tồn tại chưa
      const existingTransaction = await transaction.findByPk(id);
      if (existingTransaction) {
        return res.status(400).json({
          message: "Transaction with this ID already exists",
        });
      }
  
      // Tạo mới transaction
      const newTransaction = await Transaction.create({
        id, // Sử dụng id từ req.body
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
      });

  
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
    const { id } = req.params;  
    try {
        const transaction = await transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        return res.json({ success: true, message: 'Transaction found', transaction });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = {processPayment , fallback , checkPayment };
