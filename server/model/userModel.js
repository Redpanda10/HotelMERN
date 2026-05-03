// const mongoose = require('mongoose');
// const bcrypt   = require('bcryptjs');

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Name is required'],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: [true, 'Password is required'],
//       minlength: 6,
//     },
//     // 🔑 This one field controls everything the user can/cannot do
//     role: {
//       type: String,
//       enum: ['guest', 'owner'],
//       default: 'guest',
//     },
//     phone: { type: String, required: false },
//     avatar: { type: String }, // URL to profile image
//   },
//   { timestamps: true }
// );

// // Hash password BEFORE saving — never store plain text
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// // Instance method: compare entered password with hashed one
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ['guest', 'owner'],
      default: 'guest',
    },

    phone: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before save
// Hash password before save
userSchema.pre('save', async function () { // Removed 'next' here
  try {
    if (!this.isModified('password')) {
      return; // Just return, no next() needed
    }

    this.password = await bcrypt.hash(this.password, 12);
    // No next() call needed here either
  } catch (error) {
    // If you need to throw an error so the save fails:
    throw new Error(error); 
  }
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' refers to the hashed password in the DB
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);