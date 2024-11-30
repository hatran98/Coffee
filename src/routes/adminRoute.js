const express = require('express');
const router = express.Router();
const Country = require('../model/countryModel');
const Product = require('../model/productModel');
const Order = require('../model/orderModel');
const User = require('../model/userModel');
const Settings = require('../model/settingModel');
const { createQuote , updateProduct } = require('../controllers/ProductController');
const {fetchOrder} = require('../controllers/OrderController')
const checkAdmin = require('../middlewares/jwtMiddleware');
router.get('/admin', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const perPage = 10;  

        const products = await Product.find()
            .populate('country')  
            .skip((page - 1) * perPage)  
            .limit(perPage);  

        const totalProducts = await Product.countDocuments();

        const countries = await Country.find();

        const totalPages = Math.ceil(totalProducts / perPage);

        res.render('admin', {
            countries,
            products,
            currentPage: page,
            totalPages
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.post('/admin/create-quote', createQuote);  // Xử lý tạo báo giá
router.post('/admin/edit-product',updateProduct);
router.get('/admin/orders', async (req, res) => {
    try {
      const orders = await fetchOrder();
  
      res.render('admin/order', { orders });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      res.status(500).send('Có lỗi xảy ra');
    }
});

router.get('/admin/order/:id', async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId);
      console.log(order,"order");
      if (!order) {
        return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
      }
      res.json(order);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
      res.status(500).json({ error: 'Lỗi hệ thống' });
    }
});

router.get('/admin/settings', checkAdmin, async (req, res) => {
    try {
        // Lấy thông tin người dùng từ req.user đã được xác thực bởi middleware checkAdmin
        const user = req.user;  // Vì thông tin người dùng đã được lưu vào req.user

        // Lấy thông tin cài đặt từ cơ sở dữ liệu
        const settings = await Settings.findOne({ admin_account_id: user._id });

        // Kiểm tra xem có tìm thấy người dùng và cài đặt hay không
        if (!user || !settings) {
            return res.status(404).send('Không tìm thấy người dùng hoặc cài đặt');
        }

        // Truyền thông tin người dùng và cài đặt vào view
        res.render('admin/settings', { user, settings });

    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng hoặc cài đặt:', error);
        res.status(500).send('Lỗi server');
    }
});
module.exports = router;
