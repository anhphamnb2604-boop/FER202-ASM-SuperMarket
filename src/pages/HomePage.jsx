import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiShoppingBag,
  FiCheck,
  FiTrendingUp,
  FiZap,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiShield,
  FiX
} from "react-icons/fi";
import {
  apiGetProducts,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiGetCart,
  apiUpdateCart
} from "../services/api";

const HomePage = ({ onCartChange = () => { } }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [toast, setToast] = useState({ show: false, title: "", desc: "" });
  const [currentUser, setCurrentUser] = useState(null);

  // Admin Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: 1,
    stock: 50,
    image: "",
    description: ""
  });

  const userId = 1;

  useEffect(() => {
    loadProducts();
    checkUserSession();
  }, []);

  const checkUserSession = () => {
    const saved = localStorage.getItem("fer_current_user") || localStorage.getItem("user");
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {}
    }
  };

  const isAdmin = currentUser?.role === "admin" || currentUser?.email?.toLowerCase().includes("admin");

  const loadProducts = async () => {
    setLoading(true);
    const data = await apiGetProducts();
    setProducts(data || []);
    setLoading(false);
  };

  const showToastNotification = (title, desc) => {
    setToast({ show: true, title, desc });
    setTimeout(() => {
      setToast({ show: false, title: "", desc: "" });
    }, 2800);
  };

  const handleAddToCart = async (product) => {
    try {
      const carts = await apiGetCart(userId);
      let cart = carts[0] || { id: "1", userId, items: [] };

      const existingItemIndex = cart.items.findIndex(
        (item) => String(item.productId) === String(product.id)
      );

      let updatedItems = [...cart.items];
      if (existingItemIndex > -1) {
        updatedItems[existingItemIndex].quantity += 1;
      } else {
        updatedItems.push({
          productId: String(product.id),
          quantity: 1
        });
      }

      const updatedCart = { ...cart, items: updatedItems };
      await apiUpdateCart(cart.id, updatedCart);

      onCartChange();
      showToastNotification(
        "Đã thêm vào giỏ hàng!",
        `${product.name} đã được chọn.`
      );
    } catch (err) {
      console.error("Lỗi addToCart:", err);
    }
  };

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      categoryId: 1,
      stock: 50,
      image: "/images/apple.jpg",
      description: ""
    });
    setShowProductModal(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || "",
      price: prod.price || "",
      categoryId: prod.categoryId || 1,
      stock: prod.stock || 50,
      image: prod.image || "",
      description: prod.description || ""
    });
    setShowProductModal(true);
  };

  // Save (Create / Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Vui lòng điền tên và giá sản phẩm!");
      return;
    }

    const payload = {
      name: formData.name,
      price: Number(formData.price),
      categoryId: Number(formData.categoryId),
      stock: Number(formData.stock) || 50,
      image: formData.image || "/images/apple.jpg",
      description: formData.description || "Thực phẩm tươi sạch chất lượng cao."
    };

    try {
      if (editingProduct) {
        await apiUpdateProduct(editingProduct.id, payload);
        showToastNotification("Thành Công!", `Đã cập nhật sản phẩm "${formData.name}".`);
      } else {
        await apiCreateProduct(payload);
        showToastNotification("Thành Công!", `Đã thêm sản phẩm mới "${formData.name}".`);
      }
      setShowProductModal(false);
      loadProducts();
    } catch (err) {
      console.error("Lỗi lưu sản phẩm:", err);
      alert("Đã xảy ra lỗi khi lưu sản phẩm!");
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      await apiDeleteProduct(deletingProduct.id);
      showToastNotification("Đã Xóa!", `Đã xóa sản phẩm "${deletingProduct.name}".`);
      setDeletingProduct(null);
      loadProducts();
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      alert("Đã xảy ra lỗi khi xóa sản phẩm!");
    }
  };

  // Categories mapping helper
  const getCategoryName = (catId) => {
    switch (Number(catId)) {
      case 1:
        return "Hoa quả tươi";
      case 2:
        return "Thức uống";
      case 3:
        return "Đồ ăn & Thực phẩm";
      default:
        return "Sản phẩm";
    }
  };

  // Filter & Sort logic
  const filteredProducts = products
    .filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        String(item.categoryId) === String(selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="container py-4">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1100 }}
        >
          <div className="toast show align-items-center text-white bg-success border-0 shadow-lg rounded-3">
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2 fw-semibold">
                <FiCheck size={20} />
                <div>
                  <div>{toast.title}</div>
                  <small className="opacity-75">{toast.desc}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add/Edit Product Modal */}
      {showProductModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", zIndex: 1055 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-success d-flex align-items-center gap-2">
                  <FiShield /> {editingProduct ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowProductModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveProduct}>
                <div className="modal-body py-3">
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-secondary">Tên Sản Phẩm *</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="Ví dụ: Táo Red Delicious"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-bold small text-secondary">Giá Bán (VNĐ) *</label>
                      <input
                        type="number"
                        className="form-control rounded-3"
                        placeholder="Ví dụ: 45000"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-bold small text-secondary">Danh Mục *</label>
                      <select
                        className="form-select rounded-3 fw-semibold"
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      >
                        <option value={1}>🍎 Hoa quả tươi</option>
                        <option value={2}>🥤 Thức uống</option>
                        <option value={3}>🥖 Đồ ăn & Thực phẩm</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-secondary">Đường Dẫn Hình Ảnh (URL / Path)</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="/images/apple.jpg"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold small text-secondary">Mô Tả Sản Phẩm</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="2"
                      placeholder="Mô tả ngắn về sản phẩm..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0 gap-2">
                  <button
                    type="button"
                    className="btn btn-light fw-semibold rounded-pill px-4"
                    onClick={() => setShowProductModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success fw-bold rounded-pill px-4 shadow-sm"
                  >
                    {editingProduct ? "Lưu Thay Đổi" : "Thêm Ngay"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Delete Confirmation Modal */}
      {deletingProduct && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", zIndex: 1055 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content rounded-4 border-0 shadow-lg text-center p-3">
              <div className="modal-body">
                <FiTrash2 size={42} className="text-danger mb-3" />
                <h5 className="fw-bold text-dark mb-2">Xác Nhận Xóa</h5>
                <p className="text-muted small">
                  Bạn có chắc chắn muốn xóa sản phẩm <strong>"{deletingProduct.name}"</strong> khỏi siêu thị?
                </p>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light flex-grow-1 fw-bold rounded-3"
                  onClick={() => setDeletingProduct(null)}
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

      {/* Admin Control Banner (Only visible when logged in as Admin) */}
      {isAdmin && (
        <div className="bg-white border border-success p-3 rounded-4 shadow-sm mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
              <FiShield size={24} />
            </div>
            <div>
              <h6 className="fw-bold text-dark m-0">Quyền Quản Trị Viên (Admin)</h6>
              <small className="text-muted">Bạn có thể Thêm, Sửa, Xóa sản phẩm trực tiếp trên Trang Chủ.</small>
            </div>
          </div>
          <button
            className="btn btn-success fw-bold rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
            onClick={handleOpenAddModal}
          >
            <FiPlus size={18} /> Thêm Sản Phẩm Mới
          </button>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="bg-success bg-gradient text-white p-4 p-md-5 rounded-4 shadow-sm mb-4">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-white text-success fw-bold px-3 py-2 rounded-pill mb-3">
              <FiZap className="me-1" /> Siêu Thị Thực Phẩm Tươi Sạch
            </span>
            <h1 className="display-6 fw-extrabold mb-3">
              Nông Sản Tươi & Đồ Uống Chất Lượng Cao Mỗi Ngày
            </h1>
            <p className="lead mb-4 opacity-90 fs-6">
              Giao hàng nhanh tận nhà trong 2 giờ. Cam kết chất lượng tươi ngon chuẩn hữu cơ 100%.
            </p>

            {/* Search Input Bar */}
            <div className="input-group input-group-lg bg-white rounded-pill p-1 shadow-sm" style={{ maxWidth: 540 }}>
              <span className="input-group-text bg-transparent border-0 ps-3">
                <FiSearch className="text-muted" size={20} />
              </span>
              <input
                type="text"
                className="form-control border-0 bg-transparent shadow-none fs-6"
                placeholder="Tìm kiếm sản phẩm táo, sữa, nước giải khát, bánh mì..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs & Sorting Controls */}
      <div className="bg-white p-3 rounded-4 shadow-sm mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex flex-wrap gap-2">
          <button
            className={`btn rounded-pill px-3 py-2 fw-bold text-nowrap ${selectedCategory === "all"
                ? "btn-success"
                : "btn-outline-secondary"
              }`}
            onClick={() => setSelectedCategory("all")}
          >
            🌟 Tất cả sản phẩm
          </button>
          <button
            className={`btn rounded-pill px-3 py-2 fw-bold text-nowrap ${selectedCategory === "1"
                ? "btn-success"
                : "btn-outline-secondary"
              }`}
            onClick={() => setSelectedCategory("1")}
          >
            🍎 Hoa quả
          </button>
          <button
            className={`btn rounded-pill px-3 py-2 fw-bold text-nowrap ${selectedCategory === "2"
                ? "btn-success"
                : "btn-outline-secondary"
              }`}
            onClick={() => setSelectedCategory("2")}
          >
            🥤 Thức uống
          </button>
          <button
            className={`btn rounded-pill px-3 py-2 fw-bold text-nowrap ${selectedCategory === "3"
                ? "btn-success"
                : "btn-outline-secondary"
              }`}
            onClick={() => setSelectedCategory("3")}
          >
            🥖 Đồ ăn
          </button>
        </div>

        <div className="d-flex align-items-center gap-2 ms-auto">
          <FiTrendingUp className="text-success" size={18} />
          <span className="fw-semibold text-secondary small text-nowrap">Sắp xếp:</span>
          <select
            className="form-select border-1 rounded-3 w-auto fw-bold"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="name">Tên sản phẩm A-Z</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border text-success mb-3" role="status"></div>
          <h4>Đang tải danh sách sản phẩm tươi sạch...</h4>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm my-4">
          <h4 className="fw-bold text-dark">Không tìm thấy sản phẩm nào phù hợp</h4>
          <p className="text-muted mb-0">Vui lòng thử từ khóa tìm kiếm khác hoặc chuyển danh mục.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredProducts.map((product) => {
            const originalPrice = Math.round(product.price * 1.15);
            return (
              <div className="col" key={product.id}>
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-lift bg-white">
                  <div className="position-relative bg-light text-center p-3">
                    <span className="badge bg-danger position-absolute top-0 start-0 m-3 px-2 py-1.5 rounded-pill">
                      -15%
                    </span>
                    <span className="badge bg-success bg-opacity-10 text-success fw-bold position-absolute top-0 end-0 m-3 px-2 py-1.5 rounded-pill">
                      {getCategoryName(product.categoryId)}
                    </span>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="img-fluid rounded-3 object-fit-cover"
                      style={{ height: 160, width: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60";
                      }}
                    />
                  </div>

                  <div className="card-body d-flex flex-column p-3">
                    <h6 className="card-title fw-bold text-dark mb-1 text-truncate">
                      {product.name}
                    </h6>
                    <p className="card-text text-muted small mb-3 flex-grow-1 text-truncate" style={{ maxHeight: 40 }}>
                      {product.description ||
                        "Thực phẩm tươi sạch chất lượng cao đóng gói theo tiêu chuẩn an toàn."}
                    </p>

                    <div className="d-flex align-items-baseline gap-2 mb-3">
                      <span className="fs-5 fw-extrabold text-success">
                        {product.price.toLocaleString("vi-VN")} đ
                      </span>
                      <span className="text-decoration-line-through text-muted small">
                        {originalPrice.toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    <button
                      className="btn btn-success w-100 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FiShoppingBag /> Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomePage;