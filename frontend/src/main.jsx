// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.jsx'
import Store from './pages/Store.jsx'
import Orders from './pages/Orders.jsx'
import Basket from './pages/Basket.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/Not-found.jsx'
import Logout from './pages/Logout.jsx'
import Good from './pages/Good.jsx'
import Profile from './pages/Profile.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/store" element={<Store />} /> 
        <Route path="/orders" element={<Orders />} /> 
        <Route path="/basket" element={<Basket />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/logout" element={<Logout />} /> 
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/good/:id" element={<Good />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
)