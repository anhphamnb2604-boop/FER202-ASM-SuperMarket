import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiCreditCard,
  FiShield,
  FiTruck,
  FiArrowLeft
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
  const [showConfirmOrderModal, setShowConfirmOrderModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "Nguyễn Văn A",
    phone: "0912345678",
    address: "123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
    note: "Giao hàng giờ hành chính giúp mình nhé."
  });

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

  const subTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => {
      const prod = getProduct(item.productId);
      if (!prod) return sum;
      return sum + prod.price * item.quantity;
    }, 0);
  };

  const currentSubtotal = subTotal();
  const shippingFee = currentSubtotal >= 500000 || currentSubtotal === 0 ? 0 : 30000;
  const finalTotal = currentSubtotal + shippingFee;

  const handleProcessOrder = () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!");
      return;
    }
    setShowConfirmOrderModal(true);
  };

  const executeOrderPlacement = async () => {
    setShowConfirmOrderModal(false);
    const newOrderRef = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderData = {
      userId: 1,
      totalAmount: finalTotal,
      status: "completed",
      createdAt: new Date().toISOString().split("T")[0],
      shippingAddress: formData.address,
      recipientName: formData.fullName,
      phone: formData.phone,
      paymentMethod,
      orderRef: newOrderRef,
      items: cart.items.map((item) => {
        const prod = getProduct(item.productId);
        return {
          productId: item.productId,
          productName: prod ? prod.name : "Sản phẩm",
          quantity: item.quantity,
          price: prod ? prod.price : 0
        };
      })
    };

    try {
      await apiCreateOrder(orderData);
      if (cart && cart.id) {
        await apiUpdateCart(cart.id, { ...cart, items: [] });
      }
      onCartChange();
      setOrderRef(newOrderRef);
      setSuccess(true);
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
    }
  };

  if (success) {
    return (
      <div className="container py-5">
        <div className="bg-white p-5 rounded-4 shadow-sm text-center mx-auto" style={{ maxWidth: 640 }}>
          <div
            className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 80, height: 80 }}
          >
            <FiCheckCircle size={44} />
          </div>
          <h2 className="fw-extrabold text-dark mb-2">Đặt Hàng Thành Công!</h2>
          <span className="badge bg-success px-3 py-2 rounded-pill fs-6 mb-3">
            Mã đơn hàng: #{orderRef}
          </span>

          <p className="text-muted mb-4">
            Cảm ơn <strong className="text-dark">{formData.fullName}</strong> đã lựa chọn mua sắm tại FerSe1990 Supermarket!
          </p>

          <div className="bg-light p-4 rounded-3 text-start mb-4 border">
            <div className="mb-2">
              <strong className="text-dark">Địa chỉ nhận hàng:</strong> {formData.address}
            </div>
            <div className="mb-2">
              <strong className="text-dark">Số điện thoại:</strong> {formData.phone}
            </div>
            <div className="mb-2">
              <strong className="text-dark">Phương thức:</strong>{" "}
              {paymentMethod === "cod"
                ? "Thanh toán khi nhận hàng (COD)"
                : paymentMethod === "momo"
                ? "Ví điện tử MoMo"
                : "Thẻ ngân hàng / Thẻ quốc tế"}
            </div>
            <div>
              <strong className="text-dark">Dự kiến giao hàng:</strong> Trong 2 giờ (Trước 17h00 hôm nay)
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <button
              className="btn btn-success fw-bold px-4 py-2.5 rounded-3 shadow-sm"
              onClick={() => navigate("/home")}
            >
              Tiếp Tục Mua Sắm
            </button>
            <button
              className="btn btn-outline-secondary fw-semibold px-4 py-2.5 rounded-3"
              onClick={() => navigate("/about")}
            >
              Về Chúng Tôi
            </button>
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="container py-4">
      {/* Checkout Confirmation Modal */}
      {showConfirmOrderModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-success d-flex align-items-center gap-2">
                  <FiCheckCircle /> Xác Nhận Đặt Hàng Lần Cuối
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmOrderModal(false)}
                ></button>
              </div>
              <div className="modal-body py-3">
                <p className="text-secondary mb-3">
                  Vui lòng kiểm tra lại thông tin giao hàng trước khi xác nhận:
                </p>

                <div className="bg-light p-3 rounded-3 mb-3 border text-start">
                  <div className="mb-2">
                    <strong className="text-dark">Người nhận:</strong> {formData.fullName} ({formData.phone})
                  </div>
                  <div className="mb-2">
                    <strong className="text-dark">Địa chỉ:</strong> {formData.address}
                  </div>
                  <div className="mb-2">
                    <strong className="text-dark">Phương thức:</strong>{" "}
                    {paymentMethod === "cod"
                      ? "COD (Thanh toán khi nhận hàng)"
                      : paymentMethod === "momo"
                      ? "Ví MoMo"
                      : "Thẻ Ngân hàng / Visa"}
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between align-items-center fs-6">
                    <span className="fw-bold text-dark">Tổng tiền thanh toán:</span>
                    <span className="fw-extrabold text-success fs-5">
                      {finalTotal.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0 gap-2">
                <button
                  type="button"
                  className="btn btn-light fw-semibold rounded-pill px-4"
                  onClick={() => setShowConfirmOrderModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-success fw-bold rounded-pill px-4 shadow-sm"
                  onClick={executeOrderPlacement}
                >
                  Xác Nhận Đặt Hàng Ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-3">
        <button
          className="btn btn-sm btn-light border fw-semibold text-secondary d-inline-flex align-items-center gap-1"
          onClick={() => navigate("/cart")}
        >
          <FiArrowLeft /> Quay lại giỏ hàng
        </button>
      </div>

      <div className="row g-4">
        {/* Left Column: Delivery Form */}
        <div className="col-lg-7">
          <div className="bg-white p-4 rounded-4 shadow-sm">
            <h5 className="fw-bold text-dark d-flex align-items-center gap-2 mb-4">
              <FiTruck className="text-success" /> Thông Tin Giao Hàng & Thanh Toán
            </h5>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold small text-secondary">Họ và tên người nhận *</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên..."
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold small text-secondary">Số điện thoại liên hệ *</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại..."
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small text-secondary">Địa chỉ nhận hàng chi tiết *</label>
              <input
                type="text"
                className="form-control rounded-3"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện..."
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold small text-secondary">Ghi chú đơn hàng (Tùy chọn)</label>
              <textarea
                className="form-control rounded-3"
                rows="3"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Lời nhắn cho shipper hoặc thời gian nhận hàng..."
              ></textarea>
            </div>

            <h6 className="fw-bold text-dark mb-3">Phương thức thanh toán</h6>

            <div className="d-flex flex-column gap-2 mb-4">
              <div
                className={`p-3 rounded-3 border cursor-pointer d-flex align-items-center gap-3 ${
                  paymentMethod === "cod" ? "border-success bg-success bg-opacity-10 fw-bold text-success" : "bg-light text-dark"
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <input type="radio" checked={paymentMethod === "cod"} readOnly />
                <span>💵 COD (Thanh toán khi nhận hàng)</span>
              </div>

              <div
                className={`p-3 rounded-3 border cursor-pointer d-flex align-items-center gap-3 ${
                  paymentMethod === "momo" ? "border-success bg-success bg-opacity-10 fw-bold text-success" : "bg-light text-dark"
                }`}
                onClick={() => setPaymentMethod("momo")}
              >
                <input type="radio" checked={paymentMethod === "momo"} readOnly />
                <span>📱 Ví MoMo</span>
              </div>

              <div
                className={`p-3 rounded-3 border cursor-pointer d-flex align-items-center gap-3 ${
                  paymentMethod === "bank" ? "border-success bg-success bg-opacity-10 fw-bold text-success" : "bg-light text-dark"
                }`}
                onClick={() => setPaymentMethod("bank")}
              >
                <input type="radio" checked={paymentMethod === "bank"} readOnly />
                <span>💳 Thẻ ATM / Visa / Master</span>
              </div>
            </div>

            <button
              className="btn btn-success w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-sm fs-6"
              onClick={handleProcessOrder}
            >
              <FiCreditCard size={20} />
              Xác Nhận Đặt Hàng - {finalTotal.toLocaleString("vi-VN")} đ
            </button>
          </div>
        </div>

        {/* Right Column: Order Items Summary */}
        <div className="col-lg-5">
          <div className="bg-white p-4 rounded-4 shadow-sm sticky-top" style={{ top: 84 }}>
            <h5 className="fw-bold text-dark d-flex align-items-center gap-2 mb-3">
              <FiShield className="text-success" /> Đơn Hàng Của Bạn ({items.length} món)
            </h5>

            <div className="d-flex flex-column gap-3 mb-3" style={{ maxHeight: 280, overflowY: "auto" }}>
              {items.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                const lineTotal = product.price * item.quantity;
                return (
                  <div className="d-flex align-items-center gap-3 border-bottom pb-2" key={item.productId}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="rounded-2 object-fit-cover"
                      style={{ width: 48, height: 48 }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=60";
                      }}
                    />
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-dark">{product.name}</div>
                      <div className="text-muted small">
                        SL: {item.quantity} x {product.price.toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                    <div className="fw-bold text-success small">
                      {lineTotal.toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-between text-secondary mb-2 small">
              <span>Tạm tính</span>
              <span className="fw-semibold text-dark">{currentSubtotal.toLocaleString("vi-VN")} đ</span>
            </div>
            <div className="d-flex justify-content-between text-secondary mb-2 small">
              <span>Phí vận chuyển</span>
              <span>
                {shippingFee === 0 ? (
                  <strong className="text-success">Miễn phí</strong>
                ) : (
                  `${shippingFee.toLocaleString("vi-VN")} đ`
                )}
              </span>
            </div>
            <hr />
            <div className="d-flex justify-content-between align-items-baseline">
              <span className="fw-bold text-dark">Tổng số tiền</span>
              <span className="fs-4 fw-extrabold text-success">{finalTotal.toLocaleString("vi-VN")} đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
