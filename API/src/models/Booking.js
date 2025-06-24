const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'modified'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
