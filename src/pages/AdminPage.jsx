import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiBox,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiLogOut,
  FiList,
  FiGrid,
  FiShoppingBag,
  FiDollarSign,
  FiFileText,
  FiLayers,
  FiTruck,
  FiClock
} from "react-icons/fi";
import {
  apiGetProducts,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiGetAllOrders,
  apiUpdateOrder
} from "../services/api";

const AdminPage = ({ onLogout }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Active Tab: 'products' | 'orders'
  const [activeTab, setActiveTab] = useState("products");

  // View Mode: 'table' | 'grid'
  const [viewMode, setViewMode] = useState("table");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Form Modal State (Create / Edit)
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "100",
    categoryId: "1",
    image: "",
    description: ""
  });

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductItem, setDeleteProductItem] = useState(null);

  // Alert message notification
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });

  const nameInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (showModal && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showModal]);

  const loadData = async () => {
    setLoading(true);
    const [prods, ords] = await Promise.all([
      apiGetProducts(),
      apiGetAllOrders()
    ]);
    setProducts(prods || []);
    setOrders(ords || []);
    setLoading(false);
  };

  const handleLogoutAdmin = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("fer_current_user");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const showAlert = (type, msg) => {
    setAlert({ show: true, type, msg });
    setTimeout(() => {
      setAlert({ show: false, type: "success", msg: "" });
    }, 3000);
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      name: "",
      price: "",
      stock: "100",
      categoryId: "1",
      image: "/images/apple.jpg",
      description: ""
    });
    setShowModal(true);
  };

  // Open modal for Edit (Update)
  const handleOpenEditModal = (product) => {
    setIsEditing(true);
    setEditId(product.id);
    setFormData({
      name: product.name || "",
      price: product.price || "",
      stock: product.stock || "100",
      categoryId: String(product.categoryId || "1"),
      image: product.image || "",
      description: product.description || ""
    });
    setShowModal(true);
  };

  // Handle Form Submission (Create or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showAlert("danger", "Vui lòng điền đầy đủ Tên sản phẩm và Giá!");
      return;
    }

    const payload = {
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock) || 50,
      categoryId: Number(formData.categoryId),
      image: formData.image || "/images/apple.jpg",
      description: formData.description || "Thực phẩm tươi sạch chất lượng cao."
    };

    if (isEditing) {
      await apiUpdateProduct(editId, payload);
      showAlert("success", `Cập nhật sản phẩm "${formData.name}" thành công!`);
    } else {
      await apiCreateProduct(payload);
      showAlert("success", `Thêm mới sản phẩm "${formData.name}" thành công!`);
    }

    setShowModal(false);
    loadData();
  };

  // Open Delete Confirm Modal
  const handleOpenDeleteModal = (product) => {
    setDeleteProductItem(product);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteProductItem) return;
    await apiDeleteProduct(deleteProductItem.id);
    showAlert("success", `Đã xóa sản phẩm "${deleteProductItem.name}" thành công!`);
    setShowDeleteModal(false);
    setDeleteProductItem(null);
    loadData();
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (order, newStatus) => {
    try {
      const updatedOrder = { ...order, status: newStatus };
      await apiUpdateOrder(order.id, updatedOrder);
      showAlert("success", `Đã cập nhật trạng thái đơn #${order.orderRef || order.id}!`);
      loadData();
    } catch (err) {
      showAlert("danger", "Đã xảy ra lỗi khi cập nhật trạng thái!");
    }
  };

  // Category Name Helper
  const getCategoryName = (catId) => {
    switch (Number(catId)) {
      case 1:
        return "Hoa quả";
      case 2:
        return "Thức uống";
      case 3:
        return "Đồ ăn";
      default:
        return "Khác";
    }
  };

  // Filtered Products List
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCat =
      filterCategory === "all" || String(item.categoryId) === filterCategory;
    return matchesSearch && matchesCat;
  });

  // Calculate Dashboard KPI Stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return (
    <div className="container py-4">
      {/* Alert Notification */}
      {alert.show && (
        <div
          className={`alert alert-${alert.type} d-flex align-items-center mb-4 shadow-sm rounded-3`}
        >
          {alert.type === "success" ? (
            <FiCheckCircle className="me-2 fs-4 text-success" />
          ) : (
            <FiXCircle className="me-2 fs-4 text-danger" />
          )}
          <div className="fw-bold">{alert.msg}</div>
        </div>
      )}

      {/* Dedicated Admin Header Bar */}
      <div
        className="bg-success bg-gradient text-white p-3 px-4 rounded-4 shadow-sm mb-4 sticky-top d-flex align-items-center justify-content-between flex-wrap gap-3"
        style={{ top: 12, zIndex: 1020 }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="bg-white text-success rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: 44, height: 44 }}
          >
            <FiBox size={24} />
          </div>
          <div>
            <h4 className="fw-extrabold m-0 text-white">Quản Lý Sản Phẩm (Admin)</h4>
            <small className="text-white-50">Hệ thống quản trị và xử lý đơn hàng siêu thị</small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-light text-success fw-bold px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
            onClick={handleOpenCreateModal}
          >
            <FiPlus size={18} /> Thêm Sản Phẩm Mới
          </button>

          <button
            className="btn btn-danger fw-bold px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
            title="Đăng xuất"
            onClick={handleLogoutAdmin}
          >
            <FiLogOut size={18} /> Đăng Xuất
          </button>
        </div>
      </div>

      {/* Dashboard KPI Stats Cards */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4">
        <div className="col">
          <div className="bg-white p-3.5 rounded-4 shadow-sm border-start border-4 border-success d-flex align-items-center gap-3">
            <div className="bg-success bg-opacity-10 text-success rounded-circle p-3 d-flex align-items-center justify-content-center">
              <FiBox size={24} />
            </div>
            <div>
              <small className="text-muted fw-bold uppercase">Tổng Sản Phẩm</small>
              <h4 className="fw-extrabold text-dark m-0">{totalProducts} món</h4>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="bg-white p-3.5 rounded-4 shadow-sm border-start border-4 border-info d-flex align-items-center gap-3">
            <div className="bg-info bg-opacity-10 text-info rounded-circle p-3 d-flex align-items-center justify-content-center">
              <FiLayers size={24} />
            </div>
            <div>
              <small className="text-muted fw-bold uppercase">Tổng Tồn Kho</small>
              <h4 className="fw-extrabold text-dark m-0">{totalStock} món</h4>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="bg-white p-3.5 rounded-4 shadow-sm border-start border-4 border-warning d-flex align-items-center gap-3">
            <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-3 d-flex align-items-center justify-content-center">
              <FiFileText size={24} />
            </div>
            <div>
              <small className="text-muted fw-bold uppercase">Đơn Hàng Đã Đặt</small>
              <h4 className="fw-extrabold text-dark m-0">{totalOrders} đơn</h4>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="bg-white p-3.5 rounded-4 shadow-sm border-start border-4 border-primary d-flex align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 d-flex align-items-center justify-content-center">
              <FiDollarSign size={24} />
            </div>
            <div>
              <small className="text-muted fw-bold uppercase">Doanh Thu Dự Kiến</small>
              <h4 className="fw-extrabold text-success m-0">{totalRevenue.toLocaleString("vi-VN")} đ</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Header */}
      <div className="bg-white p-2 rounded-4 shadow-sm mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="nav nav-pills gap-2">
          <button
            className={`nav-link rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 ${
              activeTab === "products" ? "active bg-success" : "text-secondary"
            }`}
            onClick={() => setActiveTab("products")}
          >
            <FiShoppingBag /> Quản Lý Sản Phẩm ({products.length})
          </button>
          <button
            className={`nav-link rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 ${
              activeTab === "orders" ? "active bg-success" : "text-secondary"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <FiFileText /> Quản Lý Đơn Hàng ({orders.length})
          </button>
        </div>

        {activeTab === "products" && (
          <div className="d-flex align-items-center gap-1 bg-light rounded-pill p-1 border ms-auto">
            <button
              className={`btn btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1 ${
                viewMode === "table" ? "btn-white shadow-sm text-success" : "text-muted border-0"
              }`}
              onClick={() => setViewMode("table")}
            >
              <FiList /> Dạng Bảng
            </button>
            <button
              className={`btn btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1 ${
                viewMode === "grid" ? "btn-white shadow-sm text-success" : "text-muted border-0"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <FiGrid /> Dạng Thẻ
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {activeTab === "products" && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          {/* Search & Filter Controls */}
          <div className="card-body bg-light border-bottom p-3 d-flex flex-wrap align-items-center gap-3">
            <div className="input-group" style={{ maxWidth: 360 }}>
              <span className="input-group-text bg-white border-end-0">
                <FiSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0 bg-white"
                placeholder="Tìm kiếm sản phẩm theo tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="form-select w-auto fw-semibold border-1"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">🌟 Tất cả danh mục</option>
              <option value="1">🍎 Hoa quả</option>
              <option value="2">🥤 Thức uống</option>
              <option value="3">🥖 Đồ ăn</option>
            </select>

            <button
              className="btn btn-white border d-flex align-items-center gap-1 ms-auto fw-semibold text-secondary"
              onClick={loadData}
            >
              <FiRefreshCw /> Tải lại
            </button>
          </div>

          {/* VIEW MODE 1: BOOTSTRAP TABLE VIEW */}
          {loading ? (
            <div className="text-center py-5 text-muted">
              <div className="spinner-border text-success mb-2" role="status"></div>
              <h5>Đang tải dữ liệu sản phẩm...</h5>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="fw-bold text-dark">Không có sản phẩm nào phù hợp</h5>
              <p className="text-muted small">
                Thử thay đổi từ khóa tìm kiếm hoặc bấm nút "+ Thêm Sản Phẩm Mới".
              </p>
            </div>
          ) : viewMode === "table" ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-secondary">
                    <th className="ps-4">ID</th>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Giá bán (VND)</th>
                    <th>Tồn kho</th>
                    <th className="text-center">Thao tác (CRUD)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((item) => (
                    <tr key={item.id}>
                      <td className="ps-4 fw-bold text-secondary">#{item.id}</td>
                      <td>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded-3 object-fit-cover"
                          style={{ width: 50, height: 50 }}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=60";
                          }}
                        />
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{item.name}</div>
                        <div
                          className="text-muted small text-truncate"
                          style={{ maxWidth: 260 }}
                        >
                          {item.description || "Không có mô tả"}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill">
                          {getCategoryName(item.categoryId)}
                        </span>
                      </td>
                      <td className="fw-bold text-success">
                        {item.price.toLocaleString("vi-VN")} đ
                      </td>
                      <td>
                        {item.stock < 15 ? (
                          <span className="badge bg-danger bg-opacity-10 text-danger fw-bold px-2.5 py-1.5 rounded-pill">
                            ⚠️ Sắp hết ({item.stock || 0})
                          </span>
                        ) : (
                          <span className="fw-semibold text-secondary">
                            {item.stock || 100} món
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-success fw-semibold d-inline-flex align-items-center gap-1 px-3 py-1.5 rounded-3"
                            onClick={() => handleOpenEditModal(item)}
                          >
                            <FiEdit2 /> Sửa
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger fw-semibold d-inline-flex align-items-center gap-1 px-3 py-1.5 rounded-3"
                            onClick={() => handleOpenDeleteModal(item)}
                          >
                            <FiTrash2 /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* VIEW MODE 2: GRID CARD VIEW */
            <div className="p-4 bg-light">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {filteredProducts.map((product) => (
                  <div className="col" key={product.id}>
                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                      <div className="position-relative bg-light text-center p-3">
                        <span className="badge bg-success bg-opacity-10 text-success fw-bold position-absolute top-0 start-0 m-3 px-2.5 py-1.5 rounded-pill">
                          {getCategoryName(product.categoryId)}
                        </span>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="img-fluid rounded-3 object-fit-cover"
                          style={{ height: 140, width: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60";
                          }}
                        />
                      </div>

                      <div className="card-body p-3 d-flex flex-column">
                        <h6 className="fw-bold text-dark mb-1 text-truncate">{product.name}</h6>
                        <span className="fs-5 fw-extrabold text-success mb-2">
                          {product.price.toLocaleString("vi-VN")} đ
                        </span>

                        <div className="d-flex align-items-center justify-content-between mb-3 small">
                          <span className="text-muted">Tồn kho:</span>
                          {product.stock < 15 ? (
                            <span className="badge bg-danger text-white rounded-pill">
                              Sắp hết ({product.stock})
                            </span>
                          ) : (
                            <strong className="text-dark">{product.stock || 100} món</strong>
                          )}
                        </div>

                        <div className="d-flex gap-2 mt-auto">
                          <button
                            className="btn btn-outline-success btn-sm flex-grow-1 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-1 py-2"
                            onClick={() => handleOpenEditModal(product)}
                          >
                            <FiEdit2 size={14} /> Sửa
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm flex-grow-1 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-1 py-2"
                            onClick={() => handleOpenDeleteModal(product)}
                          >
                            <FiTrash2 size={14} /> Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="card-header bg-light border-bottom p-3">
            <h5 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
              <FiTruck className="text-success" /> Danh Sách Đơn Hàng Khách Hàng Đã Đặt
            </h5>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FiFileText size={40} className="mb-2 text-muted" />
              <h5>Chưa có đơn hàng nào được ghi nhận</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-secondary">
                    <th className="ps-4">Mã đơn</th>
                    <th>Người nhận</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th>Ngày đặt</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th className="text-center">Cập nhật trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="ps-4 fw-bold text-success">
                        #{order.orderRef || order.id}
                      </td>
                      <td className="fw-bold text-dark">{order.recipientName || "Khách hàng"}</td>
                      <td className="text-secondary">{order.phone || "N/A"}</td>
                      <td className="small text-muted" style={{ maxWidth: 220 }}>
                        {order.shippingAddress || "N/A"}
                      </td>
                      <td className="small text-secondary">{order.createdAt || "Hôm nay"}</td>
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
                            🚚 Đang giao
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
                          onChange={(e) => handleUpdateOrderStatus(order, e.target.value)}
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
      )}

      {/* CREATE / EDIT MODAL FORM */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg p-3">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-extrabold text-dark">
                  {isEditing ? "✏️ Chỉnh Sửa Sản Phẩm (PUT)" : "➕ Thêm Sản Phẩm Mới (POST)"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmitForm}>
                <div className="modal-body py-3">
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">
                      Tên sản phẩm *
                    </label>
                    <input
                      type="text"
                      ref={nameInputRef}
                      className="form-control rounded-3"
                      placeholder="Nhập tên sản phẩm..."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-bold text-secondary small">
                        Giá bán (VND) *
                      </label>
                      <input
                        type="number"
                        className="form-control rounded-3"
                        placeholder="Ví dụ: 50000"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-bold text-secondary small">
                        Số lượng tồn kho
                      </label>
                      <input
                        type="number"
                        className="form-control rounded-3"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">
                      Danh mục sản phẩm *
                    </label>
                    <select
                      className="form-select rounded-3"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    >
                      <option value="1">🍎 Hoa quả</option>
                      <option value="2">🥤 Thức uống</option>
                      <option value="3">🥖 Đồ ăn & Thực phẩm</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">
                      Link hình ảnh (URL)
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="https://images.unsplash.com/... hoặc /images/tao.jpg"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label fw-bold text-secondary small">
                      Mô tả ngắn
                    </label>
                    <textarea
                      className="form-control rounded-3"
                      rows="2"
                      placeholder="Mô tả chất lượng, xuất xứ sản phẩm..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-top-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light fw-bold rounded-3 px-4"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success fw-bold rounded-3 px-4 shadow-sm"
                  >
                    {isEditing ? "Lưu Cập Nhật" : "Thêm Ngay"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && deleteProductItem && (
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
                  Bạn có chắc chắn muốn xóa sản phẩm <strong>"{deleteProductItem.name}"</strong> không?
                </p>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light flex-grow-1 fw-bold rounded-3"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-danger flex-grow-1 fw-bold rounded-3"
                  onClick={handleConfirmDelete}
                >
                  Xóa Ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
