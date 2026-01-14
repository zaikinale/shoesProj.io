// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './Login.jsx'
import Store from './Store.jsx'
import Orders from './Orders.jsx'
import Basket from './Basket.jsx'
import Register from './Register.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/store" element={<Store />} /> 
        <Route path="/orders" element={<Orders />} /> 
        <Route path="/basket" element={<Basket />} /> 
        <Route path="/register" element={<Register />} /> 
      </Routes>
    </BrowserRouter>
)
