import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSavedGoods } from '../../api/saves.js';
import NavigateTo from "../../utils/navBtn";
import { useStore } from '../../store/useUserContext.jsx';
import styles from './Profile.module.css';

export default function Profile() {
    const { user } = useStore();
    const [savesGoods, setSavesGoods] = useState([]);

    const loadGoods = async () => {
        try {
            const data = await getSavedGoods();
            setSavesGoods(data);
        } catch (error) {
            console.error('Error loading saves goods: ', error);
        }
    };

    useEffect(() => {
        loadGoods();    
    }, []);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <NavigateTo path="store" />
                    <nav className={styles.nav}>
                        <NavigateTo path="basket" />
                        <NavigateTo path="orders" />
                        <NavigateTo path="help" />
                        <NavigateTo path="logout" />
                    </nav>
                </div>
            </header>

            <main className={styles.container}>
                <section className={styles.layout}>
                    <aside className={styles.sidebar}>
                        <div className={styles.userCard}>
                            <div className={styles.avatar}>
                                {user?.username?.charAt(0) || 'U'}
                            </div>
                            <h1 className={styles.greeting}>Привет, {user?.username || 'пользователь'}!</h1>
                            <div className={styles.details}>
                                <div className={styles.detailItem}>
                                    <span>Email</span>
                                    <p>{user?.email || 'Не указан'}</p>
                                </div>
                            </div>
                            <div className={styles.profileActions}>
                                <button className={styles.btnSecondary}>Изменить данные</button>
                                <button className={styles.btnSecondary}>Сменить пароль</button>
                            </div>
                        </div>
                    </aside>

                    <section className={styles.content}>
                        <h2 className={styles.sectionTitle}>Избранное <span>{savesGoods.length}</span></h2>
                        <div className={styles.savedGrid}>
                            {savesGoods.length > 0 ? (
                                savesGoods.map((good) => (
                                    <Link to={`/good/${good.id}`} key={good.id} className={styles.smallCard}>
                                        <div className={styles.imgWrapper}>
                                            <img src={good.image} alt={good.title} />
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <h3>{good.title}</h3>
                                            <span className={styles.viewMore}>Посмотреть →</span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className={styles.emptySaves}>
                                    <p>В списке избранного пока пусто</p>
                                    <Link to="/store" className={styles.link}>Перейти в магазин</Link>
                                </div>
                            )}
                        </div>
                    </section>
                </section>
            </main>
        </div>
    );
}