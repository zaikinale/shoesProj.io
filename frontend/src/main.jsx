import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useUserContext';

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

const ProtectedRoute = ({ children }) => {
    const isUserInitializated = useStore((state) => state.user?.isInitialized);

    if (!isUserInitializated) {
        return <Navigate to="/denied" state={{ status: 403, error: 'Доступ запрещен: Требуется авторизация' }} replace />;
    }
    return children;
};

const LoadingScreen = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#fff',
        fontFamily: 'Montserrat, sans-serif'
    }}>
        <div>
            <h2>Загрузка приложения...</h2>
            <p>Пожалуйста, подождите</p>
        </div>
    </div>
);

function App() {
    const restoreAuth = useStore((state) => state.restoreAuth);
    const isInitialized = useStore((state) => state.isInitialized);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        restoreAuth().finally(() => {
            setHasChecked(true);
        });
    }, [restoreAuth]);

    if (!hasChecked || !isInitialized) {
        return <LoadingScreen />;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/store" element={<Store />} />
                <Route path="/good/:id" element={<Good />} />
                <Route path="/denied" element={<Denied />} />
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