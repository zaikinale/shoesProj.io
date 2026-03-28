import { useState, useCallback } from 'react';
import { buildUrl, BASE_OPTIONS } from '../utils/apiBase';
import { validatePasswordClient, formatServerError } from '../utils/validators/auth.validator';

export const usePasswordForm = (onSuccess) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [clientError, setClientError] = useState('');
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const reset = useCallback(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setClientError('');
        setServerError('');
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setClientError('');
        setServerError('');

        const error = validatePasswordClient(newPassword, confirmPassword, currentPassword);
        if (error) return setClientError(error);

        setLoading(true);
        try {
            const response = await fetch(buildUrl('auth/change-password'), {
                method: 'POST',
                ...BASE_OPTIONS,
                body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword: confirmPassword }),
            });

            if (response.status === 204) {
                onSuccess();
                return;
            }

            const data = await response.json().catch(() => ({}));
            setServerError(formatServerError(data, response.status));
        } catch {
            setServerError('Ошибка сети или сервера');
        } finally {
            setLoading(false);
        }
    };

    return { 
        currentPassword, setCurrentPassword, newPassword, setNewPassword, 
        confirmPassword, setConfirmPassword, clientError, serverError, loading, submit, reset 
    };
};