import { useState } from 'react';
import { login as apiLogin } from '../api/auth.js';
import { useStore } from '../store/useUserContext.jsx';

export const useAuth = () => {
    const [status, setStatus] = useState('idle');
    const storeLogin = useStore((state) => state.login);

    const login = async (email, password) => {
    setStatus('loading');
    try {
        const response = await apiLogin(email, password);
        
        storeLogin({ ...response.user, token: response.accessToken }); 
        
        setStatus('success');
        return response;
    } catch (err) {
        setStatus('error');
        throw err;
    }
};

    return { login, status, setStatus };
};