import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiShoppingBag,
  FiCheck,
  FiTrendingUp,
  FiZap
} from "react-icons/fi";
import { apiGetProducts, apiGetCart, apiUpdateCart } from "../services/api";

const HomePage = ({ onCartChange = () => { } }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [toast, setToast] = useState({ show: false, title: "", desc: "" });

  const userId = 1;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await apiGetProducts();
    setProducts(data);
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