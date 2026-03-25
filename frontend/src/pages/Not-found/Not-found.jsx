import NavigateTo from '../../utils/navBtn.jsx';
import styles from './Not-found.module.css';

export default function NotFound() {
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
                    <NavigateTo path="" /> 
                </div>
            </div>
        </div>
    );
}