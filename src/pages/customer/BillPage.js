import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Badge,
  Button,
  Spinner,
  Row,
  Col,
  Table
} from "react-bootstrap";
import { FiFileText, FiCheckCircle, FiShoppingBag, FiClock, FiTruck } from "react-icons/fi";
import { apiGetOrders } from "../../services/api";

const BillPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Đọc thông tin user hiện tại
  const savedUser = (() => {
    try {
      const u = localStorage.getItem("fer_current_user") || localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  })();

  // 1. Hook useEffect: Fetch đơn hàng của người dùng từ API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiGetOrders(savedUser?.id || 1);
      setOrders(data || []);
    } catch (err) {
      console.error("Lỗi khi fetch lịch sử đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper hiển thị Badge trạng thái đơn hàng
  const renderStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge bg="success" className="p-2 fs-7 rounded-pill"><FiCheckCircle /> Đã Hoàn Thành</Badge>;
      case "shipping":
        return <Badge bg="primary" className="p-2 fs-7 rounded-pill"><FiTruck /> Đang Giao Hàng</Badge>;
      default:
        return <Badge bg="warning" text="dark" className="p-2 fs-7 rounded-pill"><FiClock /> Đang Xử Lý</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" className="mb-3" />
        <h4 className="fw-bold text-dark">Đang tải lịch sử hóa đơn đơn hàng từ API...</h4>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* HEADER TIÊU ĐỀ */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="bg-danger text-white rounded-circle p-2.5 d-flex align-items-center justify-content-center shadow-sm" style={{ width: 46, height: 46 }}>
          <FiFileText size={24} />
        </div>
        <div>
          <h3 className="fw-extrabold text-dark m-0">Lịch Sử Đơn Hàng & Hóa Đơn ({orders.length})</h3>
          <small className="text-muted">Theo dõi danh sách các đơn hàng đã đặt của bạn</small>
        </div>
      </div>

      {orders.length === 0 ? (
        /* TRƯỜNG HỢP CHƯA CÓ ĐƠN HÀNG */
        <Card className="border-0 shadow-sm rounded-4 text-center py-5 bg-white">
          <Card.Body>
            <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex p-4 mb-3">
              <FiShoppingBag size={48} />
            </div>
            <h4 className="fw-bold text-dark mb-2">Bạn chưa có hóa đơn mua hàng nào</h4>
            <p className="text-muted mb-4">Hãy mua sắm sản phẩm tươi ngon để tích lũy lịch sử đơn hàng nhé!</p>
            <Button variant="danger" size="lg" className="fw-bold rounded-pill px-4 shadow-sm" onClick={() => navigate("/home")}>
              Khám Phá Sản Phẩm Ngay
            </Button>
          </Card.Body>
        </Card>
      ) : (
        /* DANH SÁCH HÓA ĐƠN ĐƠN HÀNG (CARDS) */
        <Row className="g-4">
          {orders.map((order) => (
            <Col xs={12} key={order.id}>
              <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                <Card.Header className="bg-light border-0 p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div>
                    <span className="fw-bold text-dark me-2">Mã đơn hàng:</span>
                    <Badge bg="light" text="danger" className="border border-danger fs-6 fw-extrabold me-3">
                      #{order.orderCode || order.id}
                    </Badge>
                    <small className="text-muted">Ngày đặt: {order.createdAt || "Hôm nay"}</small>
                  </div>
                  {renderStatusBadge(order.status)}
                </Card.Header>

                <Card.Body className="p-4">
                  <Row className="g-3">
                    <Col md={7}>
                      <h6 className="fw-bold text-secondary mb-2 fs-7 text-uppercase">Thông Tin Người Nhận</h6>
                      <div className="fw-bold text-dark">{order.customerName || savedUser?.name || "Khách Hàng"}</div>
                      <div className="text-muted small">SĐT: {order.phone || "0912345678"}</div>
                      <div className="text-muted small">Địa chỉ: {order.address || "TP. Hồ Chí Minh"}</div>
                    </Col>

                    <Col md={5} className="text-md-end border-start border-md-0 pt-3 pt-md-0">
                      <h6 className="fw-bold text-secondary mb-2 fs-7 text-uppercase">Tổng Giá Trị Hóa Đơn</h6>
                      <div className="fs-3 fw-extrabold text-danger mb-1">
                        {(order.totalAmount || 0).toLocaleString("vi-VN")} đ
                      </div>
                      <small className="text-muted d-block">
                        Hình thức: {order.paymentMethod === "banking" ? "Chuyển khoản Banking" : "Thanh toán COD"}
                      </small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default BillPage;
