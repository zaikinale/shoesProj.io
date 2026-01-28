import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Logout () {
    const navigate = useNavigate();
    
    useEffect(() => {
        localStorage.clear();
    }, []);

    return (
        <div className="section">
            <h1>Вы успешно вышли из аккаунта!</h1>
            <button className="register" onClick={() => navigate('/')}>На главную</button>
        </div>
    )
}