import React, { useState } from "react";
import { FiMail, FiLock, FiUserCheck, FiShield } from "react-icons/fi";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("user@gmail.com");
  const [password, setPassword] = useState("123456");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = email.includes("admin") ? "admin" : "customer";
    const name = email.includes("admin") ? "Quản trị viên" : "Nguyễn Văn A";
    onLoginSuccess({ email, name, role });
    onClose();
  };

  const handleQuickSelect = (userType) => {
    if (userType === "customer") {
      setEmail("user@gmail.com");
      setPassword("123456");
    } else {
      setEmail("admin@gmail.com");
      setPassword("admin123");
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content rounded-4 border-0 shadow-lg p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 40, height: 40 }}
              >
                <FiUserCheck size={22} />
              </div>
              <h5 className="modal-title fw-extrabold text-dark m-0">Đăng Nhập Tài Khoản</h5>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <p className="text-muted small mb-4">
            Truy cập hệ thống siêu thị thực phẩm tươi sạch FerSe1990
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold small text-secondary">Email đăng nhập</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <FiMail className="text-muted" />
                </span>
                <input
                  type="email"
                  className="form-control bg-light border-start-0 ps-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn..."
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold small text-secondary">Mật khẩu</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <FiLock className="text-muted" />
                </span>
                <input
                  type="password"
                  className="form-control bg-light border-start-0 ps-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100 fw-bold py-2.5 rounded-3 mb-4 shadow-sm">
              Đăng Nhập Ngay
            </button>
          </form>

          <div className="bg-light p-3 rounded-3 text-center border">
            <small className="text-muted fw-bold d-block mb-2">Tài khoản dùng thử nhanh:</small>
            <div className="d-flex gap-2 justify-content-center">
              <button
                type="button"
                className="btn btn-sm btn-white border fw-semibold cursor-pointer shadow-sm"
                onClick={() => handleQuickSelect("customer")}
              >
                👤 Khách hàng
              </button>
              <button
                type="button"
                className="btn btn-sm btn-white border fw-semibold text-success cursor-pointer shadow-sm"
                onClick={() => handleQuickSelect("admin")}
              >
                <FiShield className="me-1" /> Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

