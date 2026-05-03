// const Booking = require('../model/bookingModel');
// const Room    = require('../model/roomModel');
// const Hotel   = require('../model/hotelModel');

// // ── POST /api/bookings ─────────────────────────────────────────────────────
// // Guest only: create a new booking
// exports.createBooking = async (req, res, next) => {
//   try {
//     const { roomId, checkIn, checkOut, guests } = req.body;

//     // Validate room exists and is available
//     const room = await Room.findById(roomId);
//     if (!room)            return res.status(404).json({ message: 'Room not found' });
//     if (!room.isAvailable) return res.status(400).json({ message: 'Room is not available' });

//     // Calculate number of nights and total price
//     const msPerDay = 1000 * 60 * 60 * 24;
//     const nights   = Math.ceil((new Date(checkOut) - new Date(checkIn)) / msPerDay);
//     if (nights < 1) return res.status(400).json({ message: 'Check-out must be after check-in' });

//     const totalPrice = nights * room.pricePerNight;

//     const booking = await Booking.create({
//       room:    roomId,
//       guest:   req.user._id,   // from verifyToken
//       checkIn,
//       checkOut,
//       guests,
//       totalPrice,
//     });

//     // Populate room + hotel info for a rich response
//     await booking.populate({
//       path: 'room',
//       populate: { path: 'hotel', select: 'name location' },
//     });
//     await booking.populate('guest', 'name email');

//     res.status(201).json(booking);
//   } catch (error) {
//     next(error);
//   }
// };

// // ── GET /api/bookings/my ───────────────────────────────────────────────────
// // Guest only: see all their own bookings
// exports.getMyBookings = async (req, res, next) => {
//   try {
//     const bookings = await Booking.find({ guest: req.user._id })
//       .populate({
//         path: 'room',
//         populate: { path: 'hotel', select: 'name location photos' },
//       })
//       .sort({ createdAt: -1 }); // newest first

//     res.json(bookings);
//   } catch (error) {
//     next(error);
//   }
// };

// // ── GET /api/bookings/incoming ─────────────────────────────────────────────
// // Owner only: see all bookings made on rooms in their hotels
// exports.getIncomingBookings = async (req, res, next) => {
//   try {
//     // Step 1: find all hotels this owner owns
//     const myHotels = await Hotel.find({ owner: req.user._id }).select('_id');
//     const hotelIds = myHotels.map((h) => h._id);

//     // Step 2: find all rooms in those hotels
//     const myRooms = await Room.find({ hotel: { $in: hotelIds } }).select('_id');
//     const roomIds = myRooms.map((r) => r._id);

//     // Step 3: find all bookings for those rooms
//     const bookings = await Booking.find({ room: { $in: roomIds } })
//       .populate('guest', 'name email phone')
//       .populate({
//         path: 'room',
//         populate: { path: 'hotel', select: 'name location' },
//       })
//       .sort({ createdAt: -1 });

//     res.json(bookings);
//   } catch (error) {
//     next(error);
//   }
// };

// // ── GET /api/bookings/:id ──────────────────────────────────────────────────
// // Any logged-in user: get a single booking by ID
// exports.getBookingById = async (req, res, next) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//       .populate('guest', 'name email')
//       .populate({
//         path: 'room',
//         populate: { path: 'hotel', select: 'name location' },
//       });

//     if (!booking) return res.status(404).json({ message: 'Booking not found' });

//     // Allow only the guest who made it OR the hotel owner to view
//     const isGuest = booking.guest._id.toString() === req.user._id.toString();
//     const isOwner = req.user.role === 'owner';
//     if (!isGuest && !isOwner) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     res.json(booking);
//   } catch (error) {
//     next(error);
//   }
// };

// // ── DELETE /api/bookings/:id ───────────────────────────────────────────────
// // Guest only: cancel their own booking
// exports.cancelBooking = async (req, res, next) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) return res.status(404).json({ message: 'Booking not found' });

//     // Only the guest who created it can cancel it
//     if (booking.guest.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not your booking' });
//     }

//     if (booking.status === 'cancelled') {
//       return res.status(400).json({ message: 'Booking is already cancelled' });
//     }

//     booking.status = 'cancelled';
//     await booking.save();

//     res.json({ message: 'Booking cancelled successfully', booking });
//   } catch (error) {
//     next(error);
//   }
// };




const Booking = require('../model/bookingModel');
const Room = require('../model/roomModel');
const Hotel = require('../model/hotelModel');

// Create booking
exports.createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      guests,
    } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        message: 'Room and dates are required',
      });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    if (!room.isAvailable) {
      return res.status(400).json({
        message: 'Room is not available',
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const msPerDay = 1000 * 60 * 60 * 24;

    const nights = Math.ceil(
      (checkOutDate - checkInDate) / msPerDay
    );

    if (nights < 1) {
      return res.status(400).json({
        message: 'Check-out must be after check-in',
      });
    }

    // Prevent overlapping bookings
    const conflictingBooking = await Booking.findOne({
      room: roomId,
      status: { $ne: 'cancelled' },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate },
        },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        message: 'Room already booked for selected dates',
      });
    }

    const totalPrice = nights * room.pricePerNight;

    const booking = await Booking.create({
      room: roomId,
      guest: req.user._id,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    });

    await booking.populate({
      path: 'room',
      populate: {
        path: 'hotel',
        select: 'name location',
      },
    });

    await booking.populate(
      'guest',
      'name email'
    );

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

// Get my bookings
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      guest: req.user._id,
    })
      .populate({
        path: 'room',
        populate: {
          path: 'hotel',
          select: 'name location photos',
        },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// Get incoming bookings for hotel owners
exports.getIncomingBookings = async (req, res, next) => {
  try {
    const myHotels = await Hotel.find({
      owner: req.user._id,
    }).select('_id');

    const hotelIds = myHotels.map(
      (hotel) => hotel._id
    );

    const myRooms = await Room.find({
      hotel: { $in: hotelIds },
    }).select('_id');

    const roomIds = myRooms.map(
      (room) => room._id
    );

    const bookings = await Booking.find({
      room: { $in: roomIds },
    })
      .populate('guest', 'name email phone')
      .populate({
        path: 'room',
        populate: {
          path: 'hotel',
          select: 'name location',
        },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// Get booking by ID
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('guest', 'name email')
      .populate({
        path: 'room',
        populate: {
          path: 'hotel',
          select: 'name location owner',
        },
      });

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    const isGuest =
      booking.guest._id.toString() ===
      req.user._id.toString();

    const isHotelOwner =
      booking.room.hotel.owner.toString() ===
      req.user._id.toString();

    if (!isGuest && !isHotelOwner) {
      return res.status(403).json({
        message: 'Not authorized',
      });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// Cancel booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    if (
      booking.guest.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: 'Not your booking',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        message: 'Booking already cancelled',
      });
    }

    booking.status = 'cancelled';

    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

