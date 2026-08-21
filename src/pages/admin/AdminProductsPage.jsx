import React, { useState, useEffect, useRef } from "react";
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
  InputGroup,
  Spinner
} from "react-bootstrap";
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
    <Container className="pb-5">
      {/* Notification Alert */}
      {alert.show && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false })} className="d-flex align-items-center gap-2 shadow-sm rounded-3">
          {alert.type === "success" ? <FiCheckCircle size={20} /> : <FiXCircle size={20} />}
          <div className="fw-bold">{alert.msg}</div>
        </Alert>
      )}

      {/* Header Title & Create Button */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-extrabold text-dark d-flex align-items-center gap-2 m-0">
            <FiBox className="text-success" /> Quản Lý Danh Sách Sản Phẩm
          </h3>
          <p className="text-muted small m-0 mt-1">
            Thao tác CRUD trực tiếp: Thêm mới (POST), Cập nhật (PUT), Xóa (DELETE)
          </p>
        </div>

        <Button
          variant="success"
          className="fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
          onClick={handleOpenCreate}
        >
          <FiPlus size={18} /> Thêm Sản Phẩm Mới
        </Button>
      </div>

      {/* Main Content Card */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        {/* Toolbar Controls */}
        <Card.Body className="bg-light border-bottom p-3 d-flex flex-wrap align-items-center gap-3">
          <InputGroup style={{ maxWidth: 340 }}>
            <InputGroup.Text className="bg-white border-end-0">
              <FiSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="border-start-0 ps-0 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Form.Select
            className="w-auto fw-semibold border-1 rounded-3"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">🌟 Tất cả danh mục</option>
            <option value="1">🍎 Hoa quả tươi</option>
            <option value="2">🥤 Thức uống</option>
            <option value="3">🥖 Đồ ăn & Thực phẩm</option>
          </Form.Select>

          <Button variant="outline-secondary" className="d-flex align-items-center gap-1 bg-white fw-semibold rounded-3" onClick={loadProducts}>
            <FiRefreshCw /> Tải lại
          </Button>

          <div className="d-flex align-items-center gap-1 bg-white rounded-pill p-1 border ms-auto">
            <Button
              size="sm"
              variant={viewMode === "table" ? "success" : "light"}
              className="rounded-pill px-3 fw-bold"
              onClick={() => setViewMode("table")}
            >
              <FiList /> Dạng Bảng
            </Button>
            <Button
              size="sm"
              variant={viewMode === "grid" ? "success" : "light"}
              className="rounded-pill px-3 fw-bold"
              onClick={() => setViewMode("grid")}
            >
              <FiGrid /> Dạng Thẻ
            </Button>
          </div>
        </Card.Body>

        {/* View Content */}
        {loading ? (
          <div className="text-center py-5 text-muted">
            <Spinner animation="border" variant="success" className="mb-2" />
            <h5>Đang tải danh sách sản phẩm...</h5>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="fw-bold text-dark">Không có sản phẩm nào phù hợp</h5>
            <p className="text-muted small">Thử thay đổi từ khóa tìm kiếm hoặc bấm Thêm sản phẩm mới.</p>
          </div>
        ) : viewMode === "table" ? (
          <Table responsive hover align="middle" className="mb-0">
            <thead className="table-light">
              <tr className="small text-secondary">
                <th className="ps-4">ID</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th className="text-center">Thao tác</th>
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
                      style={{ width: 46, height: 46 }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=60";
                      }}
                    />
                  </td>
                  <td>
                    <div className="fw-bold text-dark">{item.name}</div>
                    <div className="text-muted small text-truncate" style={{ maxWidth: 240 }}>
                      {item.description || "Không có mô tả"}
                    </div>
                  </td>
                  <td>
                    <Badge bg="success" className="bg-opacity-10 text-success px-3 py-2 rounded-pill">
                      {getCategoryName(item.categoryId)}
                    </Badge>
                  </td>
                  <td className="fw-bold text-success">{item.price.toLocaleString("vi-VN")} đ</td>
                  <td>
                    {item.stock < 15 ? (
                      <Badge bg="danger" className="bg-opacity-10 text-danger px-2.5 py-1.5 rounded-pill">
                        ⚠️ Sắp hết ({item.stock || 0})
                      </Badge>
                    ) : (
                      <span className="fw-semibold text-secondary">{item.stock || 100} món</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button variant="outline-success" size="sm" className="fw-semibold rounded-3 d-flex align-items-center gap-1" onClick={() => handleOpenEdit(item)}>
                        <FiEdit2 /> Sửa
                      </Button>
                      <Button variant="outline-danger" size="sm" className="fw-semibold rounded-3 d-flex align-items-center gap-1" onClick={() => { setDeleteItem(item); setShowDeleteModal(true); }}>
                        <FiTrash2 /> Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="p-4 bg-light">
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {filteredProducts.map((product) => (
                <Col key={product.id}>
                  <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                    <div className="position-relative bg-light text-center p-3">
                      <Badge bg="success" className="bg-opacity-10 text-success fw-bold position-absolute top-0 start-0 m-3 px-2.5 py-1.5 rounded-pill">
                        {getCategoryName(product.categoryId)}
                      </Badge>
                      <Card.Img
                        variant="top"
                        src={product.image}
                        className="rounded-3 object-fit-cover"
                        style={{ height: 140, objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60";
                        }}
                      />
                    </div>
                    <Card.Body className="p-3 d-flex flex-column">
                      <h6 className="fw-bold text-dark mb-1 text-truncate">{product.name}</h6>
                      <span className="fs-5 fw-extrabold text-success mb-2">{product.price.toLocaleString("vi-VN")} đ</span>

                      <div className="d-flex align-items-center justify-content-between mb-3 small">
                        <span className="text-muted">Tồn kho:</span>
                        {product.stock < 15 ? (
                          <Badge bg="danger" className="rounded-pill">Sắp hết ({product.stock})</Badge>
                        ) : (
                          <strong className="text-dark">{product.stock || 100} món</strong>
                        )}
                      </div>

                      <div className="d-flex gap-2 mt-auto">
                        <Button variant="outline-success" size="sm" className="flex-grow-1 fw-bold rounded-3 py-2 d-flex align-items-center justify-content-center gap-1" onClick={() => handleOpenEdit(product)}>
                          <FiEdit2 size={14} /> Sửa
                        </Button>
                        <Button variant="outline-danger" size="sm" className="flex-grow-1 fw-bold rounded-3 py-2 d-flex align-items-center justify-content-center gap-1" onClick={() => { setDeleteItem(product); setShowDeleteModal(true); }}>
                          <FiTrash2 size={14} /> Xóa
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Card>

      {/* CREATE / EDIT REACT-BOOTSTRAP MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-extrabold text-dark fs-5">
            {isEditing ? "✏️ Chỉnh Sửa Sản Phẩm (PUT)" : "➕ Thêm Sản Phẩm Mới (POST)"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitForm}>
          <Modal.Body className="py-3">
            <Form.Group className="mb-3" controlId="prodName">
              <Form.Label className="fw-bold text-secondary small">Tên sản phẩm *</Form.Label>
              <Form.Control
                type="text"
                ref={nameInputRef}
                placeholder="Nhập tên sản phẩm..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Row className="g-3 mb-3">
              <Col col={6}>
                <Form.Group controlId="prodPrice">
                  <Form.Label className="fw-bold text-secondary small">Giá bán (VND) *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ví dụ: 50000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col col={6}>
                <Form.Group controlId="prodStock">
                  <Form.Label className="fw-bold text-secondary small">Số lượng tồn kho</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="prodCat">
              <Form.Label className="fw-bold text-secondary small">Danh mục sản phẩm *</Form.Label>
              <Form.Select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="1">🍎 Hoa quả tươi</option>
                <option value="2">🥤 Thức uống</option>
                <option value="3">🥖 Đồ ăn & Thực phẩm</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="prodImg">
              <Form.Label className="fw-bold text-secondary small">Link hình ảnh (URL)</Form.Label>
              <Form.Control
                type="text"
                placeholder="/images/apple.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="prodDesc">
              <Form.Label className="fw-bold text-secondary small">Mô tả ngắn</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Mô tả chất lượng..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-top-0 pt-0">
            <Button variant="light" className="fw-bold px-4" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button variant="success" type="submit" className="fw-bold px-4 shadow-sm">
              {isEditing ? "Lưu Cập Nhật" : "Thêm Ngay"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* DELETE CONFIRMATION REACT-BOOTSTRAP MODAL */}
      <Modal show={showDeleteModal && !!deleteItem} onHide={() => setShowDeleteModal(false)} centered size="sm">
        <Modal.Body className="text-center p-4">
          <FiTrash2 size={44} className="text-danger mb-3" />
          <h5 className="fw-bold text-dark mb-2">Xác Nhận Xóa</h5>
          <p className="text-muted small mb-4">
            Bạn có chắc chắn muốn xóa sản phẩm <strong>"{deleteItem?.name}"</strong> không?
          </p>
          <div className="d-flex gap-2">
            <Button variant="light" className="flex-grow-1 fw-bold" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button variant="danger" className="flex-grow-1 fw-bold" onClick={handleConfirmDelete}>
              Xóa Ngay
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminProductsPage;
