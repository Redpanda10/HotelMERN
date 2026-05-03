// const router = require('express').Router();
// const {
//   getAllRooms,
//   getRoomById,
//   createRoom,
//   updateRoom,
//   deleteRoom,
// } = require('../controller/roomController');
// const { verifyToken, requireOwner } = require('../middleware/authMiddleware');

// // Public routes
// router.get('/',    getAllRooms);
// router.get('/:id', getRoomById);

// // Owner-only routes
// router.post('/',      verifyToken, requireOwner, createRoom);
// router.put('/:id',    verifyToken, requireOwner, updateRoom);
// router.delete('/:id', verifyToken, requireOwner, deleteRoom);

// module.exports = router;

const express = require('express');

const router = express.Router();

const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controller/roomController');

const {
  verifyToken,
  requireOwner,
} = require('../middleware/authMiddleware');

const validateObjectId = require(
  '../middleware/validateObjectId'
);


router.get(
  '/',
  getAllRooms
);

router.get(
  '/:id',
  validateObjectId,
  getRoomById
);

router.post(
  '/',
  verifyToken,
  requireOwner,
  createRoom
);

router.put(
  '/:id',
  verifyToken,
  requireOwner,
  validateObjectId,
  updateRoom
);

router.delete(
  '/:id',
  verifyToken,
  requireOwner,
  validateObjectId,
  deleteRoom
);

module.exports = router;