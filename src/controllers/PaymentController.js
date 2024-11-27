const axios = require('axios');

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
    console.log("Received GET request for fallback:", req.body);

    const { transaction_id, status, order_id, amount } = req.body;

    if (status === 'success') {
        try {
            await updateOrderStatus(order_id, 'paid'); 
            return res.status(200).json({
                success: true,
                message: "Order payment confirmed and updated"
            });
        } catch (error) {
            console.error("Error updating order status:", error);
            return res.status(500).json({
                success: false,
                message: "Error updating order status"
            });
        }
    } else {
        return res.status(200).json({
            success: false,
            message: "Payment failed or unknown status"
        });
    }
}


module.exports = {processPayment , fallback };
