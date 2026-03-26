import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../store/useUserContext'; 
import * as authApi from '../../api/auth.js';

vi.mock('../../api/auth.js');

// Мокаем файл контекста
vi.mock('../../store/useUserContext', () => ({
  useStore: vi.fn()
}));

describe('useAuth Hook', () => {
  const mockStoreLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Настраиваем мок, чтобы он отвечал на вызовы типа useStore(state => state.login)
    useStore.mockImplementation((selector) => selector({ 
      login: mockStoreLogin,
      user: null,
      isInitialized: true
    }));
  });

  it('должен инициализироваться со статусом idle', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.status).toBe('idle');
  });

  it('должен проходить успешный цикл авторизации', async () => {
    const mockApiResponse = {
      user: { id: 1, name: 'Aleksej' },
      accessToken: 'fake-jwt-123'
    };
    authApi.login.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('admin', '123');
    });

    expect(authApi.login).toHaveBeenCalledWith('admin', '123');
    // Проверяем, что функция login из стора была вызвана
    expect(mockStoreLogin).toHaveBeenCalled();
    expect(result.current.status).toBe('success');
  });

  it('должен обрабатывать ошибки авторизации', async () => {
    authApi.login.mockRejectedValue(new Error('Unauthorized'));
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.login('wrong', 'wrong');
      } catch (e) { /* ignore */ }
    });

    expect(result.current.status).toBe('error');
  });
});