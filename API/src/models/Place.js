const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    unique:true
  },
  address: {
    type: String,
    required: true
  },
  photos: {
    type: [String]
  },
  description: {
    type: String,
    required: true
  },
  perks: {
    type: [String]
  },
  extraInfo: String,
  type: { type: String, required: true },
  occupancy: { type: String, required: true },
  roomType: { type: String, required: true },
  leaseTerm: { type: String, required: true },
  maxGuests: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Place = mongoose.model('Place', PlaceSchema);

module.exports = Place; 