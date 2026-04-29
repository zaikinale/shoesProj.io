import { z } from 'zod';

function stripHtmlTags(raw: string): string {
    return raw.replace(/<[^>]*>/g, '').trim();
}

export const updateProfileSchema = z
    .object({
        username: z
            .string()
            .min(3, 'Имя пользователя: минимум 3 символа')
            .max(100)
            .transform(stripHtmlTags)
            .refine((s) => s.length >= 3, {
                message: 'После очистки от разметки имя должно быть не короче 3 символов',
            }),
        email: z
            .string()
            .trim()
            .email('Некорректный email')
            .max(255)
            .transform((e) => e.toLowerCase()),
    })
    .partial()
    .refine((data) => data.username !== undefined || data.email !== undefined, {
        message: 'Укажите хотя бы одно поле: username или email',
    });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

const strongPassword = z
    .string()
    .min(8, 'Пароль: минимум 8 символов')
    .regex(/[a-z]/, 'Нужна строчная латинская буква')
    .regex(/[A-Z]/, 'Нужна заглавная латинская буква')
    .regex(/[0-9]/, 'Нужна цифра')
    .regex(/[^A-Za-z0-9]/, 'Нужен специальный символ');

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Введите текущий пароль'),
        newPassword: strongPassword,
        confirmNewPassword: z.string().min(1, 'Подтвердите новый пароль'),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'Новый пароль и подтверждение не совпадают',
        path: ['confirmNewPassword'],
    });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
