const axios = require('axios');
const transaction = require('../model/transactionModel');
const order = require('../model/orderModel');
const Discount = require('../model/discountModel');
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const chatId = process.env.TELEGRAM_CHAT_ID;

const processPayment = async (req, res) => {
    const { account, bank, amount, description } = req.body;

    if (!account || !bank || !amount || !description) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    const qrCodeUrl = generateSePayQrCodeUrl(account, bank, amount, description);

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
            id, // transactionId
        } = req.body;

        // Biểu thức chính quy để lấy mã đơn hàng từ content
        const orderRegex = /Don hang (\w{24})/;  // Tìm mã đơn hàng 24 ký tự
        const discountRegex = /Ma (\w{10})/;    

        const orderMatch = content.match(orderRegex);
        if (!orderMatch || !orderMatch[1]) {
            return res.status(400).json({
                message: "Order ID not found in content",
            });
        }

        const orderId = orderMatch[1]; // Mã đơn hàng

        console.log(orderId,"orderId");
        // Lấy mã giảm giá từ content nếu có
        const discountMatch = content.match(discountRegex);
        const discountCode = discountMatch ? discountMatch[1] : null; // Nếu có mã giảm giá, lấy, nếu không thì là null

        console.log(discountCode,"discountCode");
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
            code:discountCode,
            content,
            transferType,
            description,
            transferAmount,
            referenceCode,
            accumulated,
            orderId,
        });

        const discountUpdate = await Discount.findOneAndUpdate(
            { code: discountCode },
            { $set: { used: true, usedByOrderId: orderId } },
            { new: true }
        )

        // Lấy chi tiết đơn hàng
        const orderDetail = await order.findOne({ _id: orderId });

        if (!orderDetail) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        // Cập nhật trạng thái thanh toán của đơn hàng
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

        // Gửi thông báo Telegram về giao dịch mới
        let sendMessageText = `${orderDetail.customer_name}\n\n`;

        orderDetail?.products?.forEach((product, index) => {
            sendMessageText += `${product.product_name} (${product.product_code})\n`;
            sendMessageText += `Roast Level: ${product.roast_level}\n`;
            sendMessageText += `Brew Type: ${product.brew_type}\n`;
            sendMessageText += `Weight: ${product.weight}\n`;
            sendMessageText += `Description: ${product.product_description}\n`;
            sendMessageText += `Price: ${product.price} VND\n`;
            sendMessageText += `Quantity: ${product.quantity}\n`;
            sendMessageText += `----------------------------\n`;
        });

        const sendMessageResult = await sendMessage(sendMessageText);
        if (!sendMessageResult.success) {
            return res.status(500).json({
                message: "Failed to send Telegram message",
                error: sendMessageResult.error,
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


// Hàm gửi tin nhắn Telegram
const sendMessage = async (message) => {
    if (!message) {
        return { success: false, message: 'Message is required' };
    }
    try {
        const response = await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        return { success: true, message: 'Message sent successfully', response };
    } catch (error) {
return { success: false, message: 'Failed to send message', error };
    }
};

const checkPayment = async (req, res) => {
  const { orderId } = req.params;  // Nhận orderId từ params

  try {
      const orderIdString = String(orderId);

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
module.exports = { processPayment, fallback , checkPayment };
