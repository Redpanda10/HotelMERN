// const router = require('express').Router();
// const {
//   createBooking,
//   getMyBookings,
//   getIncomingBookings,
//   getBookingById,
//   cancelBooking,
// } = require('../controller/bookingController');
// const {
//   verifyToken,
//   requireGuest,
//   requireOwner,
// } = require('../middleware/authMiddleware');

// // Guest-only routes
// router.post('/',      verifyToken, requireGuest, createBooking);
// router.get('/my',     verifyToken, requireGuest, getMyBookings);
// router.delete('/:id', verifyToken, requireGuest, cancelBooking);

// // Owner-only routes
// router.get('/incoming', verifyToken, requireOwner, getIncomingBookings);

// // Any logged-in user (guest or owner)
// router.get('/:id', verifyToken, getBookingById);

// module.exports = router;

const express = require('express');

const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getIncomingBookings,
  getBookingById,
  cancelBooking,
} = require('../controller/bookingController');

const {
  verifyToken,
  requireGuest,
  requireOwner,
} = require('../middleware/authMiddleware');

const validateObjectId = require(
  '../middleware/validateObjectId'
);

// =========================================
// Guest Routes
// =========================================

router.post(
  '/',
  verifyToken,
  requireGuest,
  createBooking
);

router.get(
  '/my',
  verifyToken,
  requireGuest,
  getMyBookings
);

router.delete(
  '/:id',
  verifyToken,
  requireGuest,
  validateObjectId,
  cancelBooking
);

// =========================================
// Owner Routes
// =========================================

router.get(
  '/incoming',
  verifyToken,
  requireOwner,
  getIncomingBookings
);

// =========================================
// Shared Authenticated Route
// =========================================

// IMPORTANT:
// keep dynamic route LAST

router.get(
  '/:id',
  verifyToken,
  validateObjectId,
  getBookingById
);

module.exports = router;

// =========================================
// middleware/validateObjectId.js
// =========================================

