import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./hotelDetails.css";

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const hotelRes = await axios.get(
          `http://localhost:5000/api/hotels/${id}`
        );

        const roomRes = await axios.get(
          `http://localhost:5000/api/rooms?hotelId=${id}`
        );

        setHotel(hotelRes.data);
        setRooms(roomRes.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [id]);

  const handleBooking = async (roomId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return navigate("/login");
      }

      if (!bookingData.checkIn || !bookingData.checkOut) {
        return alert("Please select check-in and check-out dates");
      }

      await axios.post(
        "http://localhost:5000/api/bookings",
        {
          roomId,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: Number(bookingData.guests),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Room booked successfully!");

      setRooms((prev) =>
        prev.map((room) =>
          room._id === roomId ? { ...room, isBooked: true } : room
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  if (loading) return <p className="loading">Loading hotel...</p>;
  if (!hotel) return <p className="error">Hotel not found</p>;

  return (
    <div className="hotel-details">

      <div className="hotel-banner">
        <h1>{hotel.name}</h1>
        <p>
          {hotel.location?.city}, {hotel.location?.country}
        </p>
      </div>

      <div className="hotel-section">
        <h2>About Hotel</h2>
        <p>{hotel.description}</p>
      </div>

      <div className="hotel-section">
        <h2>Amenities</h2>
        <div className="amenities">
          {hotel.amenities?.map((a, i) => (
            <span key={i}>{a}</span>
          ))}
        </div>
      </div>

      {/* BOOKING CONTROLS */}
      <div className="booking-box">
        <h3>Select Booking Details</h3>

        <input
          type="date"
          value={bookingData.checkIn}
          onChange={(e) =>
            setBookingData({ ...bookingData, checkIn: e.target.value })
          }
        />

        <input
          type="date"
          value={bookingData.checkOut}
          onChange={(e) =>
            setBookingData({ ...bookingData, checkOut: e.target.value })
          }
        />

        <input
          type="number"
          min="1"
          value={bookingData.guests}
          onChange={(e) =>
            setBookingData({ ...bookingData, guests: e.target.value })
          }
        />
      </div>

      {/* ROOMS */}
      <div className="hotel-section">
        <h2>Available Rooms</h2>

        {rooms.length === 0 ? (
          <p>No rooms available</p>
        ) : (
          <div className="room-grid">
            {rooms.map((room) => (
              <div key={room._id} className="room-card">

                <div className="room-img">
                  {room.photos?.[0] ? (
                    <img src={room.photos[0]} alt={room.type} />
                  ) : (
                    <div className="placeholder">No Image</div>
                  )}
                </div>

                <div className="room-info">
                  <h3>{room.type}</h3>
                  <p>{room.description}</p>
                  <p>Capacity: {room.capacity}</p>
                  <p className="price">
                    ${room.pricePerNight} / night
                  </p>

                  <button
                    className={`book-btn ${room.isBooked ? "booked" : ""}`}
                    disabled={room.isBooked}
                    onClick={() => handleBooking(room._id)}
                  >
                    {room.isBooked ? "Booked" : "Book Now"}
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default HotelDetails;