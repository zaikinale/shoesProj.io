import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProtectedRoute } from '../../providers/ProtectedRoute';
import { useStore } from '../../store/useUserContext';

vi.mock('../../store/useUserContext', () => ({
  useStore: vi.fn()
}));

describe('ProtectedRoute component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен редиректить на страницу входа/отказа, если пользователя нет', () => {
    useStore.mockImplementation((selector) => selector({ 
      user: null, 
      isInitialized: true 
    }));

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={
            <ProtectedRoute><div>Private Content</div></ProtectedRoute>
          } />
          <Route path="/denied" element={<div>Login Page</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Private Content')).not.toBeInTheDocument();
  });

  it('должен показывать контент, если пользователь авторизован', () => {
    useStore.mockImplementation((selector) => selector({ 
      user: { id: 1 }, 
      isInitialized: true 
    }));

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={
            <ProtectedRoute><div>Private Content</div></ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Private Content')).toBeInTheDocument();
  });
});