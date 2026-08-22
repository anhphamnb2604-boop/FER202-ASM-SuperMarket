import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  Alert,
  Badge,
  Table
} from "react-bootstrap";
import {
  FiCheckCircle,
  FiCreditCard,
  FiShield,
  FiTruck,
  FiArrowLeft,
  FiShoppingBag,
  FiFileText
} from "react-icons/fi";
import { apiCreateOrder, apiUpdateCart } from "../../services/api";

const CheckoutPage = ({ onCartChange = () => {} }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [success, setSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Đọc thông tin user đăng nhập
  const savedUser = (() => {
    try {
      const u = localStorage.getItem("fer_current_user") || localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  })();

  const [formData, setFormData] = useState({
    fullName: savedUser?.name || "",
    phone: "",
    address: "",
    note: ""
  });

  // 1. Hook useEffect: Kiểm tra state giỏ hàng được chuyển tới từ CartScreen
  useEffect(() => {
    if (location.state && location.state.cart && location.state.products) {
      setCart(location.state.cart);
      setProducts(location.state.products);
    } else {
      navigate("/cart");
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getProduct = (id) =>
    products.find((p) => String(p.id) === String(id));

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => {
      const prod = getProduct(item.productId);
      return prod ? sum + prod.price * item.quantity : sum;
    }, 0);
  };

  const subTotalAmount = calculateSubtotal();
  const discountPercent = location.state?.discountPercent || 0;
  const discountAmount = Math.round((subTotalAmount * discountPercent) / 100);
  const shippingFee = subTotalAmount >= 500000 || subTotalAmount === 0 ? 0 : 30000;
  const finalTotalAmount = Math.max(0, subTotalAmount + shippingFee - discountAmount);

  // 2. Xử lý Tạo Đơn Hàng Qua REST API (POST /orders)
  const handleFinalSubmitOrder = async () => {
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!");
      return;
    }

    setSubmitting(true);
    const newOrderCode = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    const orderData = {
      id: String(Date.now()),
      orderCode: newOrderCode,
      userId: savedUser?.id || 1,
      customerName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      note: formData.note,
      paymentMethod,
      items: cart?.items || [],
      totalAmount: finalTotalAmount,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0]
    };

    try {
      await apiCreateOrder(orderData);

      // Reset giỏ hàng rỗng
      if (cart) {
        await apiUpdateCart(cart.id, { ...cart, items: [] });
        if (onCartChange) onCartChange();
      }

      setOrderRef(newOrderCode);
      setSuccess(true);
      setShowConfirmModal(false);
    } catch (err) {
      console.error("Lỗi khi tạo đơn hàng:", err);
      alert("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-lg rounded-4 text-center p-5 bg-white">
              <div className="bg-success text-white rounded-circle d-inline-flex p-3 mb-3 mx-auto shadow">
                <FiCheckCircle size={54} />
              </div>
              <h3 className="fw-extrabold text-success mb-2">Đặt Hàng Thành Công!</h3>
              <p className="text-secondary fs-6 mb-3">
                Cảm ơn bạn <strong className="text-dark">{formData.fullName}</strong> đã mua sắm tại SuperMarket.
              </p>
              <Badge bg="light" text="dark" className="fs-6 p-3 rounded-3 border mb-4 d-inline-block">
                Mã đơn hàng: <span className="text-danger fw-extrabold">{orderRef}</span>
              </Badge>

              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button variant="success" size="lg" className="fw-bold px-4 rounded-pill shadow-sm" onClick={() => navigate("/bill")}>
                  <FiFileText /> Xem Hóa Đơn Đơn Hàng
                </Button>
                <Button variant="outline-secondary" size="lg" className="fw-bold px-4 rounded-pill" onClick={() => navigate("/")}>
                  Quay Lại Trang Chủ
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button variant="link" className="text-decoration-none text-secondary p-0 mb-3 fw-bold d-flex align-items-center gap-1" onClick={() => navigate("/cart")}>
        <FiArrowLeft /> Quay lại Giỏ hàng
      </Button>

      <Row className="g-4">
        {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN GIAO HÀNG (REACT-BOOTSTRAP FORM) */}
        <Col lg={7}>
          <Card className="border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <Card.Title className="fw-extrabold text-dark mb-4 fs-5 d-flex align-items-center gap-2">
              <FiTruck className="text-danger" /> 1. Thông Tin Nhận Hàng
            </Card.Title>

            <Form>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <Form.Group controlId="fullName">
                    <Form.Label className="fw-bold small text-secondary">Họ và tên người nhận *</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="phone">
                    <Form.Label className="fw-bold small text-secondary">Số điện thoại *</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="address">
                <Form.Label className="fw-bold small text-secondary">Địa chỉ giao hàng chi tiết *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="note">
                <Form.Label className="fw-bold small text-secondary">Ghi chú đơn hàng (Tùy chọn)</Form.Label>
                <Form.Control
                  type="text"
                  name="note"
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                  value={formData.note}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Card>

          {/* PHƯƠNG THỨC THANH TOÁN */}
          <Card className="border-0 shadow-sm rounded-4 p-4 bg-white">
            <Card.Title className="fw-extrabold text-dark mb-3 fs-5 d-flex align-items-center gap-2">
              <FiCreditCard className="text-danger" /> 2. Phương Thức Thanh Toán
            </Card.Title>

            <Form.Check
              type="radio"
              id="pay-cod"
              name="paymentMethod"
              label="💵 Thanh toán khi nhận hàng (COD)"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="fw-bold mb-2 cursor-pointer"
            />
            <Form.Check
              type="radio"
              id="pay-banking"
              name="paymentMethod"
              label="🏦 Chuyển khoản ngân hàng (QR Code / Banking)"
              checked={paymentMethod === "banking"}
              onChange={() => setPaymentMethod("banking")}
              className="fw-bold cursor-pointer"
            />
          </Card>
        </Col>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG VÀ NÚT XÁC NHẬN */}
        <Col lg={5}>
          <Card className="border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: 84 }}>
            <Card.Title className="fw-extrabold text-dark mb-3 fs-5 d-flex align-items-center gap-2">
              <FiShoppingBag className="text-danger" /> Tóm Tắt Đơn Hàng
            </Card.Title>

            <div className="mb-3 overflow-auto" style={{ maxHeight: 220 }}>
              {cart?.items?.map((item) => {
                const prod = getProduct(item.productId);
                if (!prod) return null;
                return (
                  <div key={item.productId} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <img src={prod.image} alt={prod.name} className="rounded" style={{ width: 42, height: 42, objectFit: "cover" }} />
                      <div>
                        <div className="fw-bold small text-dark">{prod.name}</div>
                        <small className="text-muted">SL: x{item.quantity}</small>
                      </div>
                    </div>
                    <span className="fw-bold text-dark small">
                      {(prod.price * item.quantity).toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-between text-secondary mb-2 small">
              <span>Tạm tính:</span>
              <span className="fw-bold text-dark">{subTotalAmount.toLocaleString("vi-VN")} đ</span>
            </div>

            <div className="d-flex justify-content-between text-secondary mb-2 small">
              <span>Phí vận chuyển:</span>
              <span className={shippingFee === 0 ? "text-success fw-bold" : "text-dark"}>
                {shippingFee === 0 ? "Miễn Phí" : `${shippingFee.toLocaleString("vi-VN")} đ`}
              </span>
            </div>

            {discountPercent > 0 && (
              <div className="d-flex justify-content-between text-success mb-2 small fw-bold">
                <span>Giảm giá ({discountPercent}%):</span>
                <span>-{discountAmount.toLocaleString("vi-VN")} đ</span>
              </div>
            )}

            <hr />

            <div className="d-flex justify-content-between align-items-baseline mb-4">
              <span className="fw-bold text-dark fs-6">Tổng cộng:</span>
              <span className="fs-3 fw-extrabold text-danger">
                {finalTotalAmount.toLocaleString("vi-VN")} đ
              </span>
            </div>

            <Button
              variant="danger"
              size="lg"
              className="w-100 py-3 fw-bold rounded-3 shadow-sm fs-6"
              onClick={() => setShowConfirmModal(true)}
            >
              XÁC NHẬN ĐẶT HÀNG NGAY
            </Button>
          </Card>
        </Col>
      </Row>

      {/* REACT-BOOTSTRAP MODAL: XÁC NHẬN HOÀN TẤT ĐẶT HÀNG */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered size="sm">
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-extrabold text-dark fs-6">Xác Nhận Đặt Hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-3">
          <FiShield size={44} className="text-danger mb-3" />
          <p className="text-dark fw-bold mb-1">Xác nhận hoàn tất đơn hàng?</p>
          <small className="text-muted d-block mb-3">Tổng số tiền: {finalTotalAmount.toLocaleString("vi-VN")} đ</small>
          <div className="d-flex gap-2">
            <Button variant="light" className="flex-grow-1 fw-bold" onClick={() => setShowConfirmModal(false)}>
              Hủy
            </Button>
            <Button variant="danger" className="flex-grow-1 fw-bold" disabled={submitting} onClick={handleFinalSubmitOrder}>
              {submitting ? "Đang xử lý..." : "Xác Nhận"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CheckoutPage;
