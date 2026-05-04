import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./signup.css"

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("guest");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      login(data.user, data.token);

      if (data.user.role === "owner") {
        navigate("/owner");
      } else {
        navigate("/guest");
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          "Signup failed"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2>Create Account</h2>

        <form onSubmit={handleSignup}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
          >
            <option value="guest">
              Guest
            </option>
            <option value="owner">
              Owner
            </option>
          </select>

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Sign Up"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Signup;