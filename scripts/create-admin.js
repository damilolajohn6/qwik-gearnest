const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

// Import the User model
const User = require('../models/User');

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gearnest');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gearnest.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      console.log('Created:', existingAdmin.createdAt);
      
      // Ask if user wants to update password
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise((resolve) => {
        rl.question('Do you want to update the admin password? (y/n): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() === 'y') {
        const newPassword = await new Promise((resolve) => {
          const rl2 = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });
          rl2.question('Enter new password: ', resolve);
          rl2.close();
        });

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        existingAdmin.password = hashedPassword;
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Admin password updated successfully!');
      }
      
      process.exit(0);
    }

    // Create new admin user
    const adminEmail = 'admin@gearnest.com';
    const adminPassword = 'admin123'; // Change this to a secure password
    
    console.log('🔐 Creating admin user...');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Role: admin');

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = new User({
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      phone: '+1234567890',
      address: {
        street: '123 Admin Street',
        city: 'Admin City',
        state: 'Admin State',
        zipCode: '12345',
        country: 'Nigeria'
      }
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Role: admin');
    console.log('🆔 ID:', admin._id);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
createAdmin();