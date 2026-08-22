import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  InputGroup,
  Modal
} from "react-bootstrap";
import {
  FiSearch,
  FiShoppingBag,
  FiCheck,
  FiTag,
  FiArrowRight
} from "react-icons/fi";
import { apiGetProducts, apiGetCart, apiUpdateCart } from "../../services/api";

const HomePage = ({ onCartChange = () => {} }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States quản lý Modal xác nhận & Thông báo giữa màn hình
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [centerNotification, setCenterNotification] = useState({ show: false, msg: "" });

  // 1. Dùng useSearchParams lấy query search từ URL (?name=... hoặc ?category=...)
  const [searchParams, setSearchParams] = useSearchParams();
  const searchName = searchParams.get("name") || searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "all";

  const navigate = useNavigate();
  const userId = 1;

  // 2. Fetch dữ liệu API bằng Axios
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await apiGetProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Lỗi khi fetch sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mở Modal xác nhận "Bạn có muốn thêm sản phẩm này vào giỏ hàng không?"
  const handleOpenConfirmModal = (product) => {
    setSelectedProduct(product);
    setShowConfirmModal(true);
  };

  // Xử lý khi nhấn nút OK trong Modal xác nhận
  const handleConfirmAddToCart = async () => {
    if (!selectedProduct) return;
    const product = selectedProduct;
    setShowConfirmModal(false);

    try {
      const carts = await apiGetCart(userId);
      let cart = carts[0] || { id: "1", userId, items: [] };

      const existingIndex = cart.items.findIndex(
        (item) => String(item.productId) === String(product.id)
      );

      let updatedItems = [...cart.items];
      if (existingIndex > -1) {
        updatedItems[existingIndex].quantity += 1;
      } else {
        updatedItems.push({ productId: String(product.id), quantity: 1 });
      }

      await apiUpdateCart(cart.id, { ...cart, items: updatedItems });
      if (onCartChange) onCartChange();

      // Hiển thị thông báo ở giữa màn hình (Center Modal Notification)
      setCenterNotification({
        show: true,
        msg: `Đã thêm "${product.name}" vào giỏ hàng thành công!`
      });
    } catch (err) {
      console.error("Lỗi cập nhật giỏ hàng:", err);
    } finally {
      setSelectedProduct(null);
    }
  };

  // Xử lý tìm kiếm realtime
  const handleSearchChange = (e) => {
    const val = e.target.value;
    const currentParams = Object.fromEntries(searchParams.entries());
    if (val.trim()) {
      setSearchParams({ ...currentParams, name: val });
    } else {
      delete currentParams.name;
      delete currentParams.search;
      setSearchParams(currentParams);
    }
  };

  // Xử lý lọc theo Danh Mục
  const handleCategorySelect = (catId) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    if (catId === "all") {
      delete currentParams.category;
      setSearchParams(currentParams);
    } else {
      setSearchParams({ ...currentParams, category: catId });
    }
  };

  // Helper tên danh mục
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

  // Lọc sản phẩm theo chuỗi tìm kiếm name và category
  const filteredProducts = products.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || String(p.categoryId) === String(categoryFilter);
    return matchesName && matchesCategory;
  });

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO BANNER                                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white border-bottom shadow-sm mb-4 py-5 position-relative overflow-hidden">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <Badge bg="danger" className="px-3 py-2 rounded-pill fs-7 fw-bold mb-3">
                🔥 Khuyến Mãi Siêu Thị Hôm Nay - Giảm 15%
              </Badge>
              <h1 className="display-5 fw-extrabold text-dark mb-3">
                Thực Phẩm Tươi Sạch & Đồ Uống Chất Lượng Cao
              </h1>
              <p className="lead text-secondary mb-4 fs-6">
                Đặt hàng trực tuyến dễ dàng - Giao tận nhà nhanh chóng trong 2 giờ.
                Cam kết nông sản tươi ngon mỗi ngày cho gia đình bạn.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button
                  variant="danger"
                  size="lg"
                  className="fw-bold px-4 py-2.5 rounded-pill shadow-sm d-flex align-items-center gap-2"
                  onClick={() => {
                    const el = document.getElementById("product-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <FiShoppingBag /> Mua Sắm Ngay <FiArrowRight />
                </Button>
                <Button
                  variant="outline-secondary"
                  size="lg"
                  className="fw-semibold px-4 py-2.5 rounded-pill"
                  onClick={() => navigate("/about")}
                >
                  Về Chúng Tôi
                </Button>
              </div>
            </Col>

            <Col lg={5} className="text-center d-none d-lg-block">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&auto=format&fit=crop&q=80"
                alt="Supermarket Banner"
                className="img-fluid rounded-4 shadow-lg object-fit-cover"
                style={{ maxHeight: 320, width: "100%" }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. THANH FILTER TÌM KIẾM THEO TÊN                                 */}
      {/* ------------------------------------------------------------------ */}
      <Container id="product-section" className="mb-4">
        <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
          <Row className="g-3 align-items-center">
            <Col md={6} lg={6}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <FiSearch className="text-muted" size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Lọc & tìm kiếm sản phẩm theo tên..."
                  className="bg-light border-start-0 ps-0 shadow-none"
                  value={searchName}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </Col>

            <Col md={6} lg={6} className="d-flex gap-2 flex-wrap justify-content-md-end">
              <Button
                size="sm"
                variant={categoryFilter === "all" ? "danger" : "light"}
                className="rounded-pill px-3 fw-bold"
                onClick={() => handleCategorySelect("all")}
              >
                🌟 Tất cả
              </Button>
              <Button
                size="sm"
                variant={categoryFilter === "1" ? "danger" : "light"}
                className="rounded-pill px-3 fw-bold"
                onClick={() => handleCategorySelect("1")}
              >
                🍎 Hoa quả
              </Button>
              <Button
                size="sm"
                variant={categoryFilter === "2" ? "danger" : "light"}
                className="rounded-pill px-3 fw-bold"
                onClick={() => handleCategorySelect("2")}
              >
                🥤 Thức uống
              </Button>
              <Button
                size="sm"
                variant={categoryFilter === "3" ? "danger" : "light"}
                className="rounded-pill px-3 fw-bold"
                onClick={() => handleCategorySelect("3")}
              >
                🥖 Đồ ăn
              </Button>
            </Col>
          </Row>
        </Card>
      </Container>

      {/* ------------------------------------------------------------------ */}
      {/* 3. DANH SÁCH SẢN PHẨM                                             */}
      {/* ------------------------------------------------------------------ */}
      <Container>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="fw-extrabold text-dark m-0 d-flex align-items-center gap-2">
            <FiTag className="text-danger" /> Danh Sách Sản Phẩm ({filteredProducts.length})
          </h4>
          {searchName && (
            <span className="text-muted small">
              Kết quả tìm kiếm cho: <strong>"{searchName}"</strong>
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-danger mb-2" role="status"></div>
            <h5>Đang tải sản phẩm từ API...</h5>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="border-0 shadow-sm rounded-4 text-center py-5 bg-white">
            <Card.Body>
              <FiShoppingBag size={48} className="text-muted mb-3" />
              <h5 className="fw-bold text-dark">Không tìm thấy sản phẩm phù hợp</h5>
              <p className="text-muted small mb-0">Thử thay đổi từ khóa tìm kiếm trong thanh Lọc ở trên.</p>
            </Card.Body>
          </Card>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {filteredProducts.map((product) => {
              const originalPrice = Math.round(product.price * 1.15);
              return (
                <Col key={product.id}>
                  <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white hover-lift">
                    <div className="position-relative bg-light text-center p-3">
                      <Badge bg="danger" className="position-absolute top-0 start-0 m-3 px-2 py-1.5 rounded-pill">
                        SALE -15%
                      </Badge>
                      <Badge bg="light" text="dark" className="border fw-bold position-absolute top-0 end-0 m-3 px-2 py-1.5 rounded-pill">
                        {getCategoryName(product.categoryId)}
                      </Badge>

                      <Card.Img
                        variant="top"
                        src={product.image}
                        alt={product.name}
                        className="rounded-3 object-fit-cover"
                        style={{ height: 160, objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60";
                        }}
                      />
                    </div>

                    <Card.Body className="p-3 d-flex flex-column">
                      <Card.Title className="fs-6 fw-bold text-dark mb-1 text-truncate">
                        {product.name}
                      </Card.Title>
                      
                      <Card.Text className="text-muted small mb-3 flex-grow-1 text-truncate" style={{ maxHeight: 38 }}>
                        {product.description || "Thực phẩm tươi sạch an toàn chuẩn VietGAP."}
                      </Card.Text>

                      <div className="d-flex align-items-baseline gap-2 mb-3">
                        <span className="fs-5 fw-extrabold text-danger">
                          {product.price.toLocaleString("vi-VN")} đ
                        </span>
                        <span className="text-decoration-line-through text-muted small">
                          {originalPrice.toLocaleString("vi-VN")} đ
                        </span>
                      </div>

                      {/* Nút Thêm vào giỏ -> Mở Modal hỏi xác nhận */}
                      <Button
                        variant="danger"
                        className="w-100 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                        onClick={() => handleOpenConfirmModal(product)}
                      >
                        <FiShoppingBag /> Thêm vào giỏ
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>

      {/* ------------------------------------------------------------------ */}
      {/* 4. MODAL XÁC NHẬN: BẠN CÓ MUỐN THÊM SẢN PHẨM NÀY VÀO GIỎ KHÔNG?     */}
      {/* ------------------------------------------------------------------ */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered size="sm">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-6 fw-bold text-dark">
            Xác nhận thêm vào giỏ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex p-3 mb-3">
            <FiShoppingBag size={32} />
          </div>
          <h6 className="fw-bold text-dark mb-2">
            Bạn có muốn thêm sản phẩm này vào giỏ hàng không?
          </h6>
          {selectedProduct && (
            <p className="text-danger small mb-0 fw-bold">
              "{selectedProduct.name}" - {selectedProduct.price.toLocaleString("vi-VN")} đ
            </p>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 justify-content-center gap-2">
          <Button variant="light" className="fw-bold px-3 rounded-pill border" onClick={() => setShowConfirmModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" className="fw-bold px-4 rounded-pill shadow-sm" onClick={handleConfirmAddToCart}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ------------------------------------------------------------------ */}
      {/* 5. MODAL THÔNG BÁO Ở GIỮA MÀN HÌNH KHI THÊM THÀNH CÔNG             */}
      {/* ------------------------------------------------------------------ */}
      <Modal show={centerNotification.show} onHide={() => setCenterNotification({ show: false, msg: "" })} centered size="sm">
        <Modal.Body className="text-center p-4">
          <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex p-3 mb-3">
            <FiCheck size={36} />
          </div>
          <h5 className="fw-bold text-dark mb-2">Thành Công!</h5>
          <p className="text-muted small mb-4">{centerNotification.msg}</p>
          <Button
            variant="success"
            className="fw-bold px-4 rounded-pill w-100 shadow-sm"
            onClick={() => setCenterNotification({ show: false, msg: "" })}
          >
            Đồng ý
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HomePage;
