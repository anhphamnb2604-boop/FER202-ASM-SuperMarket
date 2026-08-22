import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Modal,
  Badge,
  Alert,
  ProgressBar,
  Spinner
} from "react-bootstrap";
import {
  FiShoppingBag,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiArrowRight,
  FiTruck,
  FiTag,
  FiCheckCircle,
  FiFileText,
  FiRefreshCw
} from "react-icons/fi";
import { apiGetCart, apiGetProducts, apiUpdateCart } from "../../services/api";

const CartScreen = ({ onCartChange }) => {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States quản lý Mã giảm giá (Discount Coupon)
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponAlert, setCouponAlert] = useState({ show: false, variant: "success", msg: "" });

  // States quản lý Modal
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // HOOKS FER202: useRef & useNavigate & useOutletContext
  const couponInputRef = useRef(null);
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const triggerCartUpdate = onCartChange || outletContext?.updateCartCount || (() => {});

  const userId = 1;

  // 1. HOOK useEffect: Fetch dữ liệu REST API từ json-server khi mở trang
  useEffect(() => {
    fetchCartAndProducts();
  }, []);

  const fetchCartAndProducts = async () => {
    setLoading(true);
    try {
      const [cartsData, prodsData] = await Promise.all([
        apiGetCart(userId),
        apiGetProducts()
      ]);
      if (cartsData && cartsData.length > 0) {
        setCart(cartsData[0]);
      }
      setProducts(prodsData || []);
    } catch (error) {
      console.error("Lỗi fetch giỏ hàng từ API:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper tìm thông tin chi tiết sản phẩm theo ID (ES6 find)
  const getProductDetail = (id) =>
    products.find((p) => String(p.id) === String(id));

  // 2. Xử lý Cập Nhật Giỏ Hàng qua REST API (PUT)
  const updateCartItemsAPI = async (newItems) => {
    if (!cart) return;
    const updatedCart = { ...cart, items: newItems };
    await apiUpdateCart(cart.id, updatedCart);
    setCart(updatedCart);
    triggerCartUpdate();
  };

  // Tăng số lượng (+1)
  const handleIncreaseQty = (productId) => {
    const newItems = cart.items.map((item) =>
      String(item.productId) === String(productId)
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    updateCartItemsAPI(newItems);
  };

  // Giảm số lượng (-1)
  const handleDecreaseQty = (productId) => {
    const newItems = cart.items
      .map((item) => {
        if (String(item.productId) === String(productId)) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    updateCartItemsAPI(newItems);
  };

  // Xác nhận Xóa sản phẩm khỏi giỏ hàng
  const handleConfirmDelete = () => {
    if (!deleteProductId) return;
    const newItems = cart.items.filter(
      (item) => String(item.productId) !== String(deleteProductId)
    );
    updateCartItemsAPI(newItems);
    setDeleteProductId(null);
  };

  // 3. TÍNH TOÁN BẰNG ES6 REDUCE & MATH
  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => {
      const prod = getProductDetail(item.productId);
      return prod ? sum + prod.price * item.quantity : sum;
    }, 0);
  };

  const freeShippingThreshold = 500000;
  const currentSubtotal = calculateSubtotal();
  const shippingFee = currentSubtotal >= freeShippingThreshold || currentSubtotal === 0 ? 0 : 30000;
  const discountAmount = Math.round((currentSubtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, currentSubtotal + shippingFee - discountAmount);

  const freeShippingProgress = Math.min(
    100,
    Math.round((currentSubtotal / freeShippingThreshold) * 100)
  );

  // 4. Xử lý Áp Dụng Mã Giảm Giá
  const handleApplyCouponCode = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();

    if (code === "FERSE1990" || code === "FER202") {
      setDiscountPercent(10);
      setCouponAlert({ show: true, variant: "success", msg: "🎉 Áp dụng thành công! Giảm 10% tổng đơn hàng." });
    } else {
      setDiscountPercent(0);
      setCouponAlert({ show: true, variant: "danger", msg: "❌ Mã không hợp lệ. Thử mã: FER202 hoặc FERSE1990" });
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" className="mb-3" />
        <h4 className="fw-bold text-dark">Đang tải thông tin giỏ hàng từ API...</h4>
      </Container>
    );
  }

  const cartItems = cart?.items || [];

  return (
    <Container className="py-4">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER TIÊU ĐỀ TRANG GIỎ HÀNG                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-danger text-white rounded-circle p-2.5 d-flex align-items-center justify-content-center shadow-sm" style={{ width: 46, height: 46 }}>
            <FiShoppingBag size={24} />
          </div>
          <div>
            <h3 className="fw-extrabold text-dark m-0">Giỏ Hàng Của Bạn ({cartItems.length} món)</h3>
            <small className="text-muted">Quản lý danh sách sản phẩm mua sắm và tính tổng hóa đơn</small>
          </div>
        </div>

        <Button variant="outline-secondary" size="sm" className="rounded-3 fw-semibold bg-white" onClick={fetchCartAndProducts}>
          <FiRefreshCw /> Tải lại
        </Button>
      </div>

      {cartItems.length === 0 ? (
        /* TRƯỜNG HỢP GIỎ HÀNG TRỐNG */
        <Card className="border-0 shadow-sm rounded-4 text-center py-5 bg-white">
          <Card.Body>
            <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex p-4 mb-3">
              <FiShoppingBag size={48} />
            </div>
            <h4 className="fw-bold text-dark mb-2">Giỏ hàng của bạn đang trống</h4>
            <p className="text-muted mb-4">Hãy chọn mua các món thực phẩm tươi ngon cho gia đình bạn nhé!</p>
            <Button variant="danger" size="lg" className="fw-bold rounded-pill px-4 shadow-sm" onClick={() => navigate("/home")}>
              Khám Phá Sản Phẩm Ngay
            </Button>
          </Card.Body>
        </Card>
      ) : (
        /* TRƯỜNG HỢP CÓ SẢN PHẨM TRONG GIỎ HÀNG */
        <Row className="g-4">
          {/* CỘT TRÁI: DANH SÁCH MÓN VÀ THANH FREESHIP */}
          <Col lg={8}>
            {/* Thanh tiến trình Miễn phí giao hàng */}
            <Card className="border-0 shadow-sm rounded-4 mb-3 p-3 bg-white">
              <div className="d-flex align-items-center gap-2 fw-bold small text-dark mb-2">
                <FiTruck className="text-danger" size={18} />
                <span>
                  {freeShippingProgress >= 100
                    ? "🎉 Chúc mừng! Đơn hàng của bạn được Miễn Phí Giao Hàng."
                    : `Mua thêm ${(freeShippingThreshold - currentSubtotal).toLocaleString("vi-VN")} đ để nhận Miễn Phí Giao Hàng!`}
                </span>
              </div>
              <ProgressBar variant="danger" now={freeShippingProgress} style={{ height: 10 }} className="rounded-pill" />
            </Card>

            {/* Bảng Danh Sách Sản Phẩm Trong Giỏ Hàng (React-Bootstrap Table) */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <Table responsive hover align="middle" className="mb-0">
                <thead className="table-light">
                  <tr className="small text-secondary">
                    <th className="ps-4">Sản phẩm</th>
                    <th>Giá bán</th>
                    <th className="text-center">Số lượng</th>
                    <th>Thành tiền</th>
                    <th className="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const prod = getProductDetail(item.productId);
                    if (!prod) return null;
                    const lineTotal = prod.price * item.quantity;

                    return (
                      <tr key={item.productId}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="rounded-3 object-fit-cover"
                              style={{ width: 56, height: 56 }}
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=60";
                              }}
                            />
                            <div>
                              <div className="fw-bold text-dark">{prod.name}</div>
                              <small className="text-muted">Mã: #{prod.id}</small>
                            </div>
                          </div>
                        </td>

                        <td className="fw-semibold text-secondary">
                          {prod.price.toLocaleString("vi-VN")} đ
                        </td>

                        {/* Nút tăng/giảm số lượng */}
                        <td className="text-center">
                          <div className="d-inline-flex align-items-center gap-2 bg-light rounded-pill p-1 border">
                            <Button
                              variant="white"
                              size="sm"
                              className="rounded-circle p-0 border shadow-sm d-flex align-items-center justify-content-center"
                              style={{ width: 28, height: 28 }}
                              onClick={() => handleDecreaseQty(item.productId)}
                            >
                              <FiMinus size={12} />
                            </Button>

                            <span className="fw-bold px-2">{item.quantity}</span>

                            <Button
                              variant="white"
                              size="sm"
                              className="rounded-circle p-0 border shadow-sm d-flex align-items-center justify-content-center"
                              style={{ width: 28, height: 28 }}
                              onClick={() => handleIncreaseQty(item.productId)}
                            >
                              <FiPlus size={12} />
                            </Button>
                          </div>
                        </td>

                        <td className="fw-extrabold text-danger">
                          {lineTotal.toLocaleString("vi-VN")} đ
                        </td>

                        <td className="text-center">
                          <Button
                            variant="link"
                            className="text-danger p-0 text-decoration-none fw-semibold"
                            onClick={() => setDeleteProductId(item.productId)}
                          >
                            <FiTrash2 size={16} /> Xóa
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card>
          </Col>

          {/* ------------------------------------------------------------------ */}
          {/* CỘT PHẢI: TÍNH BILL TỰ ĐỘNG VÀ ÁP MÃ GIẢM GIÁ                       */}
          {/* ------------------------------------------------------------------ */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: 84 }}>
              <Card.Title className="fw-extrabold text-dark mb-3 d-flex align-items-center gap-2">
                <FiFileText className="text-danger" /> Tóm Tắt Hóa Đơn (Bill)
              </Card.Title>

              {/* Tạm tính */}
              <div className="d-flex justify-content-between text-secondary mb-2 small">
                <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                <span className="fw-bold text-dark">{currentSubtotal.toLocaleString("vi-VN")} đ</span>
              </div>

              {/* Phí giao hàng */}
              <div className="d-flex justify-content-between text-secondary mb-2 small">
                <span>Phí giao hàng:</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-success">Miễn phí</strong>
                  ) : (
                    `${shippingFee.toLocaleString("vi-VN")} đ`
                  )}
                </span>
              </div>

              {/* Số tiền giảm giá nếu có */}
              {discountPercent > 0 && (
                <div className="d-flex justify-content-between text-success mb-2 small fw-bold">
                  <span>Giảm giá ({discountPercent}%):</span>
                  <span>-{discountAmount.toLocaleString("vi-VN")} đ</span>
                </div>
              )}

              {/* Ô Nhập Mã Giảm Giá */}
              <Form onSubmit={handleApplyCouponCode} className="my-3">
                <Form.Group controlId="couponInput">
                  <Form.Label className="fw-bold text-secondary fs-7">Mã giảm giá (Ví dụ: FER202)</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      ref={couponInputRef}
                      placeholder="Nhập mã FER202..."
                      className="bg-light border-1 fs-6"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline-danger" type="submit" className="fw-bold text-nowrap">
                      <FiTag /> Áp dụng
                    </Button>
                  </div>
                </Form.Group>
                {couponAlert.show && (
                  <div className={`fs-7 fw-bold mt-1.5 ${couponAlert.variant === "success" ? "text-success" : "text-danger"}`}>
                    {couponAlert.msg}
                  </div>
                )}
              </Form>

              <hr />

              {/* TỔNG TIỀN THANH TOÁN */}
              <div className="d-flex justify-content-between align-items-baseline mb-4">
                <span className="fw-bold text-dark fs-6">Tổng tiền thanh toán:</span>
                <span className="fs-3 fw-extrabold text-danger">
                  {finalTotal.toLocaleString("vi-VN")} đ
                </span>
              </div>

              {/* NÚT TIẾN HÀNH THANH TOÁN & NÚT MUA THÊM */}
              <Button
                variant="danger"
                size="lg"
                className="w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 mb-2 shadow-sm fs-6"
                onClick={() => setShowCheckoutModal(true)}
              >
                Tiến Hành Thanh Toán <FiArrowRight />
              </Button>

              <Button
                variant="light"
                className="w-100 py-2 fw-semibold text-secondary rounded-3 border"
                onClick={() => navigate("/home")}
              >
                ← Tiếp tục mua hàng
              </Button>
            </Card>
          </Col>
        </Row>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* REACT-BOOTSTRAP MODAL: XÁC NHẬN XÓA SẢN PHẨM                      */}
      {/* ------------------------------------------------------------------ */}
      <Modal show={!!deleteProductId} onHide={() => setDeleteProductId(null)} centered size="sm">
        <Modal.Body className="text-center p-4">
          <FiTrash2 size={44} className="text-danger mb-3" />
          <h5 className="fw-bold text-dark mb-2">Xác Nhận Xóa</h5>
          <p className="text-muted small mb-4">Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</p>
          <div className="d-flex gap-2">
            <Button variant="light" className="flex-grow-1 fw-bold" onClick={() => setDeleteProductId(null)}>
              Hủy
            </Button>
            <Button variant="danger" className="flex-grow-1 fw-bold" onClick={handleConfirmDelete}>
              Xóa Ngay
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* ------------------------------------------------------------------ */}
      {/* REACT-BOOTSTRAP MODAL: XÁC NHẬN CHI TIẾT HÓA ĐƠN                  */}
      {/* ------------------------------------------------------------------ */}
      <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)} centered>
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-extrabold text-danger fs-5 d-flex align-items-center gap-2">
            <FiShoppingBag /> Xác Nhận Chi Tiết Hóa Đơn (Bill)
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="py-2">
          <div className="bg-light p-3 rounded-3 border mb-0">
            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Tổng số món sản phẩm:</span>
              <strong className="text-dark">{cartItems.length} món</strong>
            </div>
            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Tổng tạm tính:</span>
              <strong className="text-dark">{currentSubtotal.toLocaleString("vi-VN")} đ</strong>
            </div>
            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Phí vận chuyển dự kiến:</span>
              <strong className={shippingFee === 0 ? "text-success" : "text-dark"}>
                {shippingFee === 0 ? "Miễn Phí" : `${shippingFee.toLocaleString("vi-VN")} đ`}
              </strong>
            </div>
            {discountAmount > 0 && (
              <div className="d-flex justify-content-between mb-2 small text-success">
                <span>Giảm giá ({discountPercent}%):</span>
                <strong>-{discountAmount.toLocaleString("vi-VN")} đ</strong>
              </div>
            )}
            <hr className="my-2" />
            <div className="d-flex justify-content-between align-items-center fs-6">
              <span className="fw-bold text-dark">Tổng tiền phải trả:</span>
              <span className="fs-5 fw-extrabold text-danger">
                {finalTotal.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-top-0 pt-2 gap-2">
          <Button variant="light" className="fw-bold px-4 rounded-pill border" onClick={() => setShowCheckoutModal(false)}>
            Hủy
          </Button>

          <Button
            variant="danger"
            className="fw-bold px-4 rounded-pill shadow-sm d-flex align-items-center gap-2"
            onClick={() => {
              setShowCheckoutModal(false);
              navigate("/checkout", { state: { cart, products, finalTotal, discountPercent } });
            }}
          >
            Sang trang thanh toán <FiArrowRight />
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default CartScreen;
