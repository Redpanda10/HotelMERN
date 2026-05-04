import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Hotels from "./pages/Hotels";

import GuestDashboard from "./pages/guest";
import OwnerDashboard from "./pages/owner";

import Navbar from "./components/navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import "./global.css";

import HotelDetails from "./pages/HotelDetails";

const App = () => {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/guest"
          element={
            <ProtectedRoute role="guest">
              <GuestDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<h2>404 - Page Not Found</h2>} />

        <Route path="/hotels/:id" element={<HotelDetails />} />


      </Routes>

    </BrowserRouter>
  );
};

export default App;