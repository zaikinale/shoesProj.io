import { useState, useEffect } from 'react';
import { getGoods, addGood as apiAddGood } from "../api/goods.js";
import { useNavigate } from 'react-router-dom';
import Card from "../components/Card.jsx";
import { useStore } from '../store/useUserContext.jsx';

export default function Store() {
    const navigate = useNavigate();
    const userRole = useStore((state) => state.user?.roleID);
    const [originalGoods, setOriginalGoods] = useState([]); 
    const [sortOrder, setSortOrder] = useState('original');
    const [showForm, setShowForm] = useState(false);
    const [formAdd, setFormAdd] = useState({
        title: '',
        description: '',
        price: '',
        image: ''
    });

    const loadGoods = async () => {
        try {
            const data = await getGoods();
            setOriginalGoods(data);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        }
    };

    useEffect(() => {
        loadGoods();
    }, []);

    const displayGoods = sortOrder === 'alphabet'
        ? [...originalGoods].sort((a, b) => a.title.localeCompare(b.title))
        : originalGoods;

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const changeInputForm = (field, value) => {
        setFormAdd(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddGood = async () => { 
        console.log('Новый товар:', formAdd);
        const payload = {
            title: formAdd.title || '',
            description: formAdd.description || '',
            price: Number(formAdd.price),
            image: formAdd.image || null
        };
        
        if (isNaN(payload.price)) {
            alert('Цена должна быть числом');
            return;
        }
        try {
            const resp = await apiAddGood(formAdd);
            console.log('Товар добавлен:', resp);
            loadGoods(); 
            setShowForm(false); 
            setFormAdd({});
        } catch (error) {
            console.error('Ошибка отправки товара:', error);
        }
      };
    
    const clearForm = () => {
        setFormAdd({})
    }

    const addForm = () => {
        return (
        <div className="formAdd">
            <button className="showForm" onClick={() => (setShowForm(!showForm), clearForm())}>{showForm ? 'Скрыть и очистить форму' : 'Добавить товар'}</button>
            {
                showForm && (
                    <form onSubmit={(e) => {e.preventDefault();handleAddGood(); }} className="form formAddGoods">
                        <input type="text" value={formAdd.title || ''} placeholder="title" onChange={(e) => changeInputForm('title', e.target.value)}/>
                        <input type="text" value={formAdd.description || ''} placeholder="description" onChange={(e) => changeInputForm('description', e.target.value)}/>
                        <input type="text" value={formAdd.price || ''} placeholder="price" onChange={(e) => changeInputForm('price', e.target.value)}/>
                        <input type="text" value={formAdd.image || ''} placeholder="image link" onChange={(e) => changeInputForm('image', e.target.value)}/>
                        <button className="submitForm">submit</button>
                    </form>
                )
            }
        </div>)
    }

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

    if (userRole === 1) {
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

    if (userRole === 2) {
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

    if (userRole === 3) {
        return (
            <>
                <section className="store">
                    <div className="head">
                        <h1>Store</h1>
                        {addForm()}
                    </div>
                    <Filter />
                    {renderGoods('admin')}
                </section>
            </>
        );
    }

    return (
        <section className="store">
            <h1>Store</h1>
            {renderGoods('login')}
        </section>
    );
}