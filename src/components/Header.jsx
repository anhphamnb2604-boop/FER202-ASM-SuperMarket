import React from "react";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  FiShoppingBag,
  FiHome,
  FiInfo,
  FiShoppingCart,
  FiCreditCard,
  FiUser,
  FiLogOut,
  FiShield
} from "react-icons/fi";

const Header = ({ cartCount = 0, currentUser = null, onLogout = () => { } }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/" && (location.pathname === "/" || location.pathname === "/home")) return true;
    return location.pathname === path;
  };

  return (
    <Navbar bg="success" variant="dark" expand="lg" sticky="top" className="shadow-sm py-2">
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 fw-bold fs-4 me-4">
          <div className="bg-white text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
            <FiShoppingBag size={20} />
          </div>
          <div>
            <div className="lh-1">The Anh</div>
            <small className="text-white-50 fs-6 fw-normal">SuperMarket</small>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto gap-1 fw-semibold">
            <Nav.Link
              as={Link}
              to="/"
              active={isActive("/")}
              className={`px-3 rounded-3 d-flex align-items-center gap-2 ${isActive("/") ? "bg-white text-success fw-bold" : "text-white"}`}
            >
              <FiHome /> Trang Chủ
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/about"
              active={isActive("/about")}
              className={`px-3 rounded-3 d-flex align-items-center gap-2 ${isActive("/about") ? "bg-white text-success fw-bold" : "text-white"}`}
            >
              <FiInfo /> Giới Thiệu
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/cart"
              active={isActive("/cart")}
              className={`px-3 rounded-3 d-flex align-items-center gap-2 ${isActive("/cart") ? "bg-white text-success fw-bold" : "text-white"}`}
            >
              <FiShoppingCart /> Giỏ Hàng
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/checkout"
              active={isActive("/checkout")}
              className={`px-3 rounded-3 d-flex align-items-center gap-2 ${isActive("/checkout") ? "bg-white text-success fw-bold" : "text-white"}`}
            >
              <FiCreditCard /> Thanh Toán
            </Nav.Link>

            {(currentUser?.role === "admin" || currentUser?.email?.toLowerCase().includes("admin")) && (
              <Nav.Link
                as={Link}
                to="/admin"
                active={isActive("/admin")}
                className={`px-3 rounded-3 d-flex align-items-center gap-2 ${isActive("/admin") ? "bg-warning text-dark fw-bold" : "text-warning fw-bold"}`}
              >
                <FiShield /> Quản Lý (Admin)
              </Nav.Link>
            )}
          </Nav>

          {/* Right Action Buttons */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            <Button
              as={Link}
              to="/cart"
              variant={isActive("/cart") ? "light" : "outline-light"}
              className={`position-relative d-flex align-items-center gap-2 rounded-pill px-3 py-2 ${isActive("/cart") ? "text-success fw-bold" : ""}`}
            >
              <FiShoppingCart size={18} />
              <span>Giỏ Hàng</span>
              {cartCount > 0 && (
                <Badge bg="danger" pill className="ms-1 fs-7">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {currentUser ? (
              <div className="d-flex align-items-center gap-2">
                <Button variant="light" className="text-success fw-bold d-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm cursor-default">
                  <FiUser size={18} />
                  <span>{currentUser.name}</span>
                </Button>
                <Button
                  variant="outline-light"
                  className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                  title="Đăng xuất"
                  onClick={onLogout}
                  style={{ width: 38, height: 38 }}
                >
                  <FiLogOut size={16} />
                </Button>
              </div>
            ) : (
              <Button
                as={Link}
                to="/login"
                variant={isActive("/login") ? "light" : "outline-light"}
                className={`d-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm ${isActive("/login") ? "text-success fw-bold" : ""}`}
              >
                <FiUser size={18} />
                <span>Đăng Nhập</span>
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;