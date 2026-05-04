import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const features = [
    {
      icon: "fas fa-shield-alt",
      title: "Secure Booking",
      desc: "Your data and payments are fully protected."
    },
    {
      icon: "fas fa-tags",
      title: "Best Prices",
      desc: "Guaranteed lowest prices for hotels."
    },
    {
      icon: "fas fa-headset",
      title: "24/7 Support",
      desc: "We are always here to help you."
    }
  ];

  const handleSearch = () => {
    if (location.trim()) {
      navigate(`/hotels?city=${location}`);
    }
  };

  return (
    <div className="home-container">

      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Stay in Nepal</h1>
          <p>Book luxury hotels, homestays, and resorts with Basai.</p>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button className="btn-search" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="highlights">
        <h2 className="section-title">Why Book With Us?</h2>

        <div className="highlight-grid">
          {features.map((item, index) => (
            <div className="highlight-card" key={index}>
              <i className={item.icon}></i>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hotel-cta">
        <div className="cta-banner">
          <h2>Are you a Hotel Owner?</h2>
          <p>
            List your property and reach thousands of travelers every month.
          </p>
          <Link to="/signup" className="btn-primary">
            List Your Hotel
          </Link>
        </div>
      </section>

      <section className="recent-hotels">
        <div className="section-header">
          <h2>Featured Destinations</h2>
          <Link to="/rooms" className="view-all">
            View All Rooms →
          </Link>
        </div>

        <div className="hotel-preview-grid">
          <div className="hotel-card-mini">
            <div className="hotel-img-placeholder">Kathmandu</div>
            <h4>Hyatt Regency</h4>
          </div>

          <div className="hotel-card-mini">
            <div className="hotel-img-placeholder">Pokhara</div>
            <h4>Fish Tail Lodge</h4>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;