import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useUserContext.jsx'; 
import { useRegistration } from '../../hooks/useRegistration.js';
import styles from './Register.module.css';

export default function Register() {
    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const { 
        formData, 
        handleChange, 
        submitRegistration, 
        status, 
        error 
    } = useRegistration((user) => {
        setUser(user);
        navigate('/');
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        submitRegistration();
    };

    return (
        <main className={styles.auth}>
            <div className={styles.auth__card} data-loading={status === 'loading'}>
                <header className={styles.auth__header}>
                    <h1 className={styles.auth__title}>Регистрация</h1>
                </header>

                <form className={styles.auth__form} onSubmit={handleSubmit}>
                    <div className={styles.auth__field}>
                        <input
                            className={styles.auth__input}
                            name="userName"
                            type="text"
                            placeholder="Имя"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.auth__field}>
                        <input
                            className={styles.auth__input}
                            name="userLogin"
                            type="email"
                            placeholder="Email"
                            value={formData.userLogin}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.auth__field}>
                        <input
                            className={styles.auth__input}
                            name="userPassword"
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="Пароль"
                            value={formData.userPassword}
                            onChange={handleChange}
                            required
                        />
                        <button 
                            type="button" 
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            className={styles.auth__toggle}
                        >
                            {isPasswordVisible ? "СКРЫТЬ" : "ПОКАЗАТЬ"}
                        </button>
                    </div>

                    <div className={styles.auth__field}>
                        <input
                            className={styles.auth__input}
                            name="userPasswordConf"
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="Повторите пароль"
                            value={formData.userPasswordConf}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <div className={styles.auth__error}>{error}</div>}

                    <button 
                        type="submit" 
                        className={styles.auth__submit}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Отправка...' : 'Создать аккаунт'}
                    </button>
                </form>

                <footer className={styles.auth__footer}>
                    <button onClick={() => navigate('/')} className={styles.auth__link}>
                        Уже есть аккаунт? Войти
                    </button>
                    <button onClick={() => navigate('/store')} className={styles.auth__link}>
                        Войти как гость
                    </button>
                </footer>
            </div>
        </main>
    );
}