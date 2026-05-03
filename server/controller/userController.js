// const jwt  = require('jsonwebtoken');
// const User = require('../model/userModel');

// Helper: generate JWT token
// const signToken = (id, role) =>
//   jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// // Helper: shape user data for response (never send password)
// const userResponse = (user, token) => ({
//   token,
//   user: {
//     id:    user._id,
//     name:  user.name,
//     email: user.email,
//     role:  user.role,
//     phone: user.phone,
//     avatar: user.avatar,
//   },
// });

// // ── POST /api/users/register ───────────────────────────────────────────────
// // Body: { name, email, password, role: 'guest'|'owner' }
// exports.registerUser = async (req, res, next) => {


//     //get input data;
//     const{name , email, password, avatar, phone, role } = req.body;
// try{
//     //check if user already exists run error if exists else go on
//     const userExists = await User.findOne({email: email});

//     if(userExists) return res.status(500).json({message : 'user already exists'});


//     //check passwod len and run error if less than 6 char else go on
//     if(password.length()<6) return res.status(400).json({message:"password length must be greater than six characters"})

//     //create user and generate token
//     const user = await User.create({name, email, password, phone, avatar, role})

//     const token = signToken(user._id, user.role)



//     //send token and user data in respose except password
//     return res.status(200).json(userResponse(user,token))
// }catch(error){
//   return res.status(500).json({error:error})
// }
// }





// //   try {
// //     const { name, email, password, phone, role, avatar} = req.body;

// //     const userExists = await User.findOne({ email });
// //     if (userExists) {
// //       return res.status(400).json({ message: 'Email already registered' });
// //     }

// //     const user  = await User.create({ name, email, password, role });
// //     const token = signToken(user._id, user.role);

// //     res.status(201).json(userResponse(user, token));
// //   } catch (error) {
// //     next(error); // Passes to errorMiddleware
// //   }
// // };

// // ── POST /api/users/login ──────────────────────────────────────────────────
// // Body: { email, password }
// exports.loginUser = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user || !(await user.matchPassword(password))) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = signToken(user._id, user.role);
//     res.json(userResponse(user, token));
//   } catch (error) {
//     next(error);
//   }
// };

// // ── GET /api/users/profile ─────────────────────────────────────────────────
// // Protected: any logged-in user can view their own profile
// exports.getProfile = async (req, res, next) => {
//   try {
//     // req.user is set by verifyToken middleware
//     const user = await User.findById(req.user._id).select('-password');
//     res.json(user);
//   } catch (error) {
//     next(error);
//   }
// };

// // ── PUT /api/users/profile ─────────────────────────────────────────────────
// // Protected: update own profile (name, phone, avatar)
// exports.updateProfile = async (req, res, next) => {
//   try {
//     const { name, phone, avatar } = req.body;

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { name, phone, avatar },
//       { new: true, runValidators: true }
//     ).select('-password');

//     res.json(user);
//   } catch (error) {
//     next(error);
//   }
// };

const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

// Generate JWT token
const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Safe response formatter
const userResponse = (user, token) => ({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
  },
});

// Register User
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered',
      });
    }

    const allowedRoles = ['guest', 'owner'];

    const user = await User.create({
      name,
      email,
      password,
      role: allowedRoles.includes(role) ? role : 'guest',
    });

    const token = signToken(user._id, user.role);

    res.status(201).json(userResponse(user, token));
  } catch (error) {
    next(error);
  }
};

// Login User
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = signToken(user._id, user.role);

    res.json(userResponse(user, token));
  } catch (error) {
    next(error);
  }
};

// Get Profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update Profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;

    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        runValidators: true,
      }
    ).select('-password');

    res.json(user);
  } catch (error) {
    next(error);
  }
};