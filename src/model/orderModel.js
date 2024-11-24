const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  customer_name: { type: String, required: true },
  products: [
    {
      product_id: { type: Schema.Types.ObjectId, ref: 'ProductModel', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }, 
    },
  ],
  limit: { type: Number, required: true },
  total_price: { type: Number, required: true }, 
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
