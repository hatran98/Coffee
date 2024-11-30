const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  _id: { type: String, required: true },
  customer_name: { type: String, required: true },
  products: [
    {
      product_code: { type: String, ref: 'ProductModel', required: true },
      product_name: { type: String, required: true }, 
      product_description: { type: String, required: true },  
      product_type: { type: String, required: true },  
      brew_type: { type: String, required: true },  
      weight: { type: String, required: true },  
      roast_level: { type: String, required: true },  
      quantity: { type: Number, required: true, min: 1 }, 
      price: { type: Number, required: true }, 
    },
  ],
  discountCode: { type: String, default: null },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  payment_method: { type: String, enum: ['cod', 'sepay'], default: 'sepay' },
  payment_status: { type: String, enum: ['unpaid', 'paid', 'cancelled'], default: 'unpaid' },
  total_price: { type: Number, required: true }, 
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
