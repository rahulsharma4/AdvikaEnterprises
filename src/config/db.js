const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS servers to resolve MongoDB Atlas SRV records on Windows
try {
  if (process.platform === 'win32') {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  }
} catch (error) {
  console.warn('Could not set custom DNS servers:', error.message);
}

const seedAdminUser = async () => {
  try {
    const User = require('../models/userModel');
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      console.log('No admin user found in database. Auto-seeding initial Admin user...');
      const adminEmail = (process.env.ADMIN_EMAIL || 'bhaskarpoweruk@gmail.com').toLowerCase().trim();
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

      const adminUser = new User({
        name: process.env.ADMIN_NAME || 'Bhaskar Power Admin',
        email: adminEmail,
        phone: process.env.ADMIN_PHONE || '9410710758',
        password: adminPassword,
        role: 'admin',
        status: 'active',
      });

      await adminUser.save();
      console.log(`Initial Admin User Created Automatically: ${adminEmail}`);
    }
  } catch (error) {
    console.error('Error auto-seeding admin user:', error.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedAdminUser();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

