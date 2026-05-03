const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,

      enum: [
        'standard',
        'deluxe',
        'suite',
        'penthouse',
      ],
    },

    description: {
      type: String,
      trim: true,
    },

    pricePerNight: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    photos: [
      {
        type: String,
      },
    ],

    isAvailable: {
      type: Boolean,
      default: true,
    },

    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Faster hotel room queries
roomSchema.index({ hotel: 1 });

module.exports = mongoose.model('Room', roomSchema);