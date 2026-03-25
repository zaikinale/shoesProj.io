import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useUserContext';
import { ProtectedRoute } from './providers/ProtectedRoute.jsx'
import { LoadingScreen } from './utils/LoadScreen.jsx';

import Login from './pages/Login/Login.jsx';
import Store from './pages/Store/Store.jsx';
import Orders from './pages/Orders/Orders.jsx';
import Order from './pages/Order/Order.jsx';
import Basket from './pages/Basket/Basket.jsx';
import Register from './pages/Register/Register.jsx';
import NotFound from './pages/Not-found/Not-found.jsx';
import Logout from './pages/Logout/Logout.jsx';
import Good from './pages/Good/Good.jsx';
import Profile from './pages/Profile/Profile.jsx';
import Denied from './pages/Denied/Denied.jsx';
import Categories from './pages/Categories/Categories.jsx';
import Help from './pages/Help/Help.jsx';
import Employees from './pages/Employees/Employees.jsx'
import GoodEditor from './pages/GoodEditor/GoodEditor.jsx'

import './styles/variables.css'
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

                <Route 
                    path="/admin/products/add" 
                    element={
                        <ProtectedRoute>
                            <GoodEditor />
                        </ProtectedRoute>
                    } 
                />
    
                <Route 
                    path="/admin/products/edit/:id" 
                    element={
                        <ProtectedRoute>
                            <GoodEditor />
                        </ProtectedRoute>
                    } 
                />

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

                {/* <Route path="/categories" element={
                    <ProtectedRoute><Categories /></ProtectedRoute>
                } /> */}

                <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                <Route path="/categories/:id" element={<ProtectedRoute><Categories /></ProtectedRoute>} />

                <Route path="/staff" element={
                    <ProtectedRoute><Employees /></ProtectedRoute>
                } />

                <Route path="/help" element={
                    <ProtectedRoute><Help /></ProtectedRoute>
                } />
                
                <Route path="/logout" element={<Logout />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('root')).render(<App />);