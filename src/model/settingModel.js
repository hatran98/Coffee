const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  bank_name: {
    type: String,
    required: true,
  },
  bank_account_number: {
    type: String,
    required: true,
  },
  modal_text: {
    type: String,
    required: true,
  },
  admin_account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
}, {
  timestamps: true,
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
