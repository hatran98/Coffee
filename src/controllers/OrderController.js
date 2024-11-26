const Product = require('../model/productModel');
const Order = require('../model/orderModel');

exports.createOrder = async (req, res) => {
    try {
      const { customer_name, products } = req.body;
  
      // Lấy danh sách các sản phẩm từ bảng Pricing
      const productIds = products.map(p => p.product_id);
      const productData = await Product.find({ _id: { $in: productIds } });
  
      if (!productData || productData.length !== products.length) {
        return res.status(400).json({
          error: 'Một hoặc nhiều sản phẩm không tồn tại trong hệ thống.',
        });
      }
  
      // Kiểm tra giới hạn từng sản phẩm
      for (const product of products) {
        const pricingProduct = pricingData.find(p => p._id.toString() === product.product_id);
  
        if (!pricingProduct) {
          return res.status(400).json({ error: `Sản phẩm ID ${product.product_id} không hợp lệ.` });
        }
  
        if (product.quantity > pricingProduct.limit) {
          return res.status(400).json({
            error: `Sản phẩm ${pricingProduct.product_name} chỉ có thể mua tối đa ${pricingProduct.limit} sản phẩm.`,
          });
        }
      }
  
      // Tính tổng giá đơn hàng
      const totalPrice = products.reduce((sum, item) => sum + item.quantity * item.price, 0);
  
      // Lưu đơn hàng
      const newOrder = new Order({
        customer_name,
        products,
        total_price: totalPrice,
      });
  
      await newOrder.save();
  
      return res.status(201).json({
        message: 'Tạo đơn hàng thành công',
        order: newOrder,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Lỗi hệ thống',
        details: error.message,
      });
    }
  };



  