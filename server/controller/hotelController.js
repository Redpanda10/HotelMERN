// const Hotel = require('../model/hotelModel');

// // ── GET /api/hotels ────────────────────────────────────────────────────────
// // Public: anyone can browse hotels. Supports ?city= and ?country= filters.
// exports.getAllHotels = async (req, res, next) => {
//   try {
//     const { city, country } = req.query;
//     const filter = {};
//     if (city)    filter['location.city']    = new RegExp(city, 'i');
//     if (country) filter['location.country'] = new RegExp(country, 'i');

//     const hotels = await Hotel.find(filter)
//       .populate('owner', 'name email phone');

//     res.json(hotels);
//   } catch (error) {
//     next(error);
//   }
// };

// // ── GET /api/hotels/:id ────────────────────────────────────────────────────
// // Public: single hotel with full owner info
// exports.getHotelById = async (req, res, next) => {
//   try {
//     const hotel = await Hotel.findById(req.params.id)
//       .populate('owner', 'name email phone');

//     if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
//     res.json(hotel);
//   } catch (error) {
//     next(error);
//   }
// };

// // ── GET /api/hotels/owner/listings ────────────────────────────────────────
// // Owner only: see all hotels they have listed
// exports.getMyHotels = async (req, res, next) => {
//   try {
//     const hotels = await Hotel.find({ owner: req.user._id });
//     res.json(hotels);
//   } catch (error) {
//     next(error);
//   }
// };

// // ── POST /api/hotels ───────────────────────────────────────────────────────
// // Owner only: create a new hotel listing
// exports.createHotel = async (req, res, next) => {
//   try {
//     // req.user._id comes from verifyToken middleware
//     const hotel = await Hotel.create({ ...req.body, owner: req.user._id });
//     res.status(201).json(hotel);
//   } catch (error) {
//     next(error);
//   }
// };

// // ── PUT /api/hotels/:id ────────────────────────────────────────────────────
// // Owner only: update own hotel — blocks editing another owner's hotel
// exports.updateHotel = async (req, res, next) => {
//   try {
//     const hotel = await Hotel.findById(req.params.id);
//     if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

//     // Ownership check
//     if (hotel.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized to edit this hotel' });
//     }

//     const updated = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.json(updated);
//   } catch (error) {
//     next(error);
//   }
// };

// // ── DELETE /api/hotels/:id ─────────────────────────────────────────────────
// // Owner only: delete own hotel
// exports.deleteHotel = async (req, res, next) => {
//   try {
//     const hotel = await Hotel.findById(req.params.id);
//     if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

//     if (hotel.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized to delete this hotel' });
//     }

//     await hotel.deleteOne();
//     res.json({ message: 'Hotel deleted successfully' });
//   } catch (error) {
//     next(error);
//   }
// };

const Hotel = require('../model/hotelModel');

// Get all hotels
exports.getAllHotels = async (req, res, next) => {
  try {
    const { city, country } = req.query;

    const filter = {};

    if (city) {
      filter['location.city'] = new RegExp(city, 'i');
    }

    if (country) {
      filter['location.country'] = new RegExp(country, 'i');
    }

    const hotels = await Hotel.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(hotels);
  } catch (error) {
    next(error);
  }
};

// Get hotel by ID
exports.getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!hotel) {
      return res.status(404).json({
        message: 'Hotel not found',
      });
    }

    res.json(hotel);
  } catch (error) {
    next(error);
  }
};

// Get my hotels
exports.getMyHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.json(hotels);
  } catch (error) {
    next(error);
  }
};

// Create hotel
exports.createHotel = async (req, res, next) => {
  try {
    const {
      name,
      description,
      location,
      amenities,
      photos,
    } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        message: 'Hotel name and location are required',
      });
    }

    const hotel = await Hotel.create({
      name,
      description,
      location,
      amenities,
      photos,
      owner: req.user._id,
    });

    res.status(201).json(hotel);
  } catch (error) {
    next(error);
  }
};

// Update hotel
exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        message: 'Hotel not found',
      });
    }

    if (hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to edit this hotel',
      });
    }

    const allowedUpdates = {
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      amenities: req.body.amenities,
      photos: req.body.photos,
    };

    Object.keys(allowedUpdates).forEach((key) => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(updatedHotel);
  } catch (error) {
    next(error);
  }
};

// Delete hotel
exports.deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        message: 'Hotel not found',
      });
    }

    if (hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to delete this hotel',
      });
    }

    await hotel.deleteOne();

    res.json({
      message: 'Hotel deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};