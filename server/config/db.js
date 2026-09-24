const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lego-store');
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.log('❌ MongoDB error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
