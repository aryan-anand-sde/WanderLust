import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  return (
    <div className="app-container">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />

      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default Layout;
