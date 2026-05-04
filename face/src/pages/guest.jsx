import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./guest.css";

function GuestDashboard() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          "http://localhost:5000/api/bookings/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookings(data || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(
          err.response?.data?.message ||
            "Failed to load bookings"
        );
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="guest-dashboard">

      <h1>Welcome, {user?.name}</h1>

      <h2>Your Bookings</h2>

      {loading && (
        <p className="loading">Loading...</p>
      )}

      {error && (
        <p className="error">{error}</p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <p className="empty-text">
          No bookings found
        </p>
      )}

      {!loading &&
        !error &&
        bookings.map((b) => (
          <div key={b._id} className="booking-card">

            <h3>{b.room?.hotel?.name}</h3>

            <p>
              <strong>Room:</strong>{" "}
              {b.room?.type}
            </p>

            <p>
              {new Date(
                b.checkIn
              ).toDateString()}{" "}
              →{" "}
              {new Date(
                b.checkOut
              ).toDateString()}
            </p>

            <p>
              <strong>Total:</strong> $
              {b.totalPrice}
            </p>

            <p className={`status ${b.status}`}>
              {b.status}
            </p>

          </div>
        ))}
    </div>
  );
}

export default GuestDashboard;