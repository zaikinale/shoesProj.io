import { describe, it, expect } from 'vitest';
import {
    validateProfileClient,
    validatePasswordClient,
    formatServerError,
    EMAIL_REGEX,
} from '../../utils/validators/auth.validator';

describe('auth.validator', () => {
    describe('EMAIL_REGEX', () => {
        it('принимает типичный email', () => {
            expect(EMAIL_REGEX.test('user@example.com')).toBe(true);
        });

        it('отклоняет строку без @', () => {
            expect(EMAIL_REGEX.test('userexample.com')).toBe(false);
        });
    });

    describe('validateProfileClient', () => {
        it('возвращает null для корректных данных', () => {
            expect(validateProfileClient('Иван', 'ivan@mail.ru')).toBeNull();
        });

        it('требует минимум 3 символа в имени (после trim)', () => {
            expect(validateProfileClient('ab', 'a@b.co')).toBe(
                'Имя пользователя: минимум 3 символа'
            );
        });

        it('отклоняет невалидный email', () => {
            expect(validateProfileClient('username', 'not-email')).toBe('Некорректный email');
        });

        it('обрезает HTML-теги в имени перед проверкой длины', () => {
            expect(validateProfileClient('<b>ab</b>', 'u@u.co')).toBe(
                'Имя пользователя: минимум 3 символа'
            );
        });
    });

    describe('validatePasswordClient', () => {
        it('возвращает null при корректной смене пароля', () => {
            expect(validatePasswordClient('newpass1', 'newpass1', 'current')).toBeNull();
        });

        it('требует текущий пароль', () => {
            expect(validatePasswordClient('newpass1', 'newpass1', '')).toBe(
                'Введите текущий пароль'
            );
        });

        it('требует минимум 6 символов у нового пароля', () => {
            expect(validatePasswordClient('12345', '12345', 'old')).toBe(
                'Новый пароль должен быть не менее 6 символов'
            );
        });

        it('проверяет совпадение нового пароля и подтверждения', () => {
            expect(validatePasswordClient('secret12', 'other12', 'old')).toBe(
                'Новый пароль и подтверждение не совпадают'
            );
        });
    });

    describe('formatServerError', () => {
        it('собирает fieldErrors из ответа 400', () => {
            const data = {
                details: { fieldErrors: { email: ['Неверный формат'], name: ['Короткое'] } },
            };
            expect(formatServerError(data, 400)).toBe('Неверный формат, Короткое');
        });

        it('возвращает data.error если нет fieldErrors', () => {
            expect(formatServerError({ error: 'Не авторизован' }, 401)).toBe('Не авторизован');
        });

        it('подставляет статус при отсутствии сообщения', () => {
            expect(formatServerError({}, 503)).toBe('Ошибка 503');
        });
    });
});
