import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("fer_current_user");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <AdminNavbar onLogout={handleLogout} />
      <main className="min-vh-100 bg-light pb-5">
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
