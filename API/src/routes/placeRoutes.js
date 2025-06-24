const express = require('express');
const { requireAdmin } = require('../utils/auth');
const router = express.Router();
const {
  createPlace,
  getUserPlaces,
  getPlaceById,
  updatePlace,
  getAllPlaces,
  getPendingPlaces,
  approvePlace,
  rejectPlace
} = require('../controllers/placeController');

router.post('/', createPlace);
router.get('/user-places', getUserPlaces);
router.get('/:id', getPlaceById);
router.put('/', updatePlace);
router.get('/', getAllPlaces);
router.get('/admin/pending', getPendingPlaces);
router.patch('/admin/:id/approve', approvePlace);
router.patch('/admin/:id/reject',  rejectPlace);

module.exports = router; 