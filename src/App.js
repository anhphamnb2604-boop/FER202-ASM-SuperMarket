import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components
import Header from "./components/Header";
import AdminNavbar from "./components/AdminNavbar";

// Auth Page
import LoginPage from "./pages/auth/LoginPage";

// Customer Pages
import HomePage from "./pages/customer/HomePage";
import CartScreen from "./pages/customer/CartScreen";
import CheckoutPage from "./pages/customer/CheckoutPage";
import AboutPage from "./pages/customer/AboutPage";
import BillPage from "./pages/customer/BillPage";

// Admin Pages
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Customer Routes */}
        <Route path="/" element={<><Header /><HomePage /></>} />
        <Route path="/home" element={<><Header /><HomePage /></>} />
        <Route path="/cart" element={<><Header /><CartScreen /></>} />
        <Route path="/checkout" element={<><Header /><CheckoutPage /></>} />
        <Route path="/about" element={<><Header /><AboutPage /></>} />
        <Route path="/bill" element={<><Header /><BillPage /></>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<><AdminNavbar /><AdminProductsPage /></>} />
        <Route path="/admin/products" element={<><AdminNavbar /><AdminProductsPage /></>} />
        <Route path="/admin/users" element={<><AdminNavbar /><AdminUsersPage /></>} />
        <Route path="/admin/orders" element={<><AdminNavbar /><AdminOrdersPage /></>} />
        <Route path="/admin/reports" element={<><AdminNavbar /><AdminReportsPage /></>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;