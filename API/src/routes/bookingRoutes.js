const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
} = require('../controllers/bookingController');

// Create a new booking
router.post('/', createBooking);

// Get bookings for logged-in user
router.get('/', getUserBookings);

// Get booking by ID
router.get('/:id', getBookingById);

// Update booking status (approved, cancelled, etc.)
router.put('/:id/status', updateBookingStatus);

module.exports = router;
