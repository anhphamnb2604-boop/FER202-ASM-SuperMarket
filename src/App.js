import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import AdminNavbar from "./components/AdminNavbar";
import HomePage from "./pages/HomePage";
import CartScreen from "./pages/CartScreen";
import CheckoutPage from "./pages/CheckoutPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import BillPage from "./pages/BillPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import { apiGetCart } from "./services/api";

function AppContent() {
  const [cartCount, setCartCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const userId = 1;
  const isLoginPage = location.pathname === "/login";
  const isAdminPage = location.pathname.startsWith("/admin");
  const showCustomerNavbar = !isLoginPage && !isAdminPage;
  const showAdminNavbar = isAdminPage;

  useEffect(() => {
    // Check saved user session
    const savedUser = localStorage.getItem("fer_current_user") || localStorage.getItem("user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Lỗi parse saved user", e);
      }
    }
    updateCartCount();
  }, []);

  const updateCartCount = async () => {
    try {
      const carts = await apiGetCart(userId);
      if (carts && carts.length > 0) {
        const totalItems = (carts[0].items || []).reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        );
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Lỗi get cart count:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fer_current_user");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <>
      {/* Customer Navbar */}
      {showCustomerNavbar && (
        <Header
          cartCount={cartCount}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Admin Navbar */}
      {showAdminNavbar && (
        <AdminNavbar onLogout={handleLogout} />
      )}

      <main className="min-vh-100 bg-light pb-5">
        <Routes>
          {/* 1. Trang Đăng Nhập */}
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />}
          />

          {/* 2. Trang Chủ Khách Hàng */}
          <Route
            path="/"
            element={<HomePage onCartChange={updateCartCount} />}
          />
          <Route
            path="/home"
            element={<HomePage onCartChange={updateCartCount} />}
          />

          {/* 3. Trang Giỏ Hàng */}
          <Route
            path="/cart"
            element={<CartScreen onCartChange={updateCartCount} />}
          />

          {/* 4. Trang Thanh Toán */}
          <Route
            path="/checkout"
            element={<CheckoutPage onCartChange={updateCartCount} />}
          />

          {/* 5. Trang Giới Thiệu */}
          <Route path="/about" element={<AboutPage />} />

          {/* 6. Trang Hóa Đơn */}
          <Route path="/bill" element={<BillPage />} />

          {/* 7. Các Trang Admin Riêng Biệt */}
          <Route path="/admin" element={<AdminProductsPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;