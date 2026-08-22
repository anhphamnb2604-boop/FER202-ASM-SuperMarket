import axios from "axios";

// Đường dẫn REST API mặc định từ json-server (cổng 9000)
const API_URL = "http://localhost:9000";

/* ==========================================================================
   1. ĐĂNG NHẬP & ĐĂNG KÝ (AUTHENTICATION API)
   ========================================================================== */
// Hàm đăng nhập: Tìm người dùng theo email và đối chiếu mật khẩu
export const loginAPI = async (email, password) => {
  const response = await axios.get(`${API_URL}/users`, {
    params: { email }
  });
  const users = response.data || [];
  return users.filter((u) => String(u.password) === String(password));
};

// Hàm đăng ký tài khoản mới (POST /users)
export const registerAPI = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, {
    ...userData,
    role: userData.role || "customer"
  });
  return response.data;
};

/* ==========================================================================
   2. QUẢN LÝ NGƯỜI DÙNG (USERS API - DÙNG CHO ADMIN)
   ========================================================================== */
// Lấy danh sách tất cả người dùng (GET /users)
export const apiGetUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

// Thêm người dùng mới (POST /users)
export const apiCreateUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

// Cập nhật thông tin người dùng theo ID (PUT /users/:id)
export const apiUpdateUser = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/users/${id}`, updatedData);
  return response.data;
};

// Xóa người dùng theo ID (DELETE /users/:id)
export const apiDeleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/users/${id}`);
  return response.data;
};

/* ==========================================================================
   3. QUẢN LÝ SẢN PHẨM & DANH MỤC (PRODUCTS & CATEGORIES API)
   ========================================================================== */
// Lấy danh sách tất cả sản phẩm (GET /products)
export const apiGetProducts = async (params = {}) => {
  const response = await axios.get(`${API_URL}/products`, { params });
  return response.data;
};

// Thêm sản phẩm mới (POST /products) - Dùng trong trang Quản lý Admin
export const apiCreateProduct = async (productData) => {
  const response = await axios.post(`${API_URL}/products`, productData);
  return response.data;
};

// Cập nhật thông tin sản phẩm theo ID (PUT /products/:id) - Dùng trong trang Admin
export const apiUpdateProduct = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/products/${id}`, updatedData);
  return response.data;
};

// Xóa sản phẩm theo ID (DELETE /products/:id) - Dùng trong trang Admin
export const apiDeleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/products/${id}`);
  return response.data;
};

// Lấy danh sách các danh mục sản phẩm (GET /categories)
export const apiGetCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};

/* ==========================================================================
   4. QUẢN LÝ GIỎ HÀNG (CARTS API)
   ========================================================================== */
// Lấy giỏ hàng theo mã người dùng userId (GET /carts?userId=1)
export const apiGetCart = async (userId = 1) => {
  const response = await axios.get(`${API_URL}/carts`, {
    params: { userId }
  });
  return response.data;
};

// Cập nhật danh sách món trong giỏ hàng theo cartId (PUT /carts/:cartId)
export const apiUpdateCart = async (cartId, cartData) => {
  const response = await axios.put(`${API_URL}/carts/${cartId}`, cartData);
  return response.data;
};

/* ==========================================================================
   5. QUẢN LÝ ĐƠN HÀNG (ORDERS API)
   ========================================================================== */
// Lấy toàn bộ đơn hàng (GET /orders) - Dùng cho Admin quản lý & Báo cáo
export const apiGetAllOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`);
  return response.data;
};

// Lấy đơn hàng của người dùng cụ thể (GET /orders?userId=1) - Dùng cho Lịch sử đơn hàng
export const apiGetOrders = async (userId = 1) => {
  const response = await axios.get(`${API_URL}/orders`, {
    params: { userId }
  });
  return response.data;
};

// Cập nhật trạng thái đơn hàng theo ID (PUT /orders/:id) - Dùng trong Admin
export const apiUpdateOrder = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/orders/${id}`, updatedData);
  return response.data;
};

// Tạo đơn hàng mới sau khi khách hàng bấm Đặt Hàng (POST /orders)
export const apiCreateOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/orders`, orderData);
  return response.data;
};
