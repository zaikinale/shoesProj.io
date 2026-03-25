// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { register } from '../api/auth.js';
// import '../App.css';
// import { useStore } from '../store/useUserContext.jsx'; 

// export default function Register() {
//     const navigate = useNavigate();
//     const [shown, setShown] = useState(false);
//     const [userName, setUserName] = useState('');
//     const [userLogin, setUserLogin] = useState('');
//     const [userPassword, setUserPassword] = useState('');
//     const [userPasswordConf, setUserPasswordConf] = useState('');
//     const [error, setError] = useState('')

//     const setUser = useStore((state) => state.setUser);

//     const submitForm = async (e) => {
//         e.preventDefault();
//         try {
//             const user = await register(userName, userLogin, userPassword, userPasswordConf);
//             // console.log("Успешный вход:", user);
//             setUser(user);
//             navigate('/');
//         } catch (error) {
//             console.error("Ошибка входа:", error);
//             setError('Invalid password or user not found.')
//         }
//     };

//     const guestGo = () => {
//         navigate('/store'); 
//         setUser(null);
//     }

//     return (
//         <section className='login'>
//             <form className="form" onSubmit={submitForm}>
//                 <h3>Registration form</h3>
//                 <input
//                     type="text"
//                     placeholder="username"
//                     value={userName}
//                     onChange={(e) => setUserName(e.target.value)}
//                 />
//                 <input
//                     type="email"
//                     placeholder="email"
//                     value={userLogin}
//                     onChange={(e) => setUserLogin(e.target.value)}
//                 />
//                 <div className="pass ">
//                     <input
//                         type={shown ? 'text' : 'password'} 
//                         placeholder="password"
//                         value={userPassword}
//                         onChange={(e) => setUserPassword(e.target.value)}
//                     />
//                     <button type="button" onClick={() => setShown(!shown)}>
//                         {shown ? "◎" : "◉"}
//                     </button>
//                 </div>
//                 <input
//                     type={shown ? 'text' : 'password'} 
//                     placeholder="password confirm"
//                     value={userPasswordConf}
//                     onChange={(e) => setUserPasswordConf(e.target.value)}
//                 />
//                 <input type="submit" value="registration" />
//             </form>
//             <div className={error !== "" && "error"}> 
//                 { error !== "" && error}
//             </div>
//             <button onClick={() => navigate('/')} className='linkBtnNavigate'>login</button>
//             <a onClick={() => guestGo()}>guest version</a>
//         </section>
//     );
// }
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../../api/auth.js';
import { useStore } from '../../store/useUserContext.jsx'; 
import styles from './Register.module.css';

export default function Register() {
    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);

    const [formData, setFormData] = useState({
        userName: '',
        userLogin: '',
        userPassword: '',
        userPasswordConf: ''
    });
    
    const [status, setStatus] = useState('idle'); // idle | loading | error
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const submitForm = async (e) => {
        e.preventDefault();
        
        if (formData.userPassword !== formData.userPasswordConf) {
            setError('Пароли не совпадают');
            return;
        }

        setStatus('loading');
        try {
            const user = await apiRegister(
                formData.userName, 
                formData.userLogin, 
                formData.userPassword, 
                formData.userPasswordConf
            );
            setUser(user);
            navigate('/');
        } catch (err) {
            setStatus('error');
            setError('Ошибка при регистрации. Возможно, email уже занят.');
        } finally {
            if (status !== 'error') setStatus('idle');
        }
    };

    const handleGuestEntry = () => {
        navigate('/store'); 
    };

    return (
        <main className={styles.auth}>
            <div className={styles.auth__card} data-status={status}>
                <header className={styles.auth__header}>
                    <h1 className={styles.auth__title}>Создать аккаунт</h1>
                    <p className={styles.auth__description}>Присоединяйтесь к нашей платформе</p>
                </header>

                <form className={styles.auth__form} onSubmit={submitForm}>
                    <div className={styles.auth__field}>
                        <input
                            className={styles.auth__input}
                            name="userName"
                            type="text"
                            placeholder=" "
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />
                        <label className={styles.auth__label}>Имя пользователя</label>
                        <div className={styles.auth__line}></div>
                    </div>

                    <div className={styles.auth__field}>
                        <input
                            className={styles.auth__input}
                            name="userLogin"
                            type="email"
                            placeholder=" "
                            value={formData.userLogin}
                            onChange={handleChange}
                            required
                        />
                        <label className={styles.auth__label}>Email</label>
                        <div className={styles.auth__line}></div>
                    </div>

                    <div className={styles.auth__field}>
                        <input
                            className={styles.auth__input}
                            name="userPassword"
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder=" "
                            value={formData.userPassword}
                            onChange={handleChange}
                            required
                        />
                        <label className={styles.auth__label}>Пароль</label>
                        <button 
                            type="button" 
                            className={styles.auth__toggle} 
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            {isPasswordVisible ? "СКРЫТЬ" : "ПОКАЗАТЬ"}
                        </button>
                        <div className={styles.auth__line}></div>
                    </div>

                    <div className={styles.auth__field}>
                        <input
                            className={styles.auth__input}
                            name="userPasswordConf"
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder=" "
                            value={formData.userPasswordConf}
                            onChange={handleChange}
                            required
                        />
                        <label className={styles.auth__label}>Подтверждение пароля</label>
                        <div className={styles.auth__line}></div>
                    </div>

                    {error && <div className={styles.auth__error}>{error}</div>}

                    <button 
                        type="submit" 
                        className={styles.auth__submit}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'РЕГИСТРАЦИЯ...' : 'СОЗДАТЬ АККАУНТ'}
                    </button>
                </form>

                <footer className={styles.auth__footer}>
                    <button onClick={() => navigate('/')} className={styles.auth__link}>
                        Уже есть аккаунт? Войти
                    </button>
                    <button onClick={handleGuestEntry} className={`${styles.auth__link} ${styles['auth__link--guest']}`}>
                        Гостевой режим
                    </button>
                </footer>
            </div>
        </main>
    );
}