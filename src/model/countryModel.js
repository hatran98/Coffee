const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const countrySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    flag: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, {
    timestamps: true,  
});

const Country = mongoose.model('Country', countrySchema);
module.exports = Country;
