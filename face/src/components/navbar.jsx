import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./navbar.css";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="Navbar">

      <div className="nav-logo" onClick={()=>{
        navigate('/');
        window.location.reload();
        
      }}>
        SO<span>YO</span>
        <div id="nav-logo-1">BASAI</div>
      </div>

      <div
        className={`hamburger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <div className={`nav-menu ${isOpen ? "open" : ""}`}>

        <NavLink to="/" onClick={closeMenu} className="nav-item">
          Home
        </NavLink>

        <NavLink to="/hotels" onClick={closeMenu} className="nav-item">
          Hotels
        </NavLink>

        {user ? (
          <>
            <NavLink 
      to={user.role === "owner" ? "/owner" : "/guest"} 
      onClick={closeMenu} 
      className="nav-item"
    > 
    Dashboard
    </NavLink>

            <button className="nav-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={closeMenu} className="nav-item">
              Login
            </NavLink>

            <NavLink to="/signup" onClick={closeMenu} className="nav-item">
              Sign Up
            </NavLink>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;