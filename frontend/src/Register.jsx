import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from './api/auth.js';
import './App.css';
import { useStore } from './store/useUserContext.jsx'; 

export default function Register() {
    const navigate = useNavigate();
    const [shown, setShown] = useState(false);
    const [userLogin, setUserLogin] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userPasswordConf, setUserPasswordConf] = useState('');
    const [error, setError] = useState('')

    const setUser = useStore((state) => state.setUser);

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const user = await register(userLogin, userPassword, userPasswordConf);
            console.log("Успешный вход:", user);
            setUser(user);
            navigate('/');
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
                <h3>Registration form</h3>
                <input
                    type="email"
                    placeholder="email"
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
                <input
                    type={shown ? 'text' : 'password'} 
                    placeholder="password confirm"
                    value={userPasswordConf}
                    onChange={(e) => setUserPasswordConf(e.target.value)}
                />
                <input type="submit" value="registration" />
            </form>
            <div className={error !== "" && "error"}> 
                { error !== "" && error}
            </div>
            <button onClick={() => navigate('/')}>login</button>
            <a onClick={() => guestGo()}>guest version</a>
        </section>
    );
}
