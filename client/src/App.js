import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ToolBar from "./components/ToolBar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import ImagePage from "./pages/ImagePage";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <ToastContainer />
      <ToolBar />
      <Routes>
        <Route path="/images/:imageId" element={<ImagePage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
};

export default App;
