const mongoose = require('mongoose');

// Schema cho sản phẩm đặc biệt (túi mù)
const specialProductSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    quantity_required: { // Số lượng sản phẩm cần mua để đủ điều kiện nhận túi mù
        type: Number,
        required: true,
        min: 1,
    },
    price: { // Giá của sản phẩm đặc biệt, nếu cần
        type: Number,
        default: 0, // Ví dụ giá 0 cho túi mù miễn phí
    },
    is_active: { // Trường xác định sản phẩm có được sử dụng hay không
        type: Boolean,
        default: true, // Mặc định là true, tức là sản phẩm đang được sử dụng
    }
}, { timestamps: true });

// Model SpecialProduct
const SpecialProduct = mongoose.model('SpecialProduct', specialProductSchema);

module.exports = SpecialProduct;
