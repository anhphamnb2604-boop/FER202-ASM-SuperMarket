import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiBox,
  FiFileText,
  FiPieChart,
  FiLogOut,
  FiShield,
  FiShoppingBag
} from "react-icons/fi";

const AdminNavbar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/admin" && (location.pathname === "/admin" || location.pathname === "/admin/products")) {
      return true;
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("fer_current_user");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm sticky-top py-2.5 mb-4">
      <div className="container">
        {/* Brand Logo for Admin */}
        <Link to="/admin" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-5 me-4">
          <div className="bg-white text-success rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: 38, height: 38 }}>
            <FiShield size={20} />
          </div>
          <div>
            <div className="lh-1 fw-extrabold">Admin Portal</div>
            <small className="text-white-50 fs-7 fw-normal">SuperMarket 1990s</small>
          </div>
        </Link>

        {/* Admin Navigation Links */}
        <div className="collapse navbar-collapse show" id="adminNavbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1 fw-semibold fs-6">
            <li className="nav-item">
              <Link
                to="/admin"
                className={`nav-link px-3 rounded-3 d-flex align-items-center gap-2 ${
                  isActive("/admin") ? "active bg-white text-success fw-bold" : "text-white"
                }`}
              >
                <FiBox /> Quản Lý Sản Phẩm
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/admin/orders"
                className={`nav-link px-3 rounded-3 d-flex align-items-center gap-2 ${
                  isActive("/admin/orders") ? "active bg-white text-success fw-bold" : "text-white"
                }`}
              >
                <FiFileText /> Quản Lý Đơn Hàng
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/admin/reports"
                className={`nav-link px-3 rounded-3 d-flex align-items-center gap-2 ${
                  isActive("/admin/reports") ? "active bg-white text-success fw-bold" : "text-white"
                }`}
              >
                <FiPieChart /> Báo Cáo & Thống Kê
              </Link>
            </li>
          </ul>

          {/* Right Admin Controls */}
          <div className="d-flex align-items-center gap-2">
            <span className="btn btn-light text-success fw-bold d-flex align-items-center gap-2 rounded-pill px-3 py-1.5 shadow-sm fs-7 cursor-default">
              <FiShield size={16} />
              <span>Admin</span>
            </span>

            <button
              className="btn btn-danger fw-bold rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5 shadow-sm fs-7"
              onClick={handleLogout}
              title="Đăng xuất khỏi hệ thống"
            >
              <FiLogOut size={16} /> Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
