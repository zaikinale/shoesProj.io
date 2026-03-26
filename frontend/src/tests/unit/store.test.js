import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store/useUserContext';

describe('User Store Logic', () => {
    beforeEach(() => {
        localStorage.clear();
        useStore.setState({ user: null, isInitialized: false });
    });

    it('должен записывать данные и токен при вызове login', () => {
        const mockData = { id: 7, name: 'Aleksej', token: 'secret_jwt' };
    
        useStore.getState().login(mockData);

        const state = useStore.getState();
        expect(state.user.name).toBe('Aleksej');
        expect(localStorage.getItem('token')).toBe('secret_jwt');
        expect(state.isInitialized).toBe(true);
    });
});