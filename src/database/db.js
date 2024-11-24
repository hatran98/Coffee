const mongoose = require('mongoose');
require('dotenv').config(); 
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/price_db';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
