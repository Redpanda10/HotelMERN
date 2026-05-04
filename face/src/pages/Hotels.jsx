import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./hotels.css";
import HotelDetails from "./HotelDetails";
function Hotels() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/hotels"
        );

        setHotels(data);
        setFiltered(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    const result = hotels.filter((h) =>
      `${h.name} ${h.location?.city} ${h.location?.country}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFiltered(result);
  }, [search, hotels]);

  return (
    <div className="hotels-page">

      <div className="hotels-header">
        <h1>Find Hotels</h1>

        <input
          type="text"
          placeholder="Search by name, city, country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading">Loading hotels...</p>
      ) : filtered.length === 0 ? (
        <p className="empty">No hotels found</p>
      ) : (
        <div className="hotel-grid">
          {filtered.map((hotel) => (
            <div key={hotel._id} className="hotel-card" onClick={() => navigate(`/hotels/${hotel._id}`)}>

              <div className="hotel-img">
                {hotel.photos?.[0] ? (
                  <img src={hotel.photos[0]} alt={hotel.name} />
                ) : (
                  <div className="placeholder">No Image</div>
                )}
              </div>

              <div className="hotel-info">
                <h2>{hotel.name}</h2>
                <p>
                  {hotel.location?.city}, {hotel.location?.country}
                </p>

                <p className="desc">
                  {hotel.description?.slice(0, 80)}...
                </p>

                <button className="view-btn">
                  View Details
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Hotels;