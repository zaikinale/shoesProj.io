import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSavedGoods } from '../../api/saves.js';
import NavigateTo from "../../utils/navBtn";
import { useStore } from '../../store/useUserContext.jsx';
import { useProfileForm } from '../../hooks/useProfileForm';
import { usePasswordForm } from '../../hooks/usePasswordForm';
import styles from './Profile.module.css';

export default function Profile() {
    const { user, setUserPublic } = useStore();
    const [savesGoods, setSavesGoods] = useState([]);
    const [modal, setModal] = useState(null);
    const closeModal = () => setModal(null);

    const profile = useProfileForm(user, setUserPublic, closeModal);
    const password = usePasswordForm(closeModal);

    useEffect(() => {
        getSavedGoods().then(setSavesGoods).catch(console.error);
    }, []);

    const handleOpenProfile = () => { profile.reset(); setModal('profile'); };
    const handleOpenPassword = () => { password.reset(); setModal('password'); };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <NavigateTo path="store" />
                    <nav className={styles.nav}>
                        <NavigateTo path="basket" /><NavigateTo path="orders" />
                        <NavigateTo path="help" /><NavigateTo path="logout" />
                    </nav>
                </div>
            </header>

            <main className={styles.container}>
                <section className={styles.layout}>
                    <aside className={styles.sidebar}>
                        <div className={styles.userCard}>
                            <div className={styles.avatar}>{user?.username?.charAt(0) || 'U'}</div>
                            <h1 className={styles.greeting}>Привет, {user?.username || 'пользователь'}!</h1>
                            <div className={styles.details}>
                                <div className={styles.detailItem}><span>Email</span><p>{user?.email}</p></div>
                            </div>
                            <div className={styles.profileActions}>
                                <button className={styles.btnSecondary} onClick={handleOpenProfile}>Изменить данные</button>
                                <button className={styles.btnSecondary} onClick={handleOpenPassword}>Сменить пароль</button>
                            </div>
                        </div>
                    </aside>

                    <section className={styles.content}>
                        <h2 className={styles.sectionTitle}>Избранное <span>{savesGoods.length}</span></h2>
                        <div className={styles.savedGrid}>
                            {savesGoods.map(good => (
                                <Link to={`/good/${good.id}`} key={good.id} className={styles.smallCard}>
                                    <div className={styles.imgWrapper}><img src={good.image} alt={good.title} /></div>
                                    <div className={styles.cardInfo}><h3>{good.title}</h3><span>Посмотреть →</span></div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </section>
            </main>

            {modal === 'profile' && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Редактирование профиля</h2>
                        <form onSubmit={profile.submit} className={styles.modalForm}>
                            <label className={styles.label}>Имя
                                <input className={styles.input} value={profile.username} onChange={e => profile.setUsername(e.target.value)} />
                            </label>
                            <label className={styles.label}>Email
                                <input className={styles.input} value={profile.email} onChange={e => profile.setEmail(e.target.value)} />
                            </label>
                            {(profile.clientError || profile.serverError) && <p className={styles.formError}>{profile.clientError || profile.serverError}</p>}
                            <div className={styles.modalActions}>
                                <button type="button" onClick={closeModal}>Отмена</button>
                                <button type="submit" disabled={profile.loading}>{profile.loading ? '...' : 'Сохранить'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modal === 'password' && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Смена пароля</h2>
                        <form onSubmit={password.submit} className={styles.modalForm}>
                            <input type="password" placeholder="Текущий пароль" value={password.currentPassword} onChange={e => password.setCurrentPassword(e.target.value)} className={styles.input}/>
                            <input type="password" placeholder="Новый пароль" value={password.newPassword} onChange={e => password.setNewPassword(e.target.value)} className={styles.input}/>
                            <input type="password" placeholder="Подтверждение" value={password.confirmPassword} onChange={e => password.setConfirmPassword(e.target.value)} className={styles.input}/>
                            {(password.clientError || password.serverError) && <p className={styles.formError}>{password.clientError || password.serverError}</p>}
                            <div className={styles.modalActions}>
                                <button type="button" onClick={closeModal}>Отмена</button>
                                <button type="submit" disabled={password.loading}>{password.loading ? '...' : 'Сменить'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}