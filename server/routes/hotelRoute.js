// const router = require('express').Router();
// const {
//   getAllHotels,
//   getHotelById,
//   getMyHotels,
//   createHotel,
//   updateHotel,
//   deleteHotel,
// } = require('../controller/hotelController');
// const { verifyToken, requireOwner } = require('../middleware/authMiddleware');

// // Public routes
// router.get('/',    getAllHotels);
// router.get('/:id', getHotelById);

// // Owner-only routes
// router.get('/owner/listings',  verifyToken, requireOwner, getMyHotels);
// router.post('/',               verifyToken, requireOwner, createHotel);
// router.put('/:id',             verifyToken, requireOwner, updateHotel);
// router.delete('/:id',          verifyToken, requireOwner, deleteHotel);

// module.exports = router;



const express = require('express');

const router = express.Router();

const {
  getAllHotels,
  getHotelById,
  getMyHotels,
  createHotel,
  updateHotel,
  deleteHotel,
} = require('../controller/hotelController');

const {
  verifyToken,
  requireOwner,
} = require('../middleware/authMiddleware');

const validateObjectId = require(
  '../middleware/validateObjectId'
);

// =========================================
// Public Routes
// =========================================

router.get(
  '/',
  getAllHotels
);

// IMPORTANT:
// specific routes BEFORE dynamic routes

router.get(
  '/owner/listings',
  verifyToken,
  requireOwner,
  getMyHotels
);

router.get(
  '/:id',
  validateObjectId,
  getHotelById
);

// =========================================
// Owner Routes
// =========================================

router.post(
  '/',
  verifyToken,
  requireOwner,
  createHotel
);

router.put(
  '/:id',
  verifyToken,
  requireOwner,
  validateObjectId,
  updateHotel
);

router.delete(
  '/:id',
  verifyToken,
  requireOwner,
  validateObjectId,
  deleteHotel
);

module.exports = router;


