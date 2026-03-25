// // import { useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useStore } from '../store/useUserContext.jsx';

// // export default function Logout() {
// //     const navigate = useNavigate();
// //     const logout = useStore((state) => state.logout);

// //     useEffect(() => {
// //         const performLogout = async () => {
// //             await logout();
            
// //             localStorage.clear();
// //             sessionStorage.clear();
            
// //             document.cookie.split(";").forEach(cookie => {
// //                 const eqPos = cookie.indexOf("=");
// //                 const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
// //                 if (name === 'access_token' || name === 'token') {
// //                     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}; SameSite=Lax`;
// //                 }
// //             });
            
// //             navigate('/', { replace: true });
// //         };
        
// //         performLogout();
// //     }, [logout, navigate]);

// //     return (
// //         <div className="section">
// //             <h1>Logging out...</h1>
// //         </div>
// //     );
// // }

// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useStore } from '../../store/useUserContext.jsx';
// import styles from './Logout.module.css';

// export default function Logout() {
//     const navigate = useNavigate();
//     const logout = useStore((state) => state.logout);

//     useEffect(() => {
//         const performLogout = async () => {
//             try {
//                 await logout();
                
//                 localStorage.clear();
//                 sessionStorage.clear();
                
//                 document.cookie.split(";").forEach(cookie => {
//                     const eqPos = cookie.indexOf("=");
//                     const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
//                     if (name === 'access_token' || name === 'token') {
//                         document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}; SameSite=Lax`;
//                     }
//                 });
//             } finally {
//                 // Перенаправляем в любом случае, чтобы не "зависнуть" на странице выхода
//                 navigate('/', { replace: true });
//             }
//         };
        
//         performLogout();
//     }, [logout, navigate]);

//     return (
//         <div className={styles.page}>
//             <div className={styles.loaderContent}>
//                 <div className={styles.spinner}></div>
//                 <h1 className={styles.text}>Выходим из системы...</h1>
//             </div>
//         </div>
//     );
// }

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from '../../store/useUserContext.jsx';
import { clearUserSession } from '../../utils/authHelpers.js';
import styles from './Logout.module.css';

export default function Logout() {
    const navigate = useNavigate();
    const logout = useStore((state) => state.logout);

    useEffect(() => {
        let isMounted = true;

        const performLogout = async () => {
            try {
                await logout();
            } catch (error) {
                console.error("Серверный Logout не удался, чистим локально:", error);
            } finally {
                clearUserSession();
                
                if (isMounted) {
                    navigate('/', { replace: true });
                }
            }
        };
        
        performLogout();

        return () => { isMounted = false; };
    }, [logout, navigate]);

    return (
        <main className={styles.logoutPage}>
            <div className={styles.logoutPage__content}>
                <div className={styles.logoutPage__spinner}></div>
                <h1 className={styles.logoutPage__title}>Выход из системы...</h1>
                <p className={styles.logoutPage__subtitle}>Секунду, подчищаем хвосты</p>
            </div>
        </main>
    );
}