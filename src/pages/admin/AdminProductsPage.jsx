import React, { useState, useEffect, useRef } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiBox,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiList,
  FiGrid
} from "react-icons/fi";
import {
  apiGetProducts,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct
} from "../../services/api";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Form Modal (Create / Edit)
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

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
  const [deleteItem, setDeleteItem] = useState(null);

  // Alert State
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });

  const nameInputRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (showModal && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showModal]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await apiGetProducts();
    setProducts(data || []);
    setLoading(false);
  };

  const showAlert = (type, msg) => {
    setAlert({ show: true, type, msg });
    setTimeout(() => {
      setAlert({ show: false, type: "success", msg: "" });
    }, 3000);
  };

  const handleOpenCreate = () => {
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

  const handleOpenEdit = (product) => {
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

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showAlert("danger", "Vui lòng điền tên và giá sản phẩm!");
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
    loadProducts();
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    await apiDeleteProduct(deleteItem.id);
    showAlert("success", `Đã xóa sản phẩm "${deleteItem.name}" thành công!`);
    setShowDeleteModal(false);
    setDeleteItem(null);
    loadProducts();
  };

  const getCategoryName = (catId) => {
    switch (Number(catId)) {
      case 1:
        return "Hoa quả tươi";
      case 2:
        return "Thức uống";
      case 3:
        return "Đồ ăn & Thực phẩm";
      default:
        return "Khác";
    }
  };

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCat =
      filterCategory === "all" || String(item.categoryId) === filterCategory;
    return matchesSearch && matchesCat;
  });

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
            <FiBox className="text-success" /> Quản Lý Danh Sách Sản Phẩm
          </h3>
          <p className="text-muted small m-0 mt-1">
            Thực hiện các thao tác Thêm (POST), Sửa (PUT), Xóa (DELETE) sản phẩm siêu thị
          </p>
        </div>

        <button
          className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
          onClick={handleOpenCreate}
        >
          <FiPlus size={18} /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Main Panel Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        {/* Search, Filter & View Controls */}
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
            className="form-select w-auto fw-semibold border-1 rounded-3"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">🌟 Tất cả danh mục</option>
            <option value="1">🍎 Hoa quả tươi</option>
            <option value="2">🥤 Thức uống</option>
            <option value="3">🥖 Đồ ăn & Thực phẩm</option>
          </select>

          <button
            className="btn btn-white border d-flex align-items-center gap-1 fw-semibold text-secondary rounded-3"
            onClick={loadProducts}
          >
            <FiRefreshCw /> Tải lại
          </button>

          <div className="d-flex align-items-center gap-1 bg-white rounded-pill p-1 border ms-auto">
            <button
              className={`btn btn-sm rounded-pill px-3 fw-bold ${
                viewMode === "table" ? "btn-success" : "btn-light text-secondary border-0"
              }`}
              onClick={() => setViewMode("table")}
            >
              <FiList /> Dạng Bảng
            </button>
            <button
              className={`btn btn-sm rounded-pill px-3 fw-bold ${
                viewMode === "grid" ? "btn-success" : "btn-light text-secondary border-0"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <FiGrid /> Dạng Thẻ
            </button>
          </div>
        </div>

        {/* Content View: Table or Grid */}
        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-success mb-2" role="status"></div>
            <h5>Đang tải dữ liệu sản phẩm...</h5>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="fw-bold text-dark">Không có sản phẩm nào phù hợp</h5>
            <p className="text-muted small">Vui lòng thử tìm kiếm với từ khóa khác.</p>
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
                        style={{ width: 48, height: 48 }}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=60";
                        }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{item.name}</div>
                      <div className="text-muted small text-truncate" style={{ maxWidth: 260 }}>
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
                          onClick={() => handleOpenEdit(item)}
                        >
                          <FiEdit2 /> Sửa
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger fw-semibold d-inline-flex align-items-center gap-1 px-3 py-1.5 rounded-3"
                          onClick={() => {
                            setDeleteItem(item);
                            setShowDeleteModal(true);
                          }}
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
                          className="btn btn-outline-success btn-sm flex-grow-1 fw-bold rounded-3 py-2 d-flex align-items-center justify-content-center gap-1"
                          onClick={() => handleOpenEdit(product)}
                        >
                          <FiEdit2 size={14} /> Sửa
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm flex-grow-1 fw-bold rounded-3 py-2 d-flex align-items-center justify-content-center gap-1"
                          onClick={() => {
                            setDeleteItem(product);
                            setShowDeleteModal(true);
                          }}
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

      {/* CREATE / EDIT MODAL */}
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
                    <label className="form-label fw-bold text-secondary small">Tên sản phẩm *</label>
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
                      <label className="form-label fw-bold text-secondary small">Giá bán (VND) *</label>
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
                      <label className="form-label fw-bold text-secondary small">Số lượng tồn kho</label>
                      <input
                        type="number"
                        className="form-control rounded-3"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">Danh mục *</label>
                    <select
                      className="form-select rounded-3"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    >
                      <option value="1">🍎 Hoa quả tươi</option>
                      <option value="2">🥤 Thức uống</option>
                      <option value="3">🥖 Đồ ăn & Thực phẩm</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small">Link hình ảnh (URL)</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="/images/apple.jpg"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label fw-bold text-secondary small">Mô tả sản phẩm</label>
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
                    Hủy
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
      {showDeleteModal && deleteItem && (
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
                  Bạn có chắc chắn muốn xóa sản phẩm <strong>"{deleteItem.name}"</strong> không?
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

export default AdminProductsPage;
