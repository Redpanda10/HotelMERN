const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const connectDB       = require('./config/db');
const userRouter      = require('./routes/userRoute');
const hotelRouter     = require('./routes/hotelRoute');
const roomRouter      = require('./routes/roomRoute');
const bookingRouter   = require('./routes/bookingRoute');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users',    userRouter);
app.use('/api/hotels',   hotelRouter);
app.use('/api/rooms',    roomRouter);
app.use('/api/bookings', bookingRouter);

// ── Health check ────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: '🏨 Hotel Booking API running' }));

// ── Global Error Handler (must be last) ─────────────────
app.use(errorHandler);

// ── Start ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});