const axios = require('axios');

const createPaymentTransaction = async (req, res) => {
    try {
        const { fullName, email, phone, totalAmount } = req.body;

        // Tạo order_id duy nhất
        const orderId = generateOrderId();

        // API Key của bạn, lấy từ tài khoản SePay
        const sepayKey = process.env.SEPAY_API_KEY;  

        // Gửi yêu cầu tạo giao dịch thanh toán tới API của SePay
        const response = await axios.post('https://api.sepay.vn/payment/create', {
            amount: totalAmount,
            order_id: orderId,
            customer_id: email,
            return_url: 'https://yourwebsite.com/payment/callback' // URL nhận phản hồi từ SePay
        }, {
            headers: {
                'Authorization': `Bearer ${sepayKey}`,  // Thêm API Key vào phần header
            }
        });

        if (response.data.success) {
            const qrCodeUrl = response.data.qr_code_url;
            res.json({
                success: true,
                qrCodeUrl: qrCodeUrl  // URL QR code để frontend hiển thị
            });
        } else {
            res.status(500).json({ success: false, message: 'Có lỗi trong quá trình tạo giao dịch thanh toán.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
    }
};

// Xử lý phản hồi callback từ SePay
const handlePaymentCallback = async (req, res) => {
    const { status, transactionId, orderId, amount } = req.query;

    try {
        if (status === 'success') {
            console.log(`Thanh toán thành công: ${transactionId}, ${amount} VND`);

            // Tạo hoặc cập nhật trạng thái đơn hàng trong cơ sở dữ liệu
            // Giả sử bạn có hàm updateOrderStatus để cập nhật trạng thái đơn hàng
            await updateOrderStatus(orderId, 'paid', transactionId, amount);  

            res.send('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
        } else {
            console.log('Thanh toán thất bại: ', status);
            res.send('Thanh toán không thành công. Vui lòng thử lại.');
        }
    } catch (error) {
        console.error('Lỗi khi xử lý callback thanh toán:', error);
        res.status(500).send('Đã xảy ra lỗi khi xử lý thanh toán.');
    }
};

// Hàm tạo orderId duy nhất (sử dụng thời gian hiện tại)
function generateOrderId() {
    return 'ORDER-' + Date.now(); 
}

// Hàm cập nhật trạng thái đơn hàng (giả sử bạn đã có)
async function updateOrderStatus(orderId, status, transactionId, amount) {
    // Giả sử bạn có model Order, cập nhật trạng thái đơn hàng
    const order = await Order.findOne({ where: { orderId: orderId } });
    if (order) {
        order.status = status;  // Cập nhật trạng thái thành "paid"
        order.transactionId = transactionId;  // Lưu transactionId
        order.amountPaid = amount;  // Lưu số tiền thanh toán
        await order.save();  // Lưu lại thông tin đơn hàng
        console.log(`Đơn hàng ${orderId} đã được cập nhật trạng thái thành công.`);
    } else {
        console.log(`Không tìm thấy đơn hàng với orderId: ${orderId}`);
    }
}

module.exports = { createPaymentTransaction, handlePaymentCallback };
