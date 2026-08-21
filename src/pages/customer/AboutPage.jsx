import React from "react";
import { FiCheckCircle, FiShield, FiTruck } from "react-icons/fi";

const AboutPage = () => {
  return (
    <div className="container py-4">
      <div className="bg-success bg-gradient text-white p-5 rounded-4 shadow-sm text-center mb-4">
        <h1 className="display-5 fw-extrabold mb-3">FerSe1990 Supermarket</h1>
        <p className="lead opacity-90 mx-auto" style={{ maxWidth: 720 }}>
          Hệ thống siêu thị thực phẩm tươi sạch hàng đầu. Cam kết cung cấp nông sản hữu cơ, trái cây nhập khẩu và đồ uống an toàn vệ sinh cho mọi gia đình Việt.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center hover-lift">
            <div
              className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 64, height: 64 }}
            >
              <FiCheckCircle size={30} />
            </div>
            <h5 className="fw-bold text-dark mb-2">100% Hữu Cơ Tươi Sạch</h5>
            <p className="text-muted small m-0">
              Nông sản được thu hoạch trực tiếp từ các trang trại VietGAP uy tín, đảm bảo an toàn tuyệt đối.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center hover-lift">
            <div
              className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 64, height: 64 }}
            >
              <FiTruck size={30} />
            </div>
            <h5 className="fw-bold text-dark mb-2">Giao Hàng Nhanh 2 Giờ</h5>
            <p className="text-muted small m-0">
              Đội ngũ giao hàng chuyên nghiệp, bảo quản lạnh đúng tiêu chuẩn giúp thực phẩm luôn giữ độ tươi ngon.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center hover-lift">
            <div
              className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 64, height: 64 }}
            >
              <FiShield size={30} />
            </div>
            <h5 className="fw-bold text-dark mb-2">Đổi Trả Miễn Phí 24h</h5>
            <p className="text-muted small m-0">
              Hoàn tiền 100% hoặc đổi mới ngay nếu sản phẩm không đạt chất lượng cam kết.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
