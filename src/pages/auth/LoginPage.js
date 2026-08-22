import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag, FiMail, FiLock, FiUser, FiShield, FiUserCheck } from "react-icons/fi";
import { loginAPI, registerAPI } from "../../services/api";

function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Alert states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Xử lý Đăng Nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const accounts = await loginAPI(email.trim(), password);

      if (accounts && accounts.length > 0) {
        const user = accounts[0];
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("fer_current_user", JSON.stringify(user));

        if (user.role === "admin" || user.email?.toLowerCase().includes("admin")) {
          navigate("/admin");
        } else {
          navigate("/");
        }
        return;
      }
      setError("Email hoặc mật khẩu không đúng!");
    } catch (err) {
      setError("Lỗi kết nối máy chủ API!");
    }
  };

  // Xử lý Đăng Ký
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    try {
      const newAccount = await registerAPI({
        id: String(Date.now()),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role: "customer"
      });

      if (newAccount) {
        setSuccess("🎉 Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
        setIsRegister(false);
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError("Đăng ký thất bại! Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* 1. THANH HEADER TRÊN CÙNG */}
      <header className="bg-white border-bottom py-3 shadow-sm">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-danger text-white rounded-circle p-2 d-flex align-items-center justify-content-center">
              <FiShoppingBag size={24} />
            </div>
            <h4 className="fw-bold text-danger m-0">SuperMarket</h4>
            <span className="fs-5 text-secondary border-start border-2 ps-3 fw-semibold">
              {isRegister ? "Đăng ký tài khoản" : "Đăng nhập"}
            </span>
          </div>
          <a href="#help" className="text-danger text-decoration-none small fw-bold">
            Bạn cần giúp đỡ?
          </a>
        </Container>
      </header>

      {/* 2. KHỐI CHÍNH NỀN BANNER */}
      <main className="bg-danger bg-gradient py-5 flex-grow-1 d-flex align-items-center">
        <Container>
          <Row className="align-items-center g-4">
            {/* Cột Trái: Logo & Khẩu hiệu thương hiệu */}
            <Col lg={7} className="text-center text-white d-none d-lg-block">
              <div className="mb-4">
                <FiShoppingBag size={110} />
              </div>
              <h1 className="display-5 fw-extrabold mb-2">SuperMarket</h1>
              <p className="lead fs-5 opacity-90">
                Nền tảng thương mại điện tử mua sắm thực phẩm tươi sạch hàng đầu
              </p>
            </Col>

            {/* Cột Phải: Card Đăng Nhập / Đăng Ký */}
            <Col lg={5} md={8} className="mx-auto">
              <Card className="border-0 shadow-lg p-4 rounded-3 bg-white">
                {/* TAB THAY ĐỔI ĐĂNG NHẬP / ĐĂNG KÝ */}
                <Nav variant="pills" className="nav-justified mb-4 bg-light p-1 rounded-3">
                  <Nav.Item>
                    <Nav.Link
                      active={!isRegister}
                      onClick={() => {
                        setIsRegister(false);
                        setError("");
                        setSuccess("");
                      }}
                      className={`fw-bold ${!isRegister ? "bg-danger text-white shadow-sm" : "text-secondary"}`}
                      style={{ cursor: "pointer" }}
                    >
                      Đăng Nhập
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={isRegister}
                      onClick={() => {
                        setIsRegister(true);
                        setError("");
                        setSuccess("");
                      }}
                      className={`fw-bold ${isRegister ? "bg-danger text-white shadow-sm" : "text-secondary"}`}
                      style={{ cursor: "pointer" }}
                    >
                      Đăng Ký
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                {error && <Alert variant="danger" className="py-2 fs-6 mb-3">{error}</Alert>}
                {success && <Alert variant="success" className="py-2 fs-6 mb-3">{success}</Alert>}

                {!isRegister ? (
                  /* --- FORM ĐĂNG NHẬP --- */
                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center gap-2 fw-semibold small text-secondary">
                        <FiMail /> Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        size="lg"
                        className="fs-6 py-2.5 rounded-2 bg-light border-1"
                        placeholder="Nhập email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center gap-2 fw-semibold small text-secondary">
                        <FiLock /> Mật khẩu
                      </Form.Label>
                      <Form.Control
                        type="password"
                        size="lg"
                        className="fs-6 py-2.5 rounded-2 bg-light border-1"
                        placeholder="Nhập mật khẩu..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-3 text-muted small">
                      <span className="d-flex align-items-center gap-1">
                        <FiShield /> Bảo mật
                      </span>
                      <span className="d-flex align-items-center gap-1">
                        <FiUserCheck /> Hỗ trợ 24/7
                      </span>
                    </div>

                    <Button
                      variant="danger"
                      type="submit"
                      size="lg"
                      className="w-100 py-2.5 fw-bold text-uppercase fs-6 rounded-2 shadow-sm mb-3"
                    >
                      ĐĂNG NHẬP
                    </Button>

                    <div className="text-center small">
                      <span className="text-muted">Chưa có tài khoản? </span>
                      <button
                        type="button"
                        className="btn btn-link text-danger p-0 fw-bold text-decoration-none small"
                        onClick={() => {
                          setIsRegister(true);
                          setError("");
                          setSuccess("");
                        }}
                      >
                        Đăng ký ngay
                      </button>
                    </div>
                  </Form>
                ) : (
                  /* --- FORM ĐĂNG KÝ --- */
                  <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center gap-2 fw-semibold small text-secondary">
                        <FiUser /> Họ và tên
                      </Form.Label>
                      <Form.Control
                        type="text"
                        size="lg"
                        className="fs-6 py-2.5 rounded-2 bg-light border-1"
                        placeholder="Nhập họ và tên của bạn..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center gap-2 fw-semibold small text-secondary">
                        <FiMail /> Email đăng ký
                      </Form.Label>
                      <Form.Control
                        type="email"
                        size="lg"
                        className="fs-6 py-2.5 rounded-2 bg-light border-1"
                        placeholder="Nhập email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center gap-2 fw-semibold small text-secondary">
                        <FiLock /> Mật khẩu
                      </Form.Label>
                      <Form.Control
                        type="password"
                        size="lg"
                        className="fs-6 py-2.5 rounded-2 bg-light border-1"
                        placeholder="Nhập mật khẩu..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center gap-2 fw-semibold small text-secondary">
                        <FiLock /> Xác nhận mật khẩu
                      </Form.Label>
                      <Form.Control
                        type="password"
                        size="lg"
                        className="fs-6 py-2.5 rounded-2 bg-light border-1"
                        placeholder="Nhập lại mật khẩu..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Button
                      variant="danger"
                      type="submit"
                      size="lg"
                      className="w-100 py-2.5 fw-bold text-uppercase fs-6 rounded-2 shadow-sm mb-3"
                    >
                      ĐĂNG KÝ TÀI KHOẢN
                    </Button>

                    <div className="text-center small">
                      <span className="text-muted">Đã có tài khoản? </span>
                      <button
                        type="button"
                        className="btn btn-link text-danger p-0 fw-bold text-decoration-none small"
                        onClick={() => {
                          setIsRegister(false);
                          setError("");
                          setSuccess("");
                        }}
                      >
                        Đăng nhập
                      </button>
                    </div>
                  </Form>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </main>

      {/* 3. FOOTER CHÂN TRANG */}
      <footer className="bg-white border-top py-3 text-center text-muted small">
        <Container>
          <div>© 2026 SuperMarket. Tất cả các quyền được bảo lưu.</div>
        </Container>
      </footer>
    </div>
  );
}

export default LoginPage;
