const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_code: { 
        type: String, 
        required: true, 
        unique: true 
    },  
    product_name: { 
        type: String, 
        required: true 
    }, 
    product_type: {
        type: String,
        required: true,
        enum: ['general', 'specialty', 'lot'], 
        default: 'general',
    },  
    country: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Country', 
        required: true 
    }, 
    description: {
        type: String,
        default: '',
    },
    price: { 
        type: Number, 
        required: true, 
        min: 0 
    }, 
    limit: { 
        type: Number, 
        required: true, 
        default: 2, 
        min: 0 
    },  
    img: { 
        type: String,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i.test(v);
            },
            message: props => `${props.value} is not a valid image URL!`,
        },
    }, 
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, { 
    timestamps: true 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
