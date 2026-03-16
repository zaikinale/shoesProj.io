import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from '../store/useUserContext.jsx';

export default function Logout() {
    const navigate = useNavigate();
    const logout = useStore((state) => state.logout);

    useEffect(() => {
        const performLogout = async () => {
            await logout();
            
            localStorage.clear();
            sessionStorage.clear();
            
            document.cookie.split(";").forEach(cookie => {
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                if (name === 'access_token' || name === 'token') {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}; SameSite=Lax`;
                }
            });
            
            navigate('/', { replace: true });
        };
        
        performLogout();
    }, [logout, navigate]);

    return (
        <div className="section">
            <h1>Logging out...</h1>
        </div>
    );
}