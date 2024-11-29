const Order = require('../model/orderModel');
exports.createOrder = async (req, res) => {
  try {
    const { customer, discountCode, amount, products } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!customer || !products || products.length === 0) {
      return res.status(400).json({
        error: 'Thông tin khách hàng hoặc danh sách sản phẩm không hợp lệ.',
      });
    }

    // Tính tổng giá trị đơn hàng
    let totalPrice = 0;
    for (const product of products) {
      totalPrice += product.quantity * parseFloat(product.price);
    }

    // Kiểm tra giới hạn sản phẩm (nếu có)
    for (const product of products) {
      if (product.limit && product.quantity > product.limit) {
        return res.status(400).json({
          error: `Sản phẩm ${product.productCode} chỉ cho phép đặt tối đa ${product.limit} sản phẩm.`,
        });
      }
    }

    // Áp dụng mã giảm giá (nếu có)
    let finalPrice = totalPrice;
    if (discountCode) {
      // Ví dụ: Xử lý giảm giá tại đây (tùy theo logic hệ thống)
      const discountAmount = await checkDiscount(discountCode); // Hàm giả định để kiểm tra mã giảm giá
      if (discountAmount) {
        finalPrice -= discountAmount;
      } else {
        return res.status(400).json({
          error: 'Mã giảm giá không hợp lệ.',
        });
      }
    }

    // Tạo đối tượng đơn hàng mới
    const newOrder = new Order({
      customer_name: customer.fullName,
      customer_email: customer.email,
      customer_phone: customer.phone,
      products: products.map((product) => ({
        product_code: product.productCode,
        product_name: product.productName,
        quantity: product.quantity,
        price: parseFloat(product.price),
      })),
      total_price: totalPrice,
      final_price: finalPrice,
      discount_code: discountCode || null,
      payment_method: 'sepay', // Mặc định là 'sepay'
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    await newOrder.save();

    return res.status(201).json({
      message: 'Tạo đơn hàng thành công!',
      order: newOrder,
    });
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    return res.status(500).json({
      error: 'Lỗi hệ thống',
      details: error.message,
    });
  }
};

// Hàm giả định để kiểm tra mã giảm giá
async function checkDiscount(discountCode) {
  const discounts = {
    DISCOUNT50: 50000,
  };
  return discounts[discountCode] || null;
}
