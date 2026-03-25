// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login as apiLogin } from '../../api/auth.js';
// import '../App.css';
// import { useStore } from '../../store/useUserContext.jsx'; 

// function Login() {
//   const navigate = useNavigate();
//   const [shown, setShown] = useState(false);
//   const [userLogin, setUserLogin] = useState('');
//   const [userPassword, setUserPassword] = useState('');
//   const [error, setError] = useState('');

//   const storeLogin = useStore((state) => state.login);

//   const submitForm = async (e) => {
//     e.preventDefault();
//     try {
//       const responseData = await apiLogin(userLogin, userPassword);
//       // console.log("Успешный вход:", responseData);
      
//       storeLogin(responseData.accessToken, responseData.user);
      
//       navigate('/store');
//     } catch (error) {
//       // console.error("Ошибка входа:", error);
//       setError('Invalid password or user not found.');
//     }
//   };

//   const guestGo = () => {
//     navigate('/store'); 
//   };

//   return (
//     <section className='login'>
//       <form className="form" onSubmit={submitForm}>
//         <h3>Login form</h3>
//         <input
//           type="text"
//           placeholder="login"
//           value={userLogin}
//           onChange={(e) => setUserLogin(e.target.value)}
//         />
//         <div className="pass">
//           <input
//             type={shown ? 'text' : 'password'} 
//             placeholder="password"
//             value={userPassword}
//             onChange={(e) => setUserPassword(e.target.value)}
//           />
//           <button type="button" onClick={() => setShown(!shown)}>
//             {shown ? "◎" : "◉"}
//           </button>
//         </div>
        
//         <input type="submit" value="login" />
//       </form>
      
//       <div className={error !== "" ? "error" : ""}> 
//         {error !== "" && error}
//       </div>
      
//       <button onClick={() => navigate('/register')} className='linkBtnNavigate'>
//         registration
//       </button>
//       <a onClick={guestGo}>guest version</a>
//     </section>
//   );
// }

// export default Login;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../../api/auth.js';
import { useStore } from '../../store/useUserContext.jsx'; 
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const storeLogin = useStore((state) => state.login);

  // Группируем поля в один объект
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Универсальный обработчик ввода
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status === 'error') setStatus('idle'); // Сбрасываем ошибку при начале ввода
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const responseData = await apiLogin(formData.login, formData.password);
      
      // Записываем в Zustand/Context
      storeLogin(responseData.accessToken, responseData.user);
      
      setStatus('idle');
      navigate('/store');
    } catch (err) {
      console.error("Login error:", err);
      setStatus('error');
    }
  };

  const handleGuestEntry = () => {
    navigate('/store'); 
  };

  return (
    <main className={styles.auth}>
      <div className={styles.auth__card} data-status={status}>
        <header className={styles.auth__header}>
          <h1 className={styles.auth__title}>Login</h1>
          <p className={styles.auth__description}>Введите данные для входа в свой аккаунт</p>
        </header>

        <form className={styles.auth__form} onSubmit={submitForm}>
          {/* Поле логина */}
          <div className={styles.auth__field}>
            <input 
              className={styles.auth__input}
              name="login"
              type="text"
              placeholder=" " 
              value={formData.login}
              onChange={handleInputChange}
              required 
            />
            <label className={styles.auth__label}>Логин</label>
            <div className={styles.auth__line}></div>
          </div>

          {/* Поле пароля */}
          <div className={styles.auth__field}>
            <input 
              className={styles.auth__input}
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder=" "
              value={formData.password}
              onChange={handleInputChange}
              required 
            />
            <label className={styles.auth__label}>Пароль</label>
            <button 
              type="button" 
              className={styles.auth__toggle}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? 'СКРЫТЬ' : 'ПОКАЗАТЬ'}
            </button>
            <div className={styles.auth__line}></div>
          </div>

          {/* Сообщение об ошибке */}
          {status === 'error' && (
            <div className={styles.auth__error}>
              Неверный пароль или пользователь не найден
            </div>
          )}

          <button 
            type="submit" 
            className={styles.auth__submit} 
            disabled={status === 'loading'}
          >
            <span>{status === 'loading' ? 'ВХОД...' : 'ВОЙТИ'}</span>
          </button>
        </form>

        <footer className={styles.auth__footer}>
          <button 
            onClick={() => navigate('/register')} 
            className={styles.auth__link}
          >
            Регистрация
          </button>
          <button 
            onClick={handleGuestEntry} 
            className={`${styles.auth__link} ${styles['auth__link--guest']}`}
          >
            Гостевой режим
          </button>
        </footer>
      </div>
    </main>
  );
};

export default Login;