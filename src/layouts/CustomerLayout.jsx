import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { apiGetCart } from "../services/api";

const CustomerLayout = () => {
  const [cartCount, setCartCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("fer_current_user") || localStorage.getItem("user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {}
    }
    updateCartCount();
  }, []);

  const updateCartCount = async () => {
    try {
      const carts = await apiGetCart(1);
      if (carts && carts.length > 0) {
        const total = (carts[0].items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    } catch (e) {}
  };

  const handleLogout = () => {
    localStorage.removeItem("fer_current_user");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <Header cartCount={cartCount} currentUser={currentUser} onLogout={handleLogout} />
      <main className="min-vh-100 bg-light pb-5">
        <Outlet context={{ updateCartCount }} />
      </main>
    </>
  );
};

export default CustomerLayout;
