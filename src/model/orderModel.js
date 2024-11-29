const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  customer_name: { type: String, required: true },
  products: [
    {
      product_code: { type: String, ref: 'ProductModel', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }, 
    },
  ],
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  payment_method: { type: String, enum: ['cod', 'sepay'], default: 'sepay' },
  payment_status: { type: String, enum: ['unpaid', 'paid', 'cancelled'], default: 'unpaid' },
  total_price: { type: Number, required: true }, 
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
