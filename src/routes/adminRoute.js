const express = require('express');
const router = express.Router();
const Country = require('../model/countryModel');
const Product = require('../model/productModel');
const { createQuote , updateProduct } = require('../controllers/ProductController');

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
router.post('/admin/edit-product',updateProduct , (req , res) => {
    res.redirect('/admin');
})
router.get('/admin/orders', (req, res) => {
    res.render('admin/order');
});

module.exports = router;
