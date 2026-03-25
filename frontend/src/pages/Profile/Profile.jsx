// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getSavedGoods } from '../api/saves.js';
// import NavigateTo from "../utils/navBtn";

// export default function Profile() {
//     const [savesGoods, setSavesGoods] = useState([]);

//     const loadGoods = async () => {
//         try {
//             const data = await getSavedGoods();
//             console.log(data);
//             setSavesGoods(data);
//         } catch (error) {
//             console.error('Error loading saves goods: ', error);
//         }
//     };
    

//     useEffect(() => {
//         loadGoods();    
//     }, []);

//     const renderListGood = (goodItem) => {
//         return (
//             <Link to={`/good/${goodItem.id}`} key={goodItem.id}>
//                 <div className="cardSmall">
//                     <img src={goodItem.image} alt={goodItem.title} className="imgSmall" />
//                     <h3 className="title">{goodItem.title}</h3>
//                 </div>
//             </Link>
//         );
//     };

//     return (
//         <section className="profile">
//             <div className="head">
//                 <NavigateTo path="store"/>
//                 <div className="controls">
//                     {/* <NavigateTo path="store"/> */}
//                     <NavigateTo path="basket"/>
//                     <NavigateTo path="orders"/>
//                     <NavigateTo path="help"/>
//                     <NavigateTo path="logout"/>
//                 </div>
//             </div>
//             <aside className="info">
//                 <h1>Hello user!</h1>
//                 <div className="profile-info">
//                     <p className="name">name: User1</p>
//                     <p className="email">email: User1@email.ru</p>
//                     <div className="controls">
//                         <button className="change-info">change info</button>
//                         <button className="change-pass">change password</button>
//                     </div>
//                 </div>
//             </aside>
//             <aside className="saved">
//                 <h2>Your saved</h2>
//                 <div className="saved-cards">
//                     {savesGoods.length > 0 ? (
//                         savesGoods.map((good) => renderListGood(good))
//                     ) : (
//                         <p>You don't have any saved items yet.</p>
//                     )}
//                 </div>
//             </aside>
//         </section>
//     );
// }
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
                    {/* Левая колонка: Инфо */}
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

                    {/* Правая колонка: Избранное */}
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