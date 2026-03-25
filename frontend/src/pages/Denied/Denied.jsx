import { useLocation } from 'react-router-dom';
import NavigateTo from '../../utils/navBtn';
import styles from './Denied.module.css';

export default function Denied() {
    const location = useLocation();
    const { status = "403", error = "Доступ запрещен" } = location.state || {};

    return (
        <div className={styles.page}>
            <div className={styles.errorCard}>
                <div className={styles.icon}>!</div>
                <h1 className={styles.status}>{status}</h1>
                <p className={styles.errorInfo}>{error}</p>
                <div className={styles.actions}>
                    <NavigateTo path={'login'} />
                </div>
            </div>
        </div>
    );
}