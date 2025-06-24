const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const Booking = require('../models/Booking');
const User = require('../models/User');

// GET /api/admin/analytics
router.get('/analytics', async (req, res) => {
  try {
    const totalListings = await Place.countDocuments();
    const pendingVisitRequests = await Booking.countDocuments({ status: 'pending' });
    const totalUsers = await User.countDocuments();

    const topBooked = await Booking.aggregate([
      {
        $group: {
          _id: '$place',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'places',
          localField: '_id',
          foreignField: '_id',
          as: 'place'
        }
      },
      { $unwind: '$place' },
      {
        $project: {
          _id: 0,
          placeId: '$place._id',
          title: '$place.title',
          count: 1
        }
      }
    ]);

    res.json({
      totalListings,
      pendingVisitRequests,
      totalUsers,
      topBooked
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
