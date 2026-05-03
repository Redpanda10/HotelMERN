const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,

      enum: [
        'pending',
        'confirmed',
        'cancelled',
      ],

      default: 'confirmed',
    },

    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Validate booking dates
bookingSchema.pre('validate', function (next) {
  try{if (this.checkOut <= this.checkIn) {
    return next(
      new Error(
        'Check-out date must be after check-in'
      )
    );
  }}catch(error)
  {throw new Error(error);}

});

// Faster booking queries
bookingSchema.index({
  room: 1,
  checkIn: 1,
  checkOut: 1,
});

bookingSchema.index({
  guest: 1,
});

module.exports = mongoose.model(
  'Booking',
  bookingSchema
);