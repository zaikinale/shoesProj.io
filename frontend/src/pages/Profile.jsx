import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Changed 'react-router' to 'react-router-dom' for standard hooks
import { getSavedGoods } from '../api/saves.js';
import NavigateTo from "../utils/navBtn";
import { useStore } from "../store/useUserContext.jsx";

export default function Profile() {
    const navigate = useNavigate();
    const isUserInitializated = useStore((state) => state.user?.isInitialized);
    const [savesGoods, setSavesGoods] = useState([]);

    // Redirect if user is not initialized
    useEffect(() => {
        if (!isUserInitializated) {
            navigate('/denied', {
                state: {
                    status: 403,
                    error: 'Access Denied: User not initialized'
                }
            });
        }
    }, [isUserInitializated, navigate]);

    const loadGoods = async () => {
        // Optional: Prevent API call if user is not initialized
        if (!isUserInitializated) return;

        try {
            const data = await getSavedGoods();
            console.log(data);
            setSavesGoods(data);
        } catch (error) {
            console.error('Error loading saves goods: ', error);
        }
    };

    useEffect(() => {
        loadGoods();
    }, [isUserInitializated]); // Re-run if initialization status changes

    const renderListGood = (goodItem) => {
        return (
            <Link to={`/good/${goodItem.id}`} key={goodItem.id}>
                <div className="cardSmall">
                    <img src={goodItem.image} alt={goodItem.title} className="imgSmall" />
                    <h3 className="title">{goodItem.title}</h3>
                </div>
            </Link>
        );
    };

    // Optional: Return null while redirecting to prevent flash of content
    if (!isUserInitializated) {
        return null;
    }

    return (
        <section className="profile">
            <div className="head">
                <NavigateTo path="profile"/>
                <div className="controls">
                    <NavigateTo path="store"/>
                    <NavigateTo path="basket"/>
                    <NavigateTo path="orders"/>
                    <NavigateTo path="logout"/>
                </div>
            </div>
            <aside className="info">
                <h1>Hello user!</h1>
                <div className="profile-info">
                    <p className="name">name: User1</p>
                    <p className="email">email: User1@email.ru</p>
                    <div className="controls">
                        <button className="change-info">change info</button>
                        <button className="change-pass">change password</button>
                    </div>
                </div>
            </aside>
            <aside className="saved">
                <h2>Your saved</h2>
                <div className="saved-cards">
                    {savesGoods.length > 0 ? (
                        savesGoods.map((good) => renderListGood(good))
                    ) : (
                        <p>You don't have any saved items yet.</p>
                    )}
                </div>
            </aside>
        </section>
    );
}