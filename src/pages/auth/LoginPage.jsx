import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiMail, FiLock, FiShield, FiUserCheck } from 'react-icons/fi';
import { loginAPI } from '../../services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const accounts = await loginAPI(email.trim(), password);

    if (accounts && accounts.length > 0) {
      const user = accounts[0];
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('fer_current_user', JSON.stringify(user));
      
      // Chuyển hướng theo role
      if (user.role === 'admin' || user.email?.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/');
      }
      return;
    }

    setError('Email hoặc mật khẩu không đúng!');
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* 1. THANH HEADER TRÊN CÙNG (PHONG CÁCH SHOPEE) */}
      <header className="bg-white border-bottom py-3 shadow-sm">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-danger text-white rounded-circle p-2 d-flex align-items-center justify-content-center">
              <FiShoppingBag size={24} />
            </div>
            <h4 className="fw-bold text-danger m-0">SuperMarket</h4>
            <span className="fs-5 text-secondary border-start border-2 ps-3 fw-semibold">
              Đăng nhập
            </span>
          </div>
          <a href="#help" className="text-danger text-decoration-none small fw-bold">
            Bạn cần giúp đỡ?
          </a>
        </Container>
      </header>

      {/* 2. KHỐI CHÍNH NỀN ĐỎ/CAM SHOPEE BANNER */}
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

            {/* Cột Phải: Khung Card Đăng Nhập Màu Trắng */}
            <Col lg={5} md={8} className="mx-auto">
              <Card className="border-0 shadow-lg p-4 rounded-3 bg-white">
                <Card.Title className="fs-4 fw-bold text-dark mb-4">
                  Đăng nhập
                </Card.Title>

                {error && <Alert variant="danger" className="py-2 fs-6 mb-3">{error}</Alert>}

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
                    className="w-100 py-2.5 fw-bold text-uppercase fs-6 rounded-2 shadow-sm"
                  >
                    ĐĂNG NHẬP
                  </Button>
                </Form>
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
