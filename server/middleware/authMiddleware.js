// const jwt  = require('jsonwebtoken');
// const User = require('../model/userModel');

// // ── verifyToken ────────────────────────────────────────────────────────────
// // Runs on every protected route.
// // Reads the JWT from the Authorization header, verifies it,
// // and attaches the full user object to req.user for controllers to use.
// const verifyToken = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token — access denied' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select('-password');
//     if (!req.user) return res.status(401).json({ message: 'User not found' });
//     next();
//   } catch {
//     res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// // ── requireOwner ───────────────────────────────────────────────────────────
// // Only users with role:'owner' can pass.
// // Always use AFTER verifyToken:
// //   router.post('/hotels', verifyToken, requireOwner, createHotel)
// const requireOwner = (req, res, next) => {
//   if (req.user?.role !== 'owner') {
//     return res.status(403).json({ message: 'Access denied — owners only' });
//   }
//   next();
// };

// // ── requireGuest ───────────────────────────────────────────────────────────
// // Only users with role:'guest' can pass.
// // Always use AFTER verifyToken:
// //   router.post('/bookings', verifyToken, requireGuest, createBooking)
// const requireGuest = (req, res, next) => {
//   if (req.user?.role !== 'guest') {
//     return res.status(403).json({ message: 'Access denied — guests only' });
//   }
//   next();
// };

// module.exports = { verifyToken, requireOwner, requireGuest };

// =========================================
// middleware/authMiddleware.js
// =========================================

const jwt = require('jsonwebtoken');

const User = require('../model/userModel');

// =========================================
// Verify JWT Token
// =========================================

const verifyToken = async (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    // Check authorization header
    if (
      !authHeader ||
      !authHeader.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        success: false,
        message:
          'Access denied. No token provided.',
      });
    }

    // Extract token
    const token =
      authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user
    const user = await User.findById(
      decoded.id
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

const requireOwner = (
  req,
  res,
  next
) => {
  if (
    !req.user ||
    req.user.role !== 'owner'
  ) {
    return res.status(403).json({
      success: false,
      message:
        'Access denied. Owners only.',
    });
  }

  next();
};


const requireGuest = (
  req,
  res,
  next
) => {
  if (
    !req.user ||
    req.user.role !== 'guest'
  ) {
    return res.status(403).json({
      success: false,
      message:
        'Access denied. Guests only.',
    });
  }

  next();
};

module.exports = {
  verifyToken,
  requireOwner,
  requireGuest,
};

