const Order = require('../model/orderModel');

exports.createOrder = async (req, res) => {
  try {
    const { customer, discountCode, products, amount } = req.body;

    console.log(req.body, "Request data")

    // Kiểm tra dữ liệu đầu vào
    if (!customer || !products || products.length === 0) {
      return res.status(400).json({
        error: 'Thông tin khách hàng hoặc danh sách sản phẩm không hợp lệ.',
      });
    }

    // Kiểm tra giới hạn sản phẩm (nếu có)
    for (const product of products) {
      if (product.limit && product.quantity > product.limit) {
        return res.status(400).json({
          error: `Sản phẩm ${product.productCode} chỉ cho phép đặt tối đa ${product.limit} sản phẩm.`,
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
        product_description: product.productDescription,
        product_type: product.productType,
        brew_type: product.brewType,
        weight: product.weight,
        roast_level: product.roastLevel,
        price: parseFloat(product.price),
        quantity: product.quantity,
        limit: product.limit,
      })),
      total_price: amount, // Sử dụng amount từ request body
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
    DISCOUNT50: 50000, // Ví dụ giảm giá cố định
    DISCOUNT10: (totalPrice) => totalPrice * 0.1, // Giảm 10% tổng giá trị
  };

  // Kiểm tra mã giảm giá và trả về giá trị giảm
  return discounts[discountCode] ? discounts[discountCode] : null;
}

exports.fetchOrder = async () => {
  try {
    const orders = await Order.find({ payment_status: 'paid' }).sort({ created_at: -1 });
    return orders; 
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng:', error);
    throw new Error('Lỗi hệ thống khi lấy đơn hàng');
  }
};
