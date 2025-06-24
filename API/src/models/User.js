const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    },
    minlength: [6, 'Password must be at least 6 characters long']
  },
  googleId: {
    type: String,
    required: false,
    unique: false // allow multiple users with null googleId
  },
  role: {
    type: String,
    enum: ['student', 'landlord', 'admin'],
    required: [true, 'Role is required'],
    default: 'student'
  },
  // Landlord-specific fields
  propertyName: {
    type: String,
    required: function() {
      return this.role === 'landlord';
    }
  },
  propertyType: {
    type: String,
    enum: ['pg', 'flat'],
    required: function() {
      return this.role === 'landlord';
    }
  },
  propertyAddress: {
    type: String,
    required: function() {
      return this.role === 'landlord';
    }
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User; 