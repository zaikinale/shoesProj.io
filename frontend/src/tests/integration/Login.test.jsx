import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import Login from '../../pages/Login/Login';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth');

describe('Login Page Integration', () => {
  it('должен вызывать логин и переходить на страницу магазина', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ success: true });
    
    useAuth.mockReturnValue({
      login: mockLogin,
      status: 'idle',
      setStatus: vi.fn()
    });

    const { container } = render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/store" element={<div>Магазин открыт</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Используем селекторы по имени, так как label в коде не связан с input через id
    const loginInput = container.querySelector('input[name="login"]');
    const passwordInput = container.querySelector('input[name="password"]');

    fireEvent.change(loginInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    
    fireEvent.click(screen.getByText('ВОЙТИ'));

    expect(mockLogin).toHaveBeenCalledWith('admin', '123');

    await waitFor(() => {
      expect(screen.getByText('Магазин открыт')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});