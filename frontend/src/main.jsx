import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

import './index.css';

const LoadingScreen = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#121212',
        color: '#fff',
        fontFamily: 'Montserrat, sans-serif'
    }}>
        <div>
            <h2>Загрузка системы...</h2>
            <p>Проверка данных пользователя</p>
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
                <Route path="/store" element={<Store />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order/:id" element={<Order />} />
                <Route path="/basket" element={<Basket />} />
                <Route path="/register" element={<Register />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/good/:id" element={<Good />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('root')).render(<App />);