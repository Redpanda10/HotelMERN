// const express = require("express");
// const router = express.Router();
// const rateLimit = require("express-rate-limit");
// const protect = require("../middleware/authMiddleware");


// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max:10,// limit each IP to 5 requests per windowMs    
//     message: {
//         message: "Too many login attempts, please try again after 15 minutes"
//     }
// });



// const authController = require("../controller/userController");

// router.post('/register', authController.registerUser);
// router.post('/login', loginLimiter, authController.loginUser);



// module.exports = router;

const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require('../controller/userController');

const {
  verifyToken,
} = require('../middleware/authMiddleware');

// Rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 5,

  message: {
    message:
      'Too many authentication attempts. Please try again after 15 minutes.',
  },

  standardHeaders: true,

  legacyHeaders: false,
});

// Public routes
router.post(
  '/register',
  authLimiter,
  registerUser
);

router.post(
  '/login',
  authLimiter,
  loginUser
);

// Protected routes
router.get(
  '/profile',
  verifyToken,
  getProfile
);

router.put(
  '/profile',
  verifyToken,
  updateProfile
);

module.exports = router;