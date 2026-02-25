import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../api/auth.js';  // ← Переименовали импорт API-функции
import '../App.css';
import { useStore } from '../store/useUserContext.jsx'; 

function Login() {
  const navigate = useNavigate();
  const [shown, setShown] = useState(false);
  const [userLogin, setUserLogin] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');

  // ✅ Берем login action из стора (вместо setUser)
  const storeLogin = useStore((state) => state.login);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      // Вызываем API-функцию (переименованную как apiLogin)
      const responseData = await apiLogin(userLogin, userPassword);
      console.log("Успешный вход:", responseData);
      
      // ✅ Используем action из стора — он сам всё сохранит и поставит isInitialized: true
      storeLogin(responseData.accessToken, responseData.user);
      
      navigate('/store');
    } catch (error) {
      console.error("Ошибка входа:", error);
      setError('Неверный пароль или пользователь не найден.');
    }
  };

  const guestGo = () => {
    navigate('/store'); 
    // Для гостя можно не трогать стор, или явно очистить:
    // useStore.getState().logout();
  };

  return (
    <section className='login'>
      <form className="form" onSubmit={submitForm}>
        <h3>Login form</h3>
        <input
          type="text"
          placeholder="login"
          value={userLogin}
          onChange={(e) => setUserLogin(e.target.value)}
        />
        <div className="pass">
          <input
            type={shown ? 'text' : 'password'} 
            placeholder="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
          <button type="button" onClick={() => setShown(!shown)}>
            {shown ? "◎" : "◉"}
          </button>
        </div>
        
        <input type="submit" value="login" />
      </form>
      
      {/* ✅ Исправление ошибки className */}
      <div className={error !== "" ? "error" : ""}> 
        {error !== "" && error}
      </div>
      
      <button onClick={() => navigate('/register')} className='linkBtnNavigate'>
        registration
      </button>
      <a onClick={guestGo}>guest version</a>
    </section>
  );
}

export default Login;