const Place = require('../models/Place');
const { getUserDataFromReq } = require('../utils/auth');

const createPlace = async (req, res) => {
  try {
    console.log('Received data for new place:', req.body);
    const userData = await getUserDataFromReq(req);
    const {
      title, address, addedPhotos, description, perks,
      extraInfo, price, type, occupancy, roomType, leaseTerm, maxGuests
    } = req.body;

    const placeDoc = await Place.create({
      owner: userData.id,
      title, address, photos: addedPhotos, description, perks,
      extraInfo, price, type, occupancy, roomType, leaseTerm, maxGuests,
      status: 'pending',
    });
    res.json(placeDoc);
  } catch (error) {
    console.error('Error creating place:', error);
    res.status(500).json({ error: 'Failed to create place' });
  }
};

const getUserPlaces = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const places = await Place.find({ owner: userData.id });
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user places' });
  }
};

const getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch place' });
  }
};

const updatePlace = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const {
      id, title, address, addedPhotos, description, perks,
      extraInfo, price, type, occupancy, roomType, leaseTerm, maxGuests
    } = req.body;

    const placeDoc = await Place.findById(id);
    if (!placeDoc) {
      return res.status(404).json({ error: 'Place not found' });
    }

    if (userData.id !== placeDoc.owner.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    placeDoc.set({
      title, address, photos: addedPhotos, description, perks,
      extraInfo, price, type, occupancy, roomType, leaseTerm, maxGuests,
      status: 'pending',
    });
    await placeDoc.save();
    res.json(placeDoc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update place' });
  }
};

const getAllPlaces = async (req,res) => {
  const places = await Place.find({ status: 'approved' });
  res.json(places);
};

const getPendingPlaces = async (req,res) => {
  const list = await Place.find({ status: 'pending' });
  res.json(list);
};

const approvePlace = async (req,res) => {
  await Place.findByIdAndUpdate(req.params.id, { status: 'approved' });
  res.json({ success:true });
};

const rejectPlace = async (req,res) => {
  await Place.findByIdAndUpdate(req.params.id, { status: 'rejected' });
  res.json({ success:true });
};

module.exports = {
  createPlace,
  getUserPlaces,
  getPlaceById,
  updatePlace,
  getAllPlaces,
  getPendingPlaces,
  approvePlace,
  rejectPlace
}; 