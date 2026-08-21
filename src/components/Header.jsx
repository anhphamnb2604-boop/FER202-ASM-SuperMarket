import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiShoppingBag,
  FiHome,
  FiInfo,
  FiShoppingCart,
  FiCreditCard,
  FiUser,
  FiLogOut
} from "react-icons/fi";

const Header = ({ cartCount = 0, currentUser = null, onLogout = () => { } }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/" && (location.pathname === "/" || location.pathname === "/home")) return true;
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm sticky-top py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4 me-4">
          <div className="bg-white text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
            <FiShoppingBag size={20} />
          </div>
          <div>
            <div className="lh-1">The Anh</div>
            <small className="text-white-50 fs-6 fw-normal">SuperMarket</small>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse show" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1 fw-semibold">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link px-3 rounded-3 d-flex align-items-center gap-2 ${isActive("/") ? "active bg-white text-success fw-bold" : "text-white"}`}
              >
                <FiHome /> Trang Chủ
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/about"
                className={`nav-link px-3 rounded-3 d-flex align-items-center gap-2 ${isActive("/about") ? "active bg-white text-success fw-bold" : "text-white"}`}
              >
                <FiInfo /> Giới Thiệu
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/cart"
                className={`nav-link px-3 rounded-3 d-flex align-items-center gap-2 ${isActive("/cart") ? "active bg-white text-success fw-bold" : "text-white"}`}
              >
                <FiShoppingCart /> Giỏ Hàng
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/checkout"
                className={`nav-link px-3 rounded-3 d-flex align-items-center gap-2 ${isActive("/checkout") ? "active bg-white text-success fw-bold" : "text-white"}`}
              >
                <FiCreditCard /> Thanh Toán
              </Link>
            </li>
          </ul>

          {/* Right Action Buttons */}
          <div className="d-flex align-items-center gap-2">
            <Link
              to="/cart"
              className={`btn ${isActive("/cart") ? "btn-light text-success fw-bold" : "btn-outline-light"} position-relative d-flex align-items-center gap-2 rounded-pill px-3 py-2`}
            >
              <FiShoppingCart size={18} />
              <span>Giỏ Hàng</span>
              {cartCount > 0 && (
                <span className="badge bg-danger rounded-pill ms-1 fs-7">
                  {cartCount}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="d-flex align-items-center gap-2">
                <span className="btn btn-light text-success fw-bold d-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm cursor-default">
                  <FiUser size={18} />
                  <span>{currentUser.name}</span>
                </span>
                <button
                  className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                  title="Đăng xuất"
                  onClick={onLogout}
                  style={{ width: 38, height: 38 }}
                >
                  <FiLogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`btn ${isActive("/login") ? "btn-light text-success fw-bold" : "btn-outline-light"} d-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm`}
              >
                <FiUser size={18} />
                <span>Đăng Nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;