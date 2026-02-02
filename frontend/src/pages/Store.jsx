import { useState, useEffect } from 'react';
import { getGoods, addGood as apiAddGood } from "../api/goods.js";
// import { useNavigate } from 'react-router-dom';
import Card from "../components/Card.jsx";
import { useStore } from '../store/useUserContext.jsx';
import NavigateTo from '../utils/navBtn.jsx'

export default function Store() {
    // const navigate = useNavigate();
    const userRole = useStore((state) => state.user?.roleID);
    const [originalGoods, setOriginalGoods] = useState([]); 
    const [sortOrder, setSortOrder] = useState('original');
    const [showForm, setShowForm] = useState(false);
    const [showFormStaff, setShowFormStaff] = useState(false);
    const [formAdd, setFormAdd] = useState({
        title: '',
        description: '',
        price: '',
        image: ''
    });
    const [formStaff, setFormStaff] = useState({
        login: '',
        emil: '',
        password: ''
    });

    const loadGoods = async () => {
        try {
            const data = await getGoods();
            setOriginalGoods(data);
        } catch (error) {
            console.error('Error loading goods: ', error);
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

    const changeInputFormStaff = (field, value) => {
        setFormStaff(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddGood = async () => { 
        // console.log('Новый товар:', formAdd);
        const payload = {
            title: formAdd.title || '',
            description: formAdd.description || '',
            price: Number(formAdd.price),
            image: formAdd.image || null
        };
        
        if (isNaN(payload.price)) {
            alert('The price must be a number');
            return;
        }
        try {
            const resp = await apiAddGood(payload);
            console.log('Product added:', resp);
            loadGoods(); 
            setShowForm(false); 
            setFormAdd({});
        } catch (error) {
            console.error('Error sending item: ', error);
        }
    };

    const handleAddStaff = () => {
        console.log("Data sent:", formStaff)
    }
    
    const clearForm = (type) => {
        if(type === 'staff') {
            setFormStaff({}) 
        } else if(type === 'goods') {
            setFormAdd({}) 
        }
    }

// // В случае ошибки
//     navigate('/denied', { 
//         state: { status: 403, error: 'Access denied' } 
//     });

    const addForm = () => {
        return (
        <div className="formAdd">
            <button className="showForm" onClick={() => (setShowForm(!showForm), clearForm('goods'))}>{showForm ? 'Hide and clear the form' : 'Add product'}</button>
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

    const staffForm = () => {
        return (
            <div className="formAdd">
            <button className="showForm" onClick={() => (setShowFormStaff(!showFormStaff), clearForm('staff'))}>{showFormStaff ? 'Hide and clear the form' : 'Add staff'}</button>
            {
                showFormStaff && (
                    <form onSubmit={(e) => {e.preventDefault();handleAddStaff(); }} className="form formAddGoods">
                        <input type="text" value={formStaff.login || ''} placeholder="login" onChange={(e) => changeInputFormStaff('login', e.target.value)}/>
                        <input type="text" value={formStaff.email || ''} placeholder="email" onChange={(e) => changeInputFormStaff('email', e.target.value)}/>
                        <input type="text" value={formStaff.password || ''} placeholder="password" onChange={(e) => changeInputFormStaff('password', e.target.value)}/>
                        <button className="submitForm">submit</button>
                    </form>
                )
            }
        </div>
        )
    }

    const Filter = () => (
        <div className="filter">
            <h2>Filter</h2>
            <select value={sortOrder} onChange={handleSortChange}>
                <option value="original">original</option>
                <option value="alphabet">alphabet</option>
            </select>
        </div>
    );

    // const navigateTo = (path) => (
    //     <button className="nav" onClick={() => navigate(`/${path}`)}>
    //         {path}
    //     </button>
    // );

    const renderGoods = (type) => (
        <div className="container">
            {displayGoods.length > 0 ? (
                displayGoods.map((good) => (
                    <Card
                        key={good.id}
                        id={good.id}
                        title={good.title}
                        desc={good.description}
                        price={good.price}
                        image={good.image}
                        type={type}
                    />
                ))
                ) : (
                    <p>No products</p>
            )}
        </div>
    );

    if (userRole === 1) {
        return (
            <section className="store">
                <h1 className="head">
                < NavigateTo path="store"/>
                        <div className="controllers">
                            < NavigateTo path="basket"/>
                            < NavigateTo path="orders"/>
                            < NavigateTo path="logout"/>
                        </div>
                </h1>
                {renderGoods('user')}
            </section>
        );
    }

    if (userRole === 2) {
        return (
            <section className="store">
                <h1 className="head">
                < NavigateTo path="store"/>
                        <div className="controls">
                            < NavigateTo path="orders"/>
                            < NavigateTo path="logout"/>
                        </div>
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
                    < NavigateTo path="store"/>
                        <div className="controls">
                            {!showFormStaff && addForm()}
                            {!showForm && staffForm()}
                            < NavigateTo path="logout"/>
                        </div>
                    </div>
                    <Filter />
                    {renderGoods('admin')}
                </section>
            </>
        );
    }

    return (
        <section className="store">
            <div className="head">
            < NavigateTo path="store"/>
                <div className="controls">
                    < NavigateTo path="register"/>
                    < NavigateTo path="login"/>
                </div>
            </div>
            {renderGoods('login')}
        </section>
    );
}