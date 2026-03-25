import { useState } from 'react';
import { register as apiRegister } from '../api/auth.js';

export const useRegistration = (onSuccess) => {
    const [formData, setFormData] = useState({
        userName: '',
        userLogin: '',
        userPassword: '',
        userPasswordConf: ''
    });
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(''); 
    };

    const submitRegistration = async () => {
        if (formData.userPassword !== formData.userPasswordConf) {
            setError('Пароли не совпадают');
            return;
        }

        setStatus('loading');
        try {
            const user = await apiRegister(
                formData.userName, 
                formData.userLogin, 
                formData.userPassword, 
                formData.userPasswordConf
            );
            setStatus('success');
            if (onSuccess) onSuccess(user);
        } catch (err) {
            setStatus('error');
            setError('Ошибка регистрации. Возможно, этот Email уже занят.');
            console.log(err)
        }
    };

    return {
        formData,
        handleChange,
        submitRegistration,
        status,
        error,
        setError
    };
};