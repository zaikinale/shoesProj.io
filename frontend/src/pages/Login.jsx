import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.js';
import '../App.css';
import { useStore } from '../store/useUserContext.jsx'; 

function Login() {
  const navigate = useNavigate();
  const [shown, setShown] = useState(false);
  const [userLogin, setUserLogin] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('')

  const setUser = useStore((state) => state.setUser);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const user = await login(userLogin, userPassword);
      console.log("Успешный вход:", user);
      setUser(user.user);
      localStorage.setItem('token', user.token)
      navigate('/store');
    } catch (error) {
      console.error("Ошибка входа:", error);
      setError('Неверный пароль или пользователь не найден.')
    }
  };

  const guestGo = () => {
    navigate('/store'); 
    setUser(null);
  }

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
      <div className="pass ">
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
    <div className={error !== "" && "error"}> 
      { error !== "" && error}
    </div>
    <button onClick={() => navigate('/register')}>registration</button>
    <a onClick={() => guestGo()}>guest version</a>
    </section>
  );
}

export default Login;