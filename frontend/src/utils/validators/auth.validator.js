export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateProfileClient = (username, email) => {
    const strippedName = (username || '').trim().replace(/<[^>]*>/g, '').trim();
    if (strippedName.length < 3) return 'Имя пользователя: минимум 3 символа';
    if (!EMAIL_REGEX.test(email)) return 'Некорректный email';
    return null;
};

export const validatePasswordClient = (newPassword, confirmPassword, currentPassword) => {
    if (!currentPassword) return 'Введите текущий пароль';
    if (newPassword.length < 6) return 'Новый пароль должен быть не менее 6 символов';
    if (newPassword !== confirmPassword) return 'Новый пароль и подтверждение не совпадают';
    return null;
};

export const formatServerError = (data, status) => {
    if (status === 400 && data.details?.fieldErrors) {
        return Object.values(data.details.fieldErrors).flat().join(', ');
    }
    return data.error || `Ошибка ${status}`;
};