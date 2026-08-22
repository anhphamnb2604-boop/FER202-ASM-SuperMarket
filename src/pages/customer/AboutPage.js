import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { FiCheckCircle, FiShield, FiTruck, FiShoppingBag, FiArrowRight } from "react-icons/fi";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-4">
      {/* BANNER GIỚI THIỆU THƯƠNG HIỆU */}
      <div className="bg-danger bg-gradient text-white p-5 rounded-4 shadow-sm text-center mb-5">
        <Badge bg="white" text="danger" className="px-3 py-2 rounded-pill fs-7 fw-bold mb-3">
          🔥 SuperMarket 1990s - Chân Thành & Tận Tâm
        </Badge>
        <h1 className="display-5 fw-extrabold mb-3">Siêu Thị Thực Phẩm Tươi Sạch SuperMarket</h1>
        <p className="lead opacity-90 mx-auto fs-6" style={{ maxWidth: 740 }}>
          Hệ thống siêu thị nông sản hữu cơ, trái cây nhập khẩu và đồ uống an toàn vệ sinh cho mọi gia đình Việt.
          Chúng tôi tự hào mang tới bữa ăn ngon miệng và an lành cho gia đình bạn mỗi ngày.
        </p>
        <Button
          variant="light"
          size="lg"
          className="fw-bold text-danger rounded-pill px-4 shadow-sm mt-2"
          onClick={() => navigate("/home")}
        >
          <FiShoppingBag /> Mua Sắm Ngay <FiArrowRight />
        </Button>
      </div>

      {/* BỘ 3 CAM KẾT VỚI KHÁCH HÀNG (REACT-BOOTSTRAP CARDS) */}
      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm rounded-4 p-4 text-center bg-white hover-lift">
            <div
              className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 64, height: 64 }}
            >
              <FiCheckCircle size={30} />
            </div>
            <Card.Title className="fw-bold text-dark mb-2">100% Hữu Cơ Tươi Sạch</Card.Title>
            <Card.Text className="text-muted small">
              Nông sản được thu hoạch trực tiếp từ các trang trại VietGAP uy tín, đảm bảo an toàn tuyệt đối cho sức khỏe.
            </Card.Text>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm rounded-4 p-4 text-center bg-white hover-lift">
            <div
              className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 64, height: 64 }}
            >
              <FiTruck size={30} />
            </div>
            <Card.Title className="fw-bold text-dark mb-2">Giao Hàng Nhanh 2 Giờ</Card.Title>
            <Card.Text className="text-muted small">
              Đội ngũ giao hàng tận tâm, bảo quản lạnh tiêu chuẩn giúp thực phẩm giữ trọn vẹn hương vị tươi ngon.
            </Card.Text>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm rounded-4 p-4 text-center bg-white hover-lift">
            <div
              className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 64, height: 64 }}
            >
              <FiShield size={30} />
            </div>
            <Card.Title className="fw-bold text-dark mb-2">Đổi Trả Miễn Phí 24h</Card.Title>
            <Card.Text className="text-muted small">
              Cam kết hoàn tiền 100% hoặc 1 đổi 1 ngay lập tức nếu sản phẩm không đạt tiêu chuẩn chất lượng.
            </Card.Text>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
