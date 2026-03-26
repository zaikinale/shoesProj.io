import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useStore } from '../../store/useUserContext';

// Настраиваем мок-сервер
const server = setupServer(
  http.get('*/auth/me', () => {
    // Имитируем ошибку авторизации
    return new HttpResponse(null, { status: 401 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Auth Restoration Flow', () => {
  it('должен сбрасывать юзера в null, если сервер вернул 401', async () => {
    // Предзаполним стор, как будто юзер был
    useStore.setState({ user: { id: 1 }, isInitialized: true });
    localStorage.setItem('token', 'invalid-token');

    await useStore.getState().restoreAuth();

    expect(useStore.getState().user).toBeNull();
    expect(useStore.getState().isInitialized).toBe(true);
  });
});