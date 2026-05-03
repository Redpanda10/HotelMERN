const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: 10,
    },

    location: {
      address: {
        type: String,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        required: true,
        trim: true,
      },
    },

    photos: [
      {
        type: String,
      },
    ],

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search optimization
hotelSchema.index({
  'location.city': 1,
  'location.country': 1,
});

module.exports = mongoose.model('Hotel', hotelSchema);