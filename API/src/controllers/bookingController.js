const Booking = require('../models/Booking');
const { getUserDataFromReq } = require('../utils/auth');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const {
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
    } = req.body;

    const bookingDoc = await Booking.create({
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
      user: userData.id,
      status: 'pending', // default status
    });

    res.status(201).json(bookingDoc);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Get all bookings for the logged-in user
const getUserBookings = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const bookings = await Booking.find({ user: userData.id }).populate('place');
    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: userData.id
    }).populate('place');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// Update booking status (approve/reject/cancel/modify)
const updateBookingStatus = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'cancelled', 'modified'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Allow landlord to approve/reject, user to cancel/modify
    const isOwner = booking.place.toString() === userData.id;
    const isSelfBooking = booking.user.toString() === userData.id;

    if (
      (['approved', 'rejected'].includes(status) && !isOwner) ||
      (['cancelled', 'modified'].includes(status) && !isSelfBooking)
    ) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
};
