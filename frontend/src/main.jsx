import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useUserContext';
import { ProtectedRoute } from './providers/ProtectedRoute.jsx'
import { LoadingScreen } from './utils/LoadScreen.jsx';

import Login from './pages/Login.jsx';
import Store from './pages/Store.jsx';
import Orders from './pages/Orders.jsx';
import Order from './pages/Order.jsx';
import Basket from './pages/Basket.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/Not-found.jsx';
import Logout from './pages/Logout.jsx';
import Good from './pages/Good.jsx';
import Profile from './pages/Profile.jsx';
import Denied from './pages/Denied.jsx';

import './index.css';

function App() {
    const restoreAuth = useStore((state) => state.restoreAuth);
    const isInitialized = useStore((state) => state.isInitialized);

    useEffect(() => {
        restoreAuth();
    }, [restoreAuth]);

    if (!isInitialized) {
        return <LoadingScreen />;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/denied" element={<Denied />} />
                
                <Route path="/store" element={<Store />} />
                <Route path="/good/:id" element={<Good />} />

                <Route path="/profile" element={
                    <ProtectedRoute><Profile /></ProtectedRoute>
                } />
                <Route path="/basket" element={
                    <ProtectedRoute><Basket /></ProtectedRoute>
                } />
                <Route path="/orders" element={
                    <ProtectedRoute><Orders /></ProtectedRoute>
                } />
                <Route path="/order/:id" element={
                    <ProtectedRoute><Order /></ProtectedRoute>
                } />
                
                <Route path="/logout" element={<Logout />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('root')).render(<App />);