import React, { useEffect, useState } from "react";
import { FiFileText, FiCheckCircle, FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { apiGetOrders } from "../services/api";

const BillPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await apiGetOrders(1);
    setOrders(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-success mb-3" role="status"></div>
        <h2>Đang tải lịch sử hóa đơn đơn hàng...</h2>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <div
          className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: 44, height: 44 }}
        >
          <FiFileText size={22} />
        </div>
        <h2 className="fw-extrabold text-dark m-0">
          Lịch Sử Đơn Hàng & Hóa Đơn ({orders.length})
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-4 shadow-sm p-5 text-center my-4">
          <div
            className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 80, height: 80 }}
          >
            <FiShoppingBag size={36} />
          </div>
          <h3 className="fw-bold text-dark mb-2">Bạn chưa có hóa đơn mua hàng nào</h3>
          <p className="text-muted mb-4">
            Hãy trải nghiệm mua sắm tại cửa hàng để tích lũy lịch sử đơn hàng nhé!
          </p>
          <button
            className="btn btn-success btn-lg fw-bold rounded-pill px-4 shadow-sm"
            onClick={() => navigate("/home")}
          >
            Mua Sắm Ngay
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden" key={order.id}>
              <div className="card-header bg-light d-flex flex-wrap justify-content-between align-items-center py-3 px-4 border-0">
                <div>
                  <span className="badge bg-success fs-6 px-3 py-2 rounded-pill me-3">
                    Mã Hóa Đơn: #{order.orderRef || order.id}
                  </span>
                  <span className="text-muted small fw-semibold">
                    📅 Ngày đặt: {order.createdAt || "2026-03-01"}
                  </span>
                </div>
                <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill d-flex align-items-center gap-1">
                  <FiCheckCircle /> Hoàn thành
                </span>
              </div>

              <div className="card-body p-0">
                {order.items && order.items.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr className="small text-secondary">
                          <th className="ps-4">Sản phẩm</th>
                          <th className="text-center">Số lượng</th>
                          <th className="text-end">Đơn giá</th>
                          <th className="text-end pe-4">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="ps-4 fw-bold text-dark">
                              {item.productName || `Sản phẩm #${item.productId}`}
                            </td>
                            <td className="text-center text-muted fw-semibold">x{item.quantity}</td>
                            <td className="text-end text-muted">
                              {(item.price || 0).toLocaleString("vi-VN")} đ
                            </td>
                            <td className="text-end pe-4 fw-bold text-dark">
                              {((item.price || 0) * item.quantity).toLocaleString("vi-VN")} đ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="card-footer bg-white border-top py-3 px-4 d-flex justify-content-between align-items-center">
                <span className="fw-bold text-secondary">Tổng Tiền Đã Thanh Toán:</span>
                <span className="fs-4 fw-extrabold text-success">
                  {(order.totalAmount || 0).toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillPage;

