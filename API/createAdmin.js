require('dotenv').config({ path: require('path').resolve(__dirname, './.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User'); // Corrected path

const MONGO_URL = process.env.MONGO_URL;

async function createAdmin() {
  if (!MONGO_URL) {
    console.error('MONGO_URL not found in .env file');
    process.exit(1);
  }
  await mongoose.connect(MONGO_URL);

  const email = 'admin1@gmail.com';
  const password = bcrypt.hashSync('123', 10);
  const name = 'Admin';
  const role = 'admin';

  // Check if admin already exists
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  await User.create({ name, email, password, role });
  console.log('Admin user created!');
  process.exit(0);
}

createAdmin();