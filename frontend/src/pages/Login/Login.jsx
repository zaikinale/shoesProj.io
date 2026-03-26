import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, status, setStatus } = useAuth();

  const [formData, setFormData] = useState({ login: '', password: '' });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status === 'error') setStatus('idle');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.login, formData.password);
    
      setTimeout(() => {
        navigate('/store', { replace: true });
      }, 0);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className={styles.auth}>
      <div className={styles.auth__card} data-status={status}>
        <header className={styles.auth__header}>
          <h1 className={styles.auth__title}>Вход</h1>
          <p className={styles.auth__description}>Добро пожаловать</p>
        </header>

        <form className={styles.auth__form} onSubmit={handleSubmit}>
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
            <label className={styles.auth__label}>Email / Логин</label>
            <div className={styles.auth__line}></div>
          </div>

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

          {status === 'error' && (
            <div className={styles.auth__error}>Неверный логин или пароль</div>
          )}

          <button 
            type="submit" 
            className={styles.auth__submit} 
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'ВХОД...' : 'ВОЙТИ'}
          </button>
        </form>

        <footer className={styles.auth__footer}>
          <button onClick={() => navigate('/register')} className={styles.auth__link}>
            Создать аккаунт
          </button>
          <button onClick={() => navigate('/store')} className={styles.auth__link}>
            Зайти как гость
          </button>
        </footer>
      </div>
    </main>
  );
};

export default Login;