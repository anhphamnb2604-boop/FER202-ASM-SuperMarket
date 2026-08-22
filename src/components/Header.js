import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Badge, Dropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiShoppingBag,
  FiUser,
  FiShoppingCart,
  FiLogOut,
  FiShield,
  FiHome,
  FiInfo,
  FiCreditCard,
  FiFileText
} from "react-icons/fi";
import { apiGetCart } from "../services/api";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 1. Lấy thông tin user đăng nhập
    const savedUser = localStorage.getItem("fer_current_user") || localStorage.getItem("user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) { }
    } else {
      setCurrentUser(null);
    }

    // 2. Lấy số lượng sản phẩm trong giỏ hàng
    const fetchCartCount = async () => {
      try {
        const carts = await apiGetCart(1);
        if (carts && carts.length > 0) {
          const total = (carts[0].items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      } catch (e) {
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("fer_current_user");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const isAdmin = currentUser?.role === "admin" || currentUser?.email?.toLowerCase().includes("admin");

  return (
    <header className="bg-white border-bottom shadow-sm sticky-top">
      {/* 1. THANH TRÊN: LOGO & TÀI KHOẢN / GIỎ HÀNG */}
      <div className="py-2 border-bottom">
        <Container className="d-flex align-items-center justify-content-between">

          {/* Brand Logo */}
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
              <FiShoppingBag size={22} />
            </div>
            <div>
              <span className="fw-bold fs-5 text-dark d-block lh-1">SuperMarket</span>
              <small className="text-muted" style={{ fontSize: "0.75rem" }}>FiveStar Store</small>
            </div>
          </Link>

          {/* User Account & Cart */}
          <div className="d-flex align-items-center gap-3">
            {/* User Dropdown / Login Button */}
            {currentUser ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" className="border-0 bg-transparent text-dark d-flex align-items-center gap-2 shadow-none p-1">
                  <FiUser size={20} />
                  <span className="fw-semibold small">{currentUser.name}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-sm border-0">
                  <Dropdown.Header>{currentUser.email}</Dropdown.Header>
                  <Dropdown.Divider />
                  {isAdmin && (
                    <Dropdown.Item as={Link} to="/admin" className="text-warning fw-bold d-flex align-items-center gap-2">
                      <FiShield /> Trang Admin
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={handleLogout} className="text-danger fw-bold d-flex align-items-center gap-2">
                    <FiLogOut /> Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Link to="/login" className="text-dark text-decoration-none p-1 d-flex align-items-center gap-1">
                <FiUser size={20} />
                <span className="small fw-semibold">Đăng nhập</span>
              </Link>
            )}

            {/* Shopping Cart Icon */}
            <Link to="/cart" className="text-dark position-relative p-1 text-decoration-none d-flex align-items-center" title="Giỏ hàng">
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </div>

        </Container>
      </div>

      {/* 2. THANH MENU CHUYỂN TRANG CÓ ICON */}
      <Navbar expand="md" className="py-1">
        <Container>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="mx-auto gap-2 gap-md-3 fw-semibold small">
              <Nav.Link
                as={Link}
                to="/"
                active={isActive("/")}
                className="d-flex align-items-center gap-1.5"
              >
                <FiHome size={16} /> Trang Chủ
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/about"
                active={isActive("/about")}
                className="d-flex align-items-center gap-1.5"
              >
                <FiInfo size={16} /> Giới Thiệu
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/cart"
                active={isActive("/cart")}
                className="d-flex align-items-center gap-1.5"
              >
                <FiShoppingCart size={16} /> Giỏ Hàng
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/checkout"
                active={isActive("/checkout")}
                className="d-flex align-items-center gap-1.5"
              >
                <FiCreditCard size={16} /> Thanh Toán
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/bill"
                active={isActive("/bill")}
                className="d-flex align-items-center gap-1.5"
              >
                <FiFileText size={16} /> Lịch Sử Đơn Hàng
              </Nav.Link>

              {isAdmin && (
                <Nav.Link
                  as={Link}
                  to="/admin"
                  className="text-warning fw-bold d-flex align-items-center gap-1.5"
                  active={isActive("/admin")}
                >
                  <FiShield size={16} /> Quản Lý Admin
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;