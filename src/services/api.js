import axios from "axios";
import databaseJson from "../database.json";

/**
 * FER Course Requirement: REST API Communication with json-server & ES6 CRUD
 * Target URL: http://localhost:9999
 */
const API_URL = "http://localhost:9999";
const STORAGE_KEY = "ferse1990_db";

// Create Axios Instance with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 1500
});

// LocalStorage Helper for offline fallback
const getLocalDb = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Parse error local DB", e);
    }
  }
  const defaultDb = {
    categories: databaseJson.categories || [],
    products: databaseJson.products || [],
    users: databaseJson.users || [],
    carts: databaseJson.carts || [{ id: "1", userId: 1, items: [{ productId: "2", quantity: 1 }, { productId: "3", quantity: 1 }] }],
    orders: databaseJson.orders || []
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDb));
  return defaultDb;
};

const saveLocalDb = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/* ==========================================================================
   PRODUCTS CRUD OPERATIONS (Create, Read, Update, Delete) - ES6 & json-server
   ========================================================================== */

// 1. READ: Fetch all products
export const apiGetProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.warn("json-server offline, fallback to LocalStorage for GET /products");
    const db = getLocalDb();
    return db.products;
  }
};

// 2. CREATE: Add new product (POST)
export const apiCreateProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData);
    return response.data;
  } catch (error) {
    console.warn("json-server offline, fallback to LocalStorage for POST /products");
    const db = getLocalDb();
    const newProduct = {
      ...productData,
      id: String(Date.now())
    };
    db.products.unshift(newProduct);
    saveLocalDb(db);
    return newProduct;
  }
};

// 3. UPDATE: Edit product details (PUT)
export const apiUpdateProduct = async (id, updatedData) => {
  try {
    const response = await api.put(`/products/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.warn("json-server offline, fallback to LocalStorage for PUT /products/:id");
    const db = getLocalDb();
    const index = db.products.findIndex((p) => String(p.id) === String(id));
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...updatedData };
      saveLocalDb(db);
    }
    return updatedData;
  }
};

// 4. DELETE: Remove product (DELETE)
export const apiDeleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.warn("json-server offline, fallback to LocalStorage for DELETE /products/:id");
    const db = getLocalDb();
    db.products = db.products.filter((p) => String(p.id) !== String(id));
    saveLocalDb(db);
    return { success: true };
  }
};

/* ==========================================================================
   CATEGORIES API
   ========================================================================== */
export const apiGetCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    return getLocalDb().categories;
  }
};

/* ==========================================================================
   CARTS API
   ========================================================================== */
export const apiGetCart = async (userId = 1) => {
  try {
    const response = await api.get(`/carts?userId=${userId}`);
    if (response.data && response.data.length > 0) {
      return response.data;
    }
  } catch (error) {
    // Fallback
  }
  const db = getLocalDb();
  let cart = db.carts.find((c) => Number(c.userId) === Number(userId));
  if (!cart) {
    cart = { id: "1", userId: Number(userId), items: [] };
    db.carts.push(cart);
    saveLocalDb(db);
  }
  return [cart];
};

export const apiUpdateCart = async (cartId, cartData) => {
  try {
    const response = await api.put(`/carts/${cartId}`, cartData);
    return response.data;
  } catch (error) {
    const db = getLocalDb();
    const idx = db.carts.findIndex((c) => String(c.id) === String(cartId));
    if (idx !== -1) {
      db.carts[idx] = cartData;
    } else {
      db.carts.push(cartData);
    }
    saveLocalDb(db);
    return cartData;
  }
};

/* ==========================================================================
   ORDERS API
   ========================================================================== */
export const apiGetOrders = async (userId = 1) => {
  try {
    const response = await api.get(`/orders?userId=${userId}`);
    return response.data;
  } catch (error) {
    const db = getLocalDb();
    return db.orders.filter((o) => Number(o.userId) === Number(userId));
  }
};

export const apiCreateOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData);
    return response.data;
  } catch (error) {
    const db = getLocalDb();
    const newOrder = {
      ...orderData,
      id: String(Date.now()),
      createdAt: new Date().toISOString().split("T")[0]
    };
    db.orders.unshift(newOrder);
    saveLocalDb(db);
    return newOrder;
  }
};

/* ==========================================================================
   LOGIN / USERS API
   ========================================================================== */
export const loginAPI = async (email, password) => {
  try {
    const resUsers = await api.get(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    if (resUsers.data && resUsers.data.length > 0) {
      return resUsers.data;
    }
    const resAcc = await api.get(`/accounts?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    if (resAcc.data && resAcc.data.length > 0) {
      return resAcc.data;
    }
  } catch (error) {
    console.warn("json-server offline, checking LocalStorage / fallback");
  }

  const db = getLocalDb();
  const matchedUser = (db.users || []).find(
    (u) => u.email === email && u.password === password
  );
  if (matchedUser) return [matchedUser];

  const matchedAcc = (db.accounts || []).find(
    (a) => a.email === email && a.password === password
  );
  if (matchedAcc) return [matchedAcc];

  return [];
};

