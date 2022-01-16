import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/auth/register" element={<RegisterPage/>} />
        <Route path="/auth/login" element={<LoginPage/>} />
      </Routes>
    </div>
  );
}

export default App;
