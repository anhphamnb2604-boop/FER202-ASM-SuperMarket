import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShoppingBag,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiArrowRight,
  FiTruck,
  FiTag
} from "react-icons/fi";
import { apiGetCart, apiGetProducts, apiUpdateCart } from "../../services/api";

const CartScreen = ({ onCartChange = () => {} }) => {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const [showCheckoutConfirmModal, setShowCheckoutConfirmModal] = useState(false);

  const navigate = useNavigate();
  const userId = 1;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [carts, prods] = await Promise.all([
      apiGetCart(userId),
      apiGetProducts()
    ]);
    if (carts && carts.length > 0) {
      setCart(carts[0]);
    }
    setProducts(prods || []);
    setLoading(false);
  };

  const getProduct = (id) =>
    products.find((p) => String(p.id) === String(id));

  const updateCartItems = async (newItems) => {
    if (!cart) return;
    const updatedCart = { ...cart, items: newItems };
    await apiUpdateCart(cart.id, updatedCart);
    setCart(updatedCart);
    onCartChange();
  };

  const handleIncrease = (productId) => {
    const newItems = cart.items.map((item) =>
      String(item.productId) === String(productId)
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    updateCartItems(newItems);
  };

  const handleDecrease = (productId) => {
    const newItems = cart.items
      .map((item) => {
        if (String(item.productId) === String(productId)) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    updateCartItems(newItems);
  };

  const confirmDelete = () => {
    if (!deleteProductId) return;
    const newItems = cart.items.filter(
      (item) => String(item.productId) !== String(deleteProductId)
    );
    updateCartItems(newItems);
    setDeleteProductId(null);
  };

  const subtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => {
      const prod = getProduct(item.productId);
      if (!prod) return sum;
      return sum + prod.price * item.quantity;
    }, 0);
  };

  const freeShippingThreshold = 500000;
  const currentSubtotal = subtotal();
  const shippingFee =
    currentSubtotal >= freeShippingThreshold || currentSubtotal === 0 ? 0 : 30000;
  const discountAmount = Math.round((currentSubtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, currentSubtotal + shippingFee - discountAmount);

  const progressPercentage = Math.min(
    100,
    Math.round((currentSubtotal / freeShippingThreshold) * 100)
  );

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "FERSE1990") {
      setDiscountPercent(10);
      setCouponMessage("Áp dụng mã thành công! Giảm 10%");
    } else {
      setDiscountPercent(0);
      setCouponMessage("Mã giảm giá không hợp lệ (Thử mã: FERSE1990)");
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-success mb-3" role="status"></div>
        <h2>Đang tải thông tin giỏ hàng...</h2>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="container py-4">
      {/* Delete Confirmation Modal */}
      {deleteProductId && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content rounded-4 border-0 shadow-lg text-center p-3">
              <div className="modal-body">
                <FiTrash2 size={40} className="text-danger mb-3" />
                <h5 className="fw-bold text-dark mb-2">Xác Nhận Xóa</h5>
                <p className="text-muted small">
                  Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
                </p>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light flex-grow-1 fw-bold rounded-3"
                  onClick={() => setDeleteProductId(null)}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-danger flex-grow-1 fw-bold rounded-3"
                  onClick={confirmDelete}
                >
                  Xóa ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {showCheckoutConfirmModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-success d-flex align-items-center gap-2">
                  <FiShoppingBag /> Xác Nhận Đơn Hàng & Thanh Toán
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCheckoutConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body py-3">
                <p className="text-secondary mb-3">
                  Bạn có chắc chắn muốn tiến hành thanh toán đơn hàng này không?
                </p>

                <div className="bg-light p-3 rounded-3 mb-3 border">
                  <div className="d-flex justify-content-between mb-2 small">
                    <span className="text-muted">Số lượng sản phẩm:</span>
                    <strong className="text-dark">{items.length} món</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2 small">
                    <span className="text-muted">Tạm tính:</span>
                    <strong className="text-dark">{currentSubtotal.toLocaleString("vi-VN")} đ</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2 small">
                    <span className="text-muted">Phí vận chuyển:</span>
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
                  onClick={() => setShowCheckoutConfirmModal(false)}
                >
                  Hủy / Quay lại
                </button>
                <button
                  type="button"
                  className="btn btn-success fw-bold rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm"
                  onClick={() => {
                    setShowCheckoutConfirmModal(false);
                    navigate("/checkout", { state: { cart, products } });
                  }}
                >
                  Tiến Hành Thanh Toán <FiArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Title */}
      <div className="d-flex align-items-center gap-2 mb-4">
        <div
          className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: 44, height: 44 }}
        >
          <FiShoppingBag size={22} />
        </div>
        <h2 className="fw-extrabold text-dark m-0">
          Giỏ Hàng Của Bạn ({items.length} món)
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-4 shadow-sm p-5 text-center my-4">
          <div
            className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 80, height: 80 }}
          >
            <FiShoppingBag size={36} />
          </div>
          <h3 className="fw-bold text-dark mb-2">Giỏ hàng của bạn đang trống</h3>
          <p className="text-muted mb-4">
            Hãy chọn những món nông sản tươi ngon và đồ uống chất lượng cho gia đình bạn nhé!
          </p>
          <button
            className="btn btn-success btn-lg fw-bold rounded-pill px-4 shadow-sm"
            onClick={() => navigate("/home")}
          >
            Khám Phá Sản Phẩm Ngay
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {/* Left Column: Cart Items List */}
          <div className="col-lg-8">
            {/* Free Shipping Progress Widget */}
            <div className="bg-white p-3 rounded-4 shadow-sm mb-3">
              <div className="d-flex align-items-center gap-2 text-dark fw-bold small mb-2">
                <FiTruck className="text-success" size={18} />
                <span>
                  {progressPercentage >= 100
                    ? "🎉 Bạn đã nhận được Miễn Phí Giao Hàng!"
                    : `Mua thêm ${(
                        freeShippingThreshold - currentSubtotal
                      ).toLocaleString("vi-VN")} đ để nhận Miễn Phí Giao Hàng!`}
                </span>
              </div>
              <div className="progress rounded-pill" style={{ height: 10 }}>
                <div
                  className="progress-bar bg-success rounded-pill"
                  role="progressbar"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Cart Items Cards */}
            <div className="d-flex flex-column gap-3">
              {items.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                const lineTotal = product.price * item.quantity;

                return (
                  <div
                    className="bg-white p-3 rounded-4 shadow-sm d-flex align-items-center justify-content-between gap-3 flex-wrap flex-sm-nowrap"
                    key={item.productId}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="rounded-3 object-fit-cover"
                      style={{ width: 72, height: 72 }}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=60";
                      }}
                    />

                    <div className="flex-grow-1">
                      <h6 className="fw-bold text-dark mb-1">{product.name}</h6>
                      <span className="text-muted small">
                        {product.price.toLocaleString("vi-VN")} đ / món
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2 bg-light rounded-pill p-1 border">
                      <button
                        className="btn btn-sm btn-white text-dark rounded-circle p-1 border shadow-sm"
                        style={{ width: 30, height: 30 }}
                        onClick={() => handleDecrease(item.productId)}
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="fw-bold px-2">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-white text-dark rounded-circle p-1 border shadow-sm"
                        style={{ width: 30, height: 30 }}
                        onClick={() => handleIncrease(item.productId)}
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    <div className="text-end" style={{ minWidth: 110 }}>
                      <div className="fw-bold text-success fs-6">
                        {lineTotal.toLocaleString("vi-VN")} đ
                      </div>
                      <button
                        className="btn btn-link text-danger p-0 text-decoration-none small fw-semibold d-inline-flex align-items-center gap-1 mt-1"
                        onClick={() => setDeleteProductId(item.productId)}
                      >
                        <FiTrash2 size={14} /> Xóa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-4 shadow-sm sticky-top" style={{ top: 84 }}>
              <h5 className="fw-extrabold text-dark mb-3">Tóm Tắt Đơn Hàng</h5>

              <div className="d-flex justify-content-between text-secondary mb-2 small">
                <span>Tạm tính ({items.length} sản phẩm)</span>
                <span className="fw-semibold text-dark">
                  {currentSubtotal.toLocaleString("vi-VN")} đ
                </span>
              </div>

              <div className="d-flex justify-content-between text-secondary mb-2 small">
                <span>Phí vận chuyển</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-success">Miễn Phí</strong>
                  ) : (
                    `${shippingFee.toLocaleString("vi-VN")} đ`
                  )}
                </span>
              </div>

              {discountPercent > 0 && (
                <div className="d-flex justify-content-between text-success mb-2 small fw-bold">
                  <span>Giảm giá ({discountPercent}%)</span>
                  <span>-{discountAmount.toLocaleString("vi-VN")} đ</span>
                </div>
              )}

              {/* Coupon Code Section */}
              <div className="my-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control rounded-start-3 bg-light border-end-0 fs-6"
                    placeholder="Mã giảm giá (Mẫu: FERSE1990)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-success fw-bold rounded-end-3 px-3"
                    onClick={handleApplyCoupon}
                  >
                    <FiTag className="me-1" /> Áp dụng
                  </button>
                </div>
                {couponMessage && (
                  <div
                    className={`small fw-bold mt-1 ${
                      discountPercent > 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {couponMessage}
                  </div>
                )}
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-baseline mb-4">
                <span className="fw-bold text-dark">Tổng thanh toán</span>
                <span className="fs-4 fw-extrabold text-success">
                  {finalTotal.toLocaleString("vi-VN")} đ
                </span>
              </div>

              <button
                className="btn btn-success w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 mb-2 shadow-sm fs-6"
                onClick={() => setShowCheckoutConfirmModal(true)}
              >
                Tiến Hành Thanh Toán <FiArrowRight />
              </button>

              <button
                className="btn btn-light w-100 py-2 fw-semibold text-secondary rounded-3"
                onClick={() => navigate("/home")}
              >
                ← Tiếp tục chọn hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
