import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  FiShoppingBag,
  FiMail,
  FiLock,
  FiTruck,
  FiShield,
  FiCheckCircle,
  FiZap,
  FiUserCheck
} from 'react-icons/fi';
import { loginAPI } from '../services/api';

function LoginPage({ onLoginSuccess = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu!');
      return;
    }

    setLoading(true);

    try {
      const accounts = await loginAPI(email, password);

      if (accounts && accounts.length > 0) {
        const user = accounts[0];
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('fer_current_user', JSON.stringify(user));
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
        if (user.role === 'admin' || user.email?.toLowerCase().includes('admin')) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (type) => {
    setError('');
    if (type === 'customer') {
      setEmail('user@gmail.com');
      setPassword('123456');
    } else {
      setEmail('admin@gmail.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-5">
      <Container>
        <Row className="justify-content-center align-items-center g-4">
          {/* Left Column: Supermarket Brand & Banner */}
          <Col lg={6} className="d-none d-lg-block">
            <div className="bg-success bg-gradient text-white p-5 rounded-4 shadow-lg position-relative overflow-hidden h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-inline-flex align-items-center gap-2 bg-white text-success px-3 py-1.5 rounded-pill fw-bold small mb-4 shadow-sm">
                  <FiShoppingBag size={18} />
                  <span>The Anh SuperMarket 1990s</span>
                </div>

                <h1 className="display-6 fw-extrabold mb-3">
                  Siêu Thị Thực Phẩm Tươi Sạch & Đồ Uống Cao Cấp
                </h1>

                <p className="opacity-90 lead fs-6 mb-4">
                  Đặt hàng online tiện lợi - Thực phẩm giao tận nhà chỉ trong 2 giờ. Mua sắm an toàn, tươi ngon mỗi ngày!
                </p>

                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-25">
                    <div className="bg-white text-success rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
                      <FiCheckCircle size={22} />
                    </div>
                    <div>
                      <h6 className="fw-bold m-0">100% Nông Sản Tươi Ngon</h6>
                      <small className="opacity-75">Rau củ quả tươi mới nhập mỗi sáng</small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-25">
                    <div className="bg-white text-success rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
                      <FiTruck size={22} />
                    </div>
                    <div>
                      <h6 className="fw-bold m-0">Giao Hàng Siêu Tốc 2 Giờ</h6>
                      <small className="opacity-75">Freeship cho đơn hàng từ 500.000đ</small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-25">
                    <div className="bg-white text-success rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
                      <FiZap size={22} />
                    </div>
                    <div>
                      <h6 className="fw-bold m-0">Ưu Đãi Siêu Thị Mỗi Ngày</h6>
                      <small className="opacity-75">Nhập mã FERSE1990 giảm ngay 10%</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-top border-white border-opacity-25 d-flex justify-content-between align-items-center small opacity-75">
                <span>© 2026 FerSe1990 Supermarket</span>
                <span>Hotline: 1900 1990</span>
              </div>
            </div>
          </Col>

          {/* Right Column: Clean Login Card */}
          <Col md={8} lg={5}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <Card.Header className="bg-white border-0 pt-4 px-4 text-center">
                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow-sm" style={{ width: 56, height: 56 }}>
                  <FiUserCheck size={28} />
                </div>
                <h4 className="fw-extrabold text-dark mb-1">Đăng Nhập Khách Hàng</h4>
                <p className="text-muted small mb-0">
                  Chào mừng bạn quay lại <strong>The Anh SuperMarket</strong>
                </p>
              </Card.Header>

              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" className="d-flex align-items-center gap-2 py-2 fs-6 rounded-3">
                    <FiShield size={20} className="flex-shrink-0" />
                    <div>{error}</div>
                  </Alert>
                )}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Label className="fw-bold small text-secondary">Email Đăng Nhập *</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FiMail className="text-muted" />
                      </span>
                      <Form.Control
                        type="email"
                        className="bg-light border-start-0 ps-0"
                        placeholder="Ví dụ: user@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="loginPassword">
                    <Form.Label className="fw-bold small text-secondary">Mật Khẩu *</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FiLock className="text-muted" />
                      </span>
                      <Form.Control
                        type="password"
                        className="bg-light border-start-0 ps-0"
                        placeholder="Nhập mật khẩu..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Button
                    variant="success"
                    type="submit"
                    className="w-100 py-2.5 fw-bold rounded-3 shadow-sm mb-3 fs-6 d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <>
                        <FiShoppingBag size={18} /> Đăng Nhập Ngay
                      </>
                    )}
                  </Button>
                </Form>

                <div className="bg-light p-3 rounded-3 text-center border mt-3">
                  <small className="text-muted fw-bold d-block mb-2">Tài Khoản Thử Nghiệm Nhanh:</small>
                  <div className="d-flex gap-2 justify-content-center flex-wrap">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="rounded-pill fw-semibold bg-white shadow-sm"
                      onClick={() => handleQuickFill('customer')}
                    >
                      👤 Khách Hàng (user@gmail.com)
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="rounded-pill fw-semibold bg-white shadow-sm"
                      onClick={() => handleQuickFill('admin')}
                    >
                      🛡️ Admin (admin@gmail.com)
                    </Button>
                  </div>
                </div>
              </Card.Body>

              <Card.Footer className="bg-light border-0 py-3 text-center small text-muted">
                Cần trợ giúp? Liên hệ siêu thị: <strong className="text-success">1900 1990</strong>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginPage;
