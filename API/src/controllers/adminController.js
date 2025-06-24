const User = require('../models/User');
const Place = require('../models/Place');
const Booking = require('../models/Booking');

const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Place.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const mostBookedArea = await Place.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'place',
          as: 'bookings'
        }
      },
      { $unwind: '$bookings' },
      {
        $group: {
          _id: '$address.city', // assuming your Place schema has address.city
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const topRatedPGs = await Place.find()
      .sort({ rating: -1 }) // assuming there's a `rating` field
      .limit(5)
      .select('title address rating');

    res.json({
      totalUsers,
      totalListings,
      totalBookings,
      mostBookedArea: mostBookedArea[0]?._id || 'N/A',
      topRatedPGs
    });
  } catch (err) {
    console.error('Admin analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

module.exports = {
  getAdminAnalytics
};
