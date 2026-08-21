import React, { useState, useEffect } from "react";
import {
  FiPieChart,
  FiBox,
  FiFileText,
  FiDollarSign,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiDownload,
  FiLayers,
  FiTag
} from "react-icons/fi";
import { apiGetProducts, apiGetAllOrders } from "../../services/api";

const AdminReportsPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

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

  // Calculations
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Low Stock Items (< 15 items)
  const lowStockProducts = products.filter((p) => Number(p.stock) < 15);

  // Breakdown by Category
  const fruitProducts = products.filter((p) => Number(p.categoryId) === 1);
  const drinkProducts = products.filter((p) => Number(p.categoryId) === 2);
  const foodProducts = products.filter((p) => Number(p.categoryId) === 3);

  const handleExportReport = () => {
    const reportText = `BÁO CÁO THỐNG KÊ SIÊU THỊ SUPERMARKET 1990s
-------------------------------------------
Ngày xuất báo cáo: ${new Date().toLocaleDateString("vi-VN")}
Tổng số sản phẩm: ${totalProducts} món
Tổng tồn kho: ${totalStock} món
Tổng đơn hàng đã đặt: ${totalOrders} đơn
Tổng doanh thu dự kiến: ${totalRevenue.toLocaleString("vi-VN")} VNĐ
Giá trị trung bình/đơn: ${avgOrderValue.toLocaleString("vi-VN")} VNĐ

DANH SÁCH SẢN PHẨM SẮP HẾT HÀNG (<15 MÓN):
${lowStockProducts.map((p) => `- ${p.name} (Tồn kho: ${p.stock})`).join("\n")}
`;

    const element = document.createElement("a");
    const file = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `Bao_Cao_SuperMarket_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container pb-5">
      {/* Header Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-extrabold text-dark d-flex align-items-center gap-2 m-0">
            <FiPieChart className="text-success" /> Báo Cáo & Thống Kê Kinh Doanh
          </h3>
          <p className="text-muted small m-0 mt-1">
            Tổng quan doanh số, thống kê sản phẩm, cảnh báo tồn kho và xuất dữ liệu báo cáo
          </p>
        </div>

        <button
          className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
          onClick={handleExportReport}
        >
          <FiDownload size={18} /> Xuất Báo Cáo File Text
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border text-success mb-2" role="status"></div>
          <h5>Đang tính toán số liệu thống kê...</h5>
        </div>
      ) : (
        <>
          {/* KPI Summary Cards */}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4">
            <div className="col">
              <div className="bg-white p-4 rounded-4 shadow-sm border-start border-4 border-success">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted fw-bold small uppercase">Tổng Sản Phẩm</span>
                  <div className="bg-success bg-opacity-10 text-success rounded-circle p-2.5">
                    <FiBox size={22} />
                  </div>
                </div>
                <h3 className="fw-extrabold text-dark m-0">{totalProducts} món</h3>
                <small className="text-success fw-semibold">Đã phân loại danh mục</small>
              </div>
            </div>

            <div className="col">
              <div className="bg-white p-4 rounded-4 shadow-sm border-start border-4 border-info">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted fw-bold small uppercase">Tổng Tồn Kho</span>
                  <div className="bg-info bg-opacity-10 text-info rounded-circle p-2.5">
                    <FiLayers size={22} />
                  </div>
                </div>
                <h3 className="fw-extrabold text-dark m-0">{totalStock} món</h3>
                <small className="text-info fw-semibold">Có sẵn trong kho hàng</small>
              </div>
            </div>

            <div className="col">
              <div className="bg-white p-4 rounded-4 shadow-sm border-start border-4 border-warning">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted fw-bold small uppercase">Đơn Hàng Khách Đặt</span>
                  <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-2.5">
                    <FiFileText size={22} />
                  </div>
                </div>
                <h3 className="fw-extrabold text-dark m-0">{totalOrders} đơn</h3>
                <small className="text-warning fw-semibold">TB {avgOrderValue.toLocaleString("vi-VN")} đ/đơn</small>
              </div>
            </div>

            <div className="col">
              <div className="bg-white p-4 rounded-4 shadow-sm border-start border-4 border-primary">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted fw-bold small uppercase">Tổng Doanh Thu</span>
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2.5">
                    <FiDollarSign size={22} />
                  </div>
                </div>
                <h3 className="fw-extrabold text-success m-0">{totalRevenue.toLocaleString("vi-VN")} đ</h3>
                <small className="text-primary fw-semibold">Cập nhật theo thời gian thực</small>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Left Column: Category Breakdown */}
            <div className="col-lg-6">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100">
                <h5 className="fw-bold text-dark d-flex align-items-center gap-2 mb-4">
                  <FiTag className="text-success" /> Thống Kê Sản Phẩm Theo Danh Mục
                </h5>

                <div className="d-flex flex-column gap-4">
                  <div>
                    <div className="d-flex justify-content-between fw-bold mb-1">
                      <span className="text-dark">🍎 Hoa Quả Tươi</span>
                      <span className="text-success">{fruitProducts.length} sản phẩm ({Math.round((fruitProducts.length / (totalProducts || 1)) * 100)}%)</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: 10 }}>
                      <div
                        className="progress-bar bg-success rounded-pill"
                        style={{ width: `${Math.round((fruitProducts.length / (totalProducts || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between fw-bold mb-1">
                      <span className="text-dark">🥤 Thức Uống</span>
                      <span className="text-info">{drinkProducts.length} sản phẩm ({Math.round((drinkProducts.length / (totalProducts || 1)) * 100)}%)</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: 10 }}>
                      <div
                        className="progress-bar bg-info rounded-pill"
                        style={{ width: `${Math.round((drinkProducts.length / (totalProducts || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between fw-bold mb-1">
                      <span className="text-dark">🥖 Đồ Ăn & Thực Phẩm</span>
                      <span className="text-warning">{foodProducts.length} sản phẩm ({Math.round((foodProducts.length / (totalProducts || 1)) * 100)}%)</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: 10 }}>
                      <div
                        className="progress-bar bg-warning rounded-pill"
                        style={{ width: `${Math.round((foodProducts.length / (totalProducts || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Low Stock Alert List */}
            <div className="col-lg-6">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100">
                <h5 className="fw-bold text-dark d-flex align-items-center gap-2 mb-4">
                  <FiAlertTriangle className="text-danger" /> Cảnh Báo Sản Phẩm Sắp Hết Hàng (&lt;15 món)
                </h5>

                {lowStockProducts.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <FiCheckCircle size={36} className="text-success mb-2" />
                    <p className="fw-semibold text-success mb-0">Tất cả sản phẩm đều có số lượng tồn kho an toàn!</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2" style={{ maxHeight: 260, overflowY: "auto" }}>
                    {lowStockProducts.map((p) => (
                      <div className="d-flex align-items-center justify-content-between p-2.5 bg-light rounded-3 border" key={p.id}>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="rounded-2 object-fit-cover"
                            style={{ width: 38, height: 38 }}
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=60";
                            }}
                          />
                          <div>
                            <div className="fw-bold small text-dark">{p.name}</div>
                            <div className="text-muted fs-7">{p.price.toLocaleString("vi-VN")} đ</div>
                          </div>
                        </div>
                        <span className="badge bg-danger text-white fw-bold px-3 py-1.5 rounded-pill">
                          Còn {p.stock || 0} món
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReportsPage;
