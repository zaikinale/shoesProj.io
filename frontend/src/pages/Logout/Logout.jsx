import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useUserContext.jsx';
import { clearUserSession } from '../../utils/authHelpers.js';
import styles from './Logout.module.css';

export default function Logout() {
    const navigate = useNavigate();
    const logout = useStore((state) => state.logout);

    useEffect(() => {
        let isMounted = true;

        const performLogout = async () => {
            try {
                await logout();
            } catch (error) {
                console.error('Серверный Logout не удался, чистим локально:', error);
            } finally {
                clearUserSession();

                if (isMounted) {
                    navigate('/', { replace: true });
                }
            }
        };

        performLogout();

        return () => {
            isMounted = false;
        };
    }, [logout, navigate]);

    return (
        <main className={styles.logoutPage}>
            <div className={styles.logoutPage__content}>
                <div className={styles.logoutPage__spinner}></div>
                <h1 className={styles.logoutPage__title}>Выход из системы...</h1>
                <p className={styles.logoutPage__subtitle}>Секунду, подчищаем хвосты</p>
            </div>
        </main>
    );
}
