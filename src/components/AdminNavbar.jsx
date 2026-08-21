import React from "react";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiBox,
  FiFileText,
  FiPieChart,
  FiLogOut,
  FiShield
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
    <Navbar bg="success" variant="dark" expand="lg" sticky="top" className="shadow-sm py-2 mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/admin" className="d-flex align-items-center gap-2 fw-bold fs-5 me-4">
          <div className="bg-white text-success rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: 36, height: 36 }}>
            <FiShield size={20} />
          </div>
          <div>
            <div className="lh-1 fw-extrabold">Admin Portal</div>
            <small className="text-white-50 fs-7 fw-normal">SuperMarket 1990s</small>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto gap-1 fw-semibold fs-6">
            <Nav.Link
              as={Link}
              to="/admin"
              active={isActive("/admin")}
              className={`px-3 rounded-3 d-flex align-items-center gap-2 ${
                isActive("/admin") ? "bg-white text-success fw-bold" : "text-white"
              }`}
            >
              <FiBox /> Quản Lý Sản Phẩm
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/admin/orders"
              active={isActive("/admin/orders")}
              className={`px-3 rounded-3 d-flex align-items-center gap-2 ${
                isActive("/admin/orders") ? "bg-white text-success fw-bold" : "text-white"
              }`}
            >
              <FiFileText /> Quản Lý Đơn Hàng
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/admin/reports"
              active={isActive("/admin/reports")}
              className={`px-3 rounded-3 d-flex align-items-center gap-2 ${
                isActive("/admin/reports") ? "bg-white text-success fw-bold" : "text-white"
              }`}
            >
              <FiPieChart /> Báo Cáo & Thống Kê
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            <Badge bg="light" text="success" className="p-2 fs-7 rounded-pill shadow-sm">
              <FiShield size={14} className="me-1" /> Admin
            </Badge>

            <Button
              variant="danger"
              size="sm"
              className="fw-bold rounded-pill px-3 py-1.5 shadow-sm d-flex align-items-center gap-1"
              onClick={handleLogout}
            >
              <FiLogOut size={16} /> Đăng Xuất
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
