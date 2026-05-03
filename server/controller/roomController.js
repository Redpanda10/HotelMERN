// const Room  = require('../model/roomModel');
// const Hotel = require('../model/hotelModel');

// // ── GET /api/rooms?hotelId=xxx ─────────────────────────────────────────────
// // Public: list all rooms, optionally filtered by hotel
// exports.getAllRooms = async (req, res, next) => {
//   try {
//     const filter = {};
//     if (req.query.hotelId) filter.hotel = req.query.hotelId;

//     const rooms = await Room.find(filter)
//       .populate('hotel', 'name location');
//     res.json(rooms);
//   } catch (error) {
//     next(error);
//   }
// };

// // ── GET /api/rooms/:id ─────────────────────────────────────────────────────
// // Public: single room detail with hotel info
// exports.getRoomById = async (req, res, next) => {
//   try {
//     const room = await Room.findById(req.params.id)
//       .populate('hotel', 'name location amenities');
//     if (!room) return res.status(404).json({ message: 'Room not found' });
//     res.json(room);
//   } catch (error) {
//     next(error);
//   }
// };

// // ── POST /api/rooms ────────────────────────────────────────────────────────
// // Owner only: add a room to one of their hotels
// exports.createRoom = async (req, res, next) => {
//   try {
//     const hotel = await Hotel.findById(req.body.hotel);
//     if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

//     // Make sure this room is being added to the owner's OWN hotel
//     if (hotel.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not your hotel' });
//     }

//     const room = await Room.create(req.body);
//     res.status(201).json(room);
//   } catch (error) {
//     next(error);
//   }
// };

// // ── PUT /api/rooms/:id ─────────────────────────────────────────────────────
// // Owner only: update own room details or availability
// exports.updateRoom = async (req, res, next) => {
//   try {
//     const room = await Room.findById(req.params.id).populate('hotel');
//     if (!room) return res.status(404).json({ message: 'Room not found' });

//     if (room.hotel.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized to edit this room' });
//     }

//     const updated = await Room.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.json(updated);
//   } catch (error) {
//     next(error);
//   }
// };

// // ── DELETE /api/rooms/:id ──────────────────────────────────────────────────
// // Owner only: remove a room from their hotel
// exports.deleteRoom = async (req, res, next) => {
//   try {
//     const room = await Room.findById(req.params.id).populate('hotel');
//     if (!room) return res.status(404).json({ message: 'Room not found' });

//     if (room.hotel.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized to delete this room' });
//     }

//     await room.deleteOne();
//     res.json({ message: 'Room deleted successfully' });
//   } catch (error) {
//     next(error);
//   }
// };


const Room = require('../model/roomModel');
const Hotel = require('../model/hotelModel');

// Get all rooms
exports.getAllRooms = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.hotelId) {
      filter.hotel = req.query.hotelId;
    }

    const rooms = await Room.find(filter)
      .populate('hotel', 'name location')
      .sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

// Get room by ID
exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('hotel', 'name location amenities');

    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    res.json(room);
  } catch (error) {
    next(error);
  }
};

// Create room
exports.createRoom = async (req, res, next) => {
  try {
    const {
      hotel,
      type,
      title,
      description,
      pricePerNight,
      capacity,
      amenities,
      photos,
    } = req.body;

    const existingHotel = await Hotel.findById(hotel);

    if (!existingHotel) {
      return res.status(404).json({
        message: 'Hotel not found',
      });
    }

    if (
      existingHotel.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Not your hotel',
      });
    }

    const room = await Room.create({
      hotel,
      type,
      title,
      description,
      pricePerNight,
      capacity,
      amenities,
      photos,
    });

    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

// Update room
exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('hotel');

    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    if (
      room.hotel.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorized to edit this room',
      });
    }

    const allowedUpdates = {
      title: req.body.title,
      description: req.body.description,
      pricePerNight: req.body.pricePerNight,
      capacity: req.body.capacity,
      amenities: req.body.amenities,
      photos: req.body.photos,
      isAvailable: req.body.isAvailable,
    };

    Object.keys(allowedUpdates).forEach((key) => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

// Delete room
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('hotel');

    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    if (
      room.hotel.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorized to delete this room',
      });
    }

    await room.deleteOne();

    res.json({
      message: 'Room deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};