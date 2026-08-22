import React, { useState, useEffect } from "react";
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
  InputGroup,
  Alert,
  Spinner
} from "react-bootstrap";
import {
  FiUsers,
  FiUserPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiShield,
  FiUser,
  FiRefreshCw
} from "react-icons/fi";
import {
  apiGetUsers,
  apiCreateUser,
  apiUpdateUser,
  apiDeleteUser
} from "../../services/api";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Alert State
  const [alert, setAlert] = useState({ show: false, variant: "success", msg: "" });

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiGetUsers();
      setUsers(data || []);
    } catch (error) {
      showAlert("danger", "Lỗi khi tải danh sách người dùng từ API!");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (variant, msg) => {
    setAlert({ show: true, variant, msg });
    setTimeout(() => setAlert({ show: false, variant: "success", msg: "" }), 3000);
  };

  const handleOpenAddModal = () => {
    setEditUser(null);
    setFormData({ name: "", email: "", password: "", role: "customer" });
    setShowModal(true);
  };

  const handleOpenEditModal = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: user.password || "",
      role: user.role || "customer"
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      showAlert("danger", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      if (editUser) {
        // Cập nhật người dùng
        await apiUpdateUser(editUser.id, { ...editUser, ...formData });
        showAlert("success", `Cập nhật tài khoản "${formData.name}" thành công!`);
      } else {
        // Thêm người dùng mới
        await apiCreateUser({ ...formData, id: String(Date.now()) });
        showAlert("success", `Thêm tài khoản "${formData.name}" thành công!`);
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      showAlert("danger", "Thao tác thất bại! Vui lòng thử lại.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;
    try {
      await apiDeleteUser(deleteUserId);
      showAlert("success", "Đã xóa tài khoản thành công!");
      setDeleteUserId(null);
      fetchUsers();
    } catch (error) {
      showAlert("danger", "Lỗi khi xóa tài khoản!");
    }
  };

  // Lọc danh sách người dùng
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <Container className="py-4">
      {/* ALERT THÔNG BÁO */}
      {alert.show && (
        <Alert variant={alert.variant} className="shadow-sm rounded-3 fw-bold mb-3">
          {alert.msg}
        </Alert>
      )}

      {/* HEADER TÊN TRANG */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-success text-white rounded-circle p-2.5 d-flex align-items-center justify-content-center shadow-sm" style={{ width: 48, height: 48 }}>
            <FiUsers size={24} />
          </div>
          <div>
            <h3 className="fw-extrabold text-dark m-0">Quản Lý Người Dùng</h3>
            <small className="text-muted">Danh sách tài khoản khách hàng và quản trị viên hệ thống</small>
          </div>
        </div>

        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" className="rounded-3 fw-semibold bg-white" onClick={fetchUsers}>
            <FiRefreshCw /> Tải lại
          </Button>
          <Button variant="success" className="fw-bold rounded-3 d-flex align-items-center gap-2 shadow-sm" onClick={handleOpenAddModal}>
            <FiUserPlus /> Thêm Tài Khoản
          </Button>
        </div>
      </div>

      {/* THANH LỌC VÀ TÌM KIẾM */}
      <Card className="border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <Row className="g-3 align-items-center">
          <Col md={7}>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <FiSearch className="text-muted" size={18} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email người dùng..."
                className="bg-light border-start-0 ps-0 shadow-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>

          <Col md={5} className="d-flex gap-2 justify-content-md-end">
            <Button
              size="sm"
              variant={roleFilter === "all" ? "success" : "light"}
              className="rounded-pill px-3 fw-bold"
              onClick={() => setRoleFilter("all")}
            >
              Tất cả ({users.length})
            </Button>
            <Button
              size="sm"
              variant={roleFilter === "customer" ? "success" : "light"}
              className="rounded-pill px-3 fw-bold"
              onClick={() => setRoleFilter("customer")}
            >
              Khách hàng ({users.filter((u) => u.role === "customer").length})
            </Button>
            <Button
              size="sm"
              variant={roleFilter === "admin" ? "success" : "light"}
              className="rounded-pill px-3 fw-bold"
              onClick={() => setRoleFilter("admin")}
            >
              Admin ({users.filter((u) => u.role === "admin").length})
            </Button>
          </Col>
        </Row>
      </Card>

      {/* BẢNG DANH SÁCH NGƯỜI DÙNG */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" className="mb-2" />
            <h6 className="fw-bold text-muted">Đang tải danh sách tài khoản...</h6>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-5">
            <FiUsers size={48} className="text-muted mb-3" />
            <h5 className="fw-bold text-dark">Không tìm thấy người dùng nào</h5>
          </div>
        ) : (
          <Table responsive hover align="middle" className="mb-0">
            <thead className="table-light">
              <tr className="small text-secondary">
                <th className="ps-4">ID</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Mật khẩu</th>
                <th className="text-center">Vai trò (Role)</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isAdmin = user.role === "admin";
                return (
                  <tr key={user.id}>
                    <td className="ps-4 fw-semibold text-secondary">#{user.id}</td>
                    <td className="fw-bold text-dark">
                      <div className="d-flex align-items-center gap-2">
                        <div className={`rounded-circle p-2 d-flex align-items-center justify-content-center ${isAdmin ? "bg-warning bg-opacity-10 text-warning" : "bg-primary bg-opacity-10 text-primary"}`} style={{ width: 34, height: 34 }}>
                          {isAdmin ? <FiShield size={16} /> : <FiUser size={16} />}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="text-secondary">{user.email}</td>
                    <td className="text-muted small">
                      <code>{user.password}</code>
                    </td>
                    <td className="text-center">
                      <Badge bg={isAdmin ? "warning" : "info"} text={isAdmin ? "dark" : "white"} className="px-3 py-1.5 rounded-pill fw-bold">
                        {isAdmin ? "Admin" : "Customer"}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <div className="d-inline-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-3 px-2 py-1 border-0"
                          title="Sửa thông tin"
                          onClick={() => handleOpenEditModal(user)}
                        >
                          <FiEdit size={16} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-3 px-2 py-1 border-0"
                          title="Xóa tài khoản"
                          onClick={() => setDeleteUserId(user.id)}
                        >
                          <FiTrash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>

      {/* MODAL THÊM / SỬA NGƯỜI DÙNG */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-dark fs-5">
            {editUser ? "Sửa Thông Tin Tài Khoản" : "Thêm Tài Khoản Mới"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="py-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small text-secondary">Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ và tên..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small text-secondary">Email đăng nhập</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email..."
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small text-secondary">Mật khẩu</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập mật khẩu..."
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small text-secondary">Vai trò (Role)</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="customer">Khách hàng (customer)</option>
                <option value="admin">Quản trị viên (admin)</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-top-0 pt-0">
            <Button variant="light" className="fw-bold rounded-pill" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button variant="success" type="submit" className="fw-bold rounded-pill px-4">
              {editUser ? "Cập Nhật" : "Thêm Mới"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* MODAL XÁC NHẬN XÓA */}
      <Modal show={!!deleteUserId} onHide={() => setDeleteUserId(null)} centered size="sm">
        <Modal.Body className="text-center p-4">
          <FiTrash2 size={44} className="text-danger mb-3" />
          <h5 className="fw-bold text-dark mb-2">Xác Nhận Xóa</h5>
          <p className="text-muted small mb-4">Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống?</p>
          <div className="d-flex gap-2">
            <Button variant="light" className="flex-grow-1 fw-bold" onClick={() => setDeleteUserId(null)}>
              Hủy
            </Button>
            <Button variant="danger" className="flex-grow-1 fw-bold" onClick={handleDeleteConfirm}>
              Xóa Ngay
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminUsersPage;
