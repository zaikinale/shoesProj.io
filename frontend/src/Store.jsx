import { useState, useEffect } from 'react';
import { getGoods } from "./api/auth.js";
import { useNavigate } from 'react-router-dom';
import Card from "./Card.jsx";
import { useStore } from './store/useUserContext.jsx';

export default function Store() {
    const navigate = useNavigate();
    const userRole = useStore((state) => state.user?.role);
    const [originalGoods, setOriginalGoods] = useState([]); 
    const [sortOrder, setSortOrder] = useState('original');
    
    useEffect(() => {
        const loadGoods = async () => {
            try {
                const data = await getGoods();
                setOriginalGoods(data);
            } catch (error) {
                console.error('Ошибка загрузки товаров:', error);
            }
        };
        loadGoods();
    }, []);

    const displayGoods = sortOrder === 'alphabet'
        ? [...originalGoods].sort((a, b) => a.title.localeCompare(b.title))
        : originalGoods;

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const Filter = () => (
        <div className="filter">
            <h2>Фильтр</h2>
            <select value={sortOrder} onChange={handleSortChange}>
                <option value="original">original</option>
                <option value="alphabet">alphabet</option>
            </select>
        </div>
    );

    const navigateTo = (path) => (
        <button className="nav" onClick={() => navigate(`/${path}`)}>
            {path}
        </button>
    );

    const renderGoods = (type) => (
        <div className="container">
            {displayGoods.length > 0 ? (
                displayGoods.map((good) => (
                    <Card
                        key={good.id}
                        id={good.id}
                        title={good.title}
                        desc={good.desc}
                        price={good.price}
                        image={good.image}
                        type={type}
                    />
                ))
                ) : (
                    <p>Нет товаров</p>
            )}
        </div>
    );

    if (userRole === "USER") {
        return (
            <section className="store">
                <h1 className="head">
                    <span>Store</span>
                    {navigateTo("basket")}
                </h1>
                {renderGoods('user')}
            </section>
        );
    }

    if (userRole === "MANAGER") {
        return (
            <section className="store">
                <h1 className="head">
                    <span>Store</span>
                    {navigateTo("orders")}
                </h1>
                <Filter />
                {renderGoods('manager')}
            </section>
        );
    }

    if (userRole === "ADMIN") {
        return (
            <section className="store">
                <h1>Store</h1>
                <Filter />
                {renderGoods('admin')}
            </section>
        );
    }

    return (
        <section className="store">
            <h1>Store</h1>
            {renderGoods('login')}
        </section>
    );
}