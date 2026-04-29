import { useNavigate } from "react-router";
import styles from './Not-found.module.css';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <div className={styles.errorCard}>
                <div className={styles.glitchContainer}>
                    <h1 className={styles.status}>404</h1>
                    <div className={styles.glitchShadow}>404</div>
                </div>
                <h2 className={styles.title}>Страница не найдена</h2>
                <p className={styles.errorInfo}>
                    Похоже, этот адрес больше не существует или был перемещен.
                </p>
                <div className={styles.actions}>
                    <button className="btn" onClick={() => navigate('/store')}>на главную</button>
                </div>
            </div>
        </div>
    );
}