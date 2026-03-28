import { useState, useCallback } from 'react';
import { buildUrl, BASE_OPTIONS } from '../utils/apiBase';
import { EMAIL_REGEX, formatServerError } from '../utils/validators/auth.validator';

export const useProfileForm = (user, setUserPublic, onSuccess) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [clientError, setClientError] = useState('');
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const reset = useCallback(() => {
        setUsername(user?.username ?? '');
        setEmail(user?.email ?? '');
        setClientError('');
        setServerError('');
    }, [user]);

    const submit = async (e) => {
        e.preventDefault();
        setClientError('');
        setServerError('');

        const strippedName = (username || '').trim().replace(/<[^>]*>/g, '').trim();
        const trimmedEmail = (email || '').trim();

        if (strippedName.length < 3) {
            setClientError('Имя пользователя: минимум 3 символа');
            return;
        }
        if (!EMAIL_REGEX.test(trimmedEmail)) {
            setClientError('Некорректный email');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(buildUrl('auth/profile'), {
                method: 'PATCH',
                ...BASE_OPTIONS,
                body: JSON.stringify({ 
                    username: strippedName, 
                    email: trimmedEmail.toLowerCase() 
                }),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setServerError(formatServerError(data, response.status));
                return;
            }

            setUserPublic(data);
            onSuccess();
        } catch {
            setServerError('Ошибка сети');
        } finally {
            setLoading(false);
        }
    };

    return {
        username,
        setUsername,
        email,
        setEmail,
        clientError,
        serverError,
        loading,
        submit,
        reset
    };
};