import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./owner.css";
import { ToastContainer, toast } from 'react-toastify';

function OwnerDashboard() {
  const { user } = useAuth();

  const notify = () => toast("Sucessfully Added !");

  const [ Hotel, addHotel] = useState(false);
  const [ Room, addRoom ] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [hotelForm, setHotelForm] = useState({
    name: "",
    description: "",
    city: "",
    country: "",
    photos: "",
    amenities: "",
  });

  const [roomForm, setRoomForm] = useState({
    hotel: "",
    type: "",
    pricePerNight: "",
    capacity: "",
    photos: "",
  });

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Authentication token missing");
        setLoading(false);
        return;
      }

      const [bookingRes, hotelRes] = await Promise.all([
        axios.get("http://localhost:5000/api/bookings/incoming", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/hotels/owner/listings", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setBookings(bookingRes.data || []);
      setHotels(hotelRes.data || []);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleHotelSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/hotels",
        {
          name: hotelForm.name,
          description: hotelForm.description,
          location: {
            city: hotelForm.city,
            country: hotelForm.country,
          },
          photos: hotelForm.photos.split(","),
          amenities: hotelForm.amenities.split(","),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setHotelForm({
        name: "",
        description: "",
        city: "",
        country: "",
        photos: "",
        amenities: "",
      });

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/rooms",
        {
          hotel: roomForm.hotel,
          type: roomForm.type,
          pricePerNight: roomForm.pricePerNight,
          capacity: roomForm.capacity,
          photos: roomForm.photos.split(","),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRoomForm({
        hotel: "",
        type: "",
        pricePerNight: "",
        capacity: "",
        photos: "",
      });

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="owner-dashboard">

      <h1>Owner Dashboard - {user?.name}</h1>

      {loading && <p className="loading">Loading dashboard...</p>}
      {error && <p className="error">{error}</p>}


      {/* HOTELS */}
      <section>
        <h2>Your Hotels</h2>

        {!loading && hotels.length === 0 && (
          <p className="empty-text">No hotels yet</p>
        )}

        {hotels.map((h) => (
          <div key={h._id} className="hotel-card">
            <h3>{h.name}</h3>
            <p>
              {h.location?.city}, {h.location?.country}
            </p>
          </div>
        ))}
      </section>

      {/* BOOKINGS */}
      <section>
        <h2>Incoming Bookings</h2>

        {!loading && bookings.length === 0 && (
          <p className="empty-text">No bookings yet</p>
        )}

        {bookings.map((b) => (
          <div key={b._id} className="booking-card">
            <h3>{b.room?.hotel?.name}</h3>
            <p>Guest: {b.guest?.name}</p>
            <p>Room: {b.room?.type}</p>
            <p>
              {new Date(b.checkIn).toDateString()} →{" "}
              {new Date(b.checkOut).toDateString()}
            </p>
            <p className={`status ${b.status}`}>{b.status}</p>
          </div>
        ))}
      </section>

      {/* ADD HOTEL */}
      {Hotel&&(<div className="form-card">
        <h2>Add Hotel</h2>

        <form onSubmit={handleHotelSubmit}>
          <input
            placeholder="Hotel Name"
            value={hotelForm.name}
            onChange={(e) =>
              setHotelForm({ ...hotelForm, name: e.target.value })
            }
          />

          <input
            placeholder="Description"
            value={hotelForm.description}
            onChange={(e) =>
              setHotelForm({ ...hotelForm, description: e.target.value })
            }
          />

          <input
            placeholder="City"
            value={hotelForm.city}
            onChange={(e) =>
              setHotelForm({ ...hotelForm, city: e.target.value })
            }
          />

          <input
            placeholder="Country"
            value={hotelForm.country}
            onChange={(e) =>
              setHotelForm({ ...hotelForm, country: e.target.value })
            }
          />

          <input
            placeholder="Photos (comma separated URLs)"
            value={hotelForm.photos}
            onChange={(e) =>
              setHotelForm({ ...hotelForm, photos: e.target.value })
            }
          />

          <input
            placeholder="Amenities (comma separated)"
            value={hotelForm.amenities}
            onChange={(e) =>
              setHotelForm({ ...hotelForm, amenities: e.target.value })
            }
          />

          <button type="submit" onClick={()=>{
            addHotel(!Hotel);
            notify();
          }}>Add Hotel</button>
        </form>
      </div>)}
      {!Hotel && (<div onClick={()=>addHotel(!Hotel)}>
        <h1>Click Here To Add The Hotel</h1>
        <button>
            Add Now
        </button>
      </div>)}

      {/* ADD ROOM */}
      {Room&&(<div className="form-card">
        <h2>Add Room</h2>

        <form onSubmit={handleRoomSubmit}>
          <select
            value={roomForm.hotel}
            onChange={(e) =>
              setRoomForm({ ...roomForm, hotel: e.target.value })
            }
          >
            <option value="">Select Hotel</option>
            {hotels.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Room Type"
            value={roomForm.type}
            onChange={(e) =>
              setRoomForm({ ...roomForm, type: e.target.value })
            }
          />

          <input
            placeholder="Price Per Night"
            type="number"
            value={roomForm.pricePerNight}
            onChange={(e) =>
              setRoomForm({ ...roomForm, pricePerNight: e.target.value })
            }
          />

          <input
            placeholder="Capacity"
            type="number"
            value={roomForm.capacity}
            onChange={(e) =>
              setRoomForm({ ...roomForm, capacity: e.target.value })
            }
          />

          <input
            placeholder="Photos (comma separated)"
            value={roomForm.photos}
            onChange={(e) =>
              setRoomForm({ ...roomForm, photos: e.target.value })
            }
          />

          <button type="submit" onClick={()=>{
            addRoom(!Room);
            notify();
          }}>Add Room</button>
        </form>
        

      </div>)}

      {!Room && (<div onClick={()=>addRoom(!Room)}>
        <h1>Click Here To Add The Rooms</h1>
        <button>
            show
        </button>
      </div>)}
          <ToastContainer />
    </div>
  );
}

export default OwnerDashboard;