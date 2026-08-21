import React, { useState, useEffect } from "react";
import {
  FiFileText,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiUser,
  FiPhone,
  FiMapPin,
  FiDollarSign,
  FiClock
} from "react-icons/fi";
import { apiGetAllOrders, apiUpdateOrder } from "../../services/api";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await apiGetAllOrders();
    setOrders(data || []);
    setLoading(false);
  };

  const showAlert = (type, msg) => {
    setAlert({ show: true, type, msg });
    setTimeout(() => {
      setAlert({ show: false, type: "success", msg: "" });
    }, 3000);
  };

  const handleUpdateStatus = async (order, newStatus) => {
    try {
      const updatedOrder = { ...order, status: newStatus };
      await apiUpdateOrder(order.id, updatedOrder);
      showAlert("success", `Đã cập nhật trạng thái đơn #${order.orderRef || order.id}!`);
      loadOrders();
    } catch (err) {
      showAlert("danger", "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng!");
    }
  };

  return (
    <div className="container pb-5">
      {/* Alert Notification */}
      {alert.show && (
        <div className={`alert alert-${alert.type} d-flex align-items-center mb-4 shadow-sm rounded-3`}>
          {alert.type === "success" ? (
            <FiCheckCircle className="me-2 fs-4 text-success" />
          ) : (
            <FiXCircle className="me-2 fs-4 text-danger" />
          )}
          <div className="fw-bold">{alert.msg}</div>
        </div>
      )}

      {/* Header Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-extrabold text-dark d-flex align-items-center gap-2 m-0">
            <FiFileText className="text-success" /> Quản Lý Đơn Hàng Khách Hàng
          </h3>
          <p className="text-muted small m-0 mt-1">
            Theo dõi danh sách đơn hàng đã đặt, phương thức thanh toán và cập nhật trạng thái giao hàng
          </p>
        </div>

        <button
          className="btn btn-white border fw-semibold rounded-3 d-flex align-items-center gap-2"
          onClick={loadOrders}
        >
          <FiRefreshCw /> Tải lại dữ liệu
        </button>
      </div>

      {/* Orders Table Panel */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-success mb-2" role="status"></div>
            <h5>Đang tải danh sách đơn hàng...</h5>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FiFileText size={48} className="mb-2 text-muted" />
            <h5 className="fw-bold text-dark">Chưa có đơn hàng nào</h5>
            <p className="small">Khi khách hàng đặt mua sản phẩm, đơn hàng sẽ hiển thị tại đây.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-secondary">
                  <th className="ps-4">Mã Đơn Hàng</th>
                  <th>Người Nhận</th>
                  <th>Số Điện Thoại</th>
                  <th>Địa Chỉ Giao Hàng</th>
                  <th>Ngày Đặt</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái Hiện Tại</th>
                  <th className="text-center">Cập Nhật Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="ps-4 fw-bold text-success">
                      #{order.orderRef || order.id}
                    </td>
                    <td>
                      <div className="fw-bold text-dark d-flex align-items-center gap-1">
                        <FiUser size={14} className="text-muted" />
                        {order.recipientName || "Khách hàng"}
                      </div>
                    </td>
                    <td>
                      <div className="text-secondary small d-flex align-items-center gap-1">
                        <FiPhone size={14} className="text-muted" />
                        {order.phone || "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="small text-muted d-flex align-items-center gap-1" style={{ maxWidth: 240 }}>
                        <FiMapPin size={14} className="text-muted flex-shrink-0" />
                        <span className="text-truncate">{order.shippingAddress || "N/A"}</span>
                      </div>
                    </td>
                    <td className="small text-secondary">
                      <div className="d-flex align-items-center gap-1">
                        <FiClock size={14} className="text-muted" />
                        {order.createdAt || "Hôm nay"}
                      </div>
                    </td>
                    <td className="fw-extrabold text-success">
                      {(order.totalAmount || 0).toLocaleString("vi-VN")} đ
                    </td>
                    <td>
                      {order.status === "completed" ? (
                        <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1.5 rounded-pill">
                          ✓ Hoàn thành
                        </span>
                      ) : order.status === "shipping" ? (
                        <span className="badge bg-primary bg-opacity-10 text-primary fw-bold px-3 py-1.5 rounded-pill">
                          🚚 Đang giao hàng
                        </span>
                      ) : (
                        <span className="badge bg-warning bg-opacity-10 text-warning fw-bold px-3 py-1.5 rounded-pill">
                          ⏳ Đang xử lý
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <select
                        className="form-select form-select-sm w-auto d-inline-block rounded-3 fw-bold border-1"
                        value={order.status || "completed"}
                        onChange={(e) => handleUpdateStatus(order, e.target.value)}
                      >
                        <option value="completed">✓ Hoàn thành</option>
                        <option value="shipping">🚚 Đang giao</option>
                        <option value="pending">⏳ Đang xử lý</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
