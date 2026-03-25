// // import { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { getGoods, addGood as apiAddGood } from "../api/goods.js";
// // import { getCategories } from "../api/categories.js";
// // import Card from "../components/Card/Card.jsx";
// // import { useStore } from '../store/useUserContext.jsx';
// // import NavigateTo from '../utils/navBtn.jsx'
// // import SearchIcon from '../assets/search.svg'
// // import Logotype from '../assets/logo.svg'

// // export default function Store() {
// //     const user = useStore((state) => state.user);
// //     const userRole = user?.roleID;
// //     const isInitialized = useStore((state) => state.isInitialized);
// //     const navigate = useNavigate();

// //     const [searchQuery, setSearchQuery] = useState('');
// //     const [originalGoods, setOriginalGoods] = useState([]);
// //     const [categories, setCategories] = useState([]); 
// //     const [sortOrder, setSortOrder] = useState('original');
// //     const [showForm, setShowForm] = useState(false);
// //     const [showFormStaff, setShowFormStaff] = useState(false);
// //     const [formAdd, setFormAdd] = useState({
// //         title: '',
// //         description: '',
// //         price: '',
// //         image: ''
// //     });
// //     const [formStaff, setFormStaff] = useState({
// //         login: '',
// //         emil: '',
// //         password: ''
// //     });

// //     const loadGoods = async () => {
// //         try {
// //             const data = await getGoods();
// //             setOriginalGoods(data);
// //         } catch (error) {
// //             console.error('Error loading goods: ', error);
// //         }
// //     };

// //     const loadCategories = async () => {
// //         try {
// //             const data = await getCategories();
// //             setCategories(data);
// //         } catch (error) {
// //             console.error('Error loading categories: ', error);
// //         }
// //     };

// //     const refreshGoods = () => loadGoods();

// //     useEffect(() => {
// //         if (isInitialized) {
// //             loadGoods();
// //             loadCategories();
// //         }
// //     }, [isInitialized, userRole]);

// //     const filteredGoods = originalGoods.filter(good => {
// //         if (!searchQuery.trim()) return true;
// //         const lowerQuery = searchQuery.toLowerCase();
// //         const title = (good.title || '').toLowerCase();
// //         const description = (good.description || '').toLowerCase();
// //         return title.includes(lowerQuery) || description.includes(lowerQuery);
// //     });

// //     const displayGoods = sortOrder === 'alphabet'
// //         ? [...filteredGoods].sort((a, b) => a.title.localeCompare(b.title))
// //         : filteredGoods;

// //     const handleSortChange = (e) => {
// //         setSortOrder(e.target.value);
// //     };

// //     const handleSearchChange = (e) => {
// //         setSearchQuery(e.target.value);
// //     };

// //     const handleCategoryClick = (categoryId) => {
// //         navigate(`/categories/${categoryId}`);
// //     };

// //     const changeInputForm = (field, value) => {
// //         setFormAdd(prev => ({ ...prev, [field]: value }));
// //     };

// //     const changeInputFormStaff = (field, value) => {
// //         setFormStaff(prev => ({ ...prev, [field]: value }));
// //     };

// //     const handleAddGood = async () => {
// //         const payload = {
// //             title: formAdd.title || '',
// //             description: formAdd.description || '',
// //             price: Number(formAdd.price),
// //             image: formAdd.image || null
// //         };

// //         if (isNaN(payload.price)) {
// //             alert('The price must be a number');
// //             return;
// //         }
// //         try {
// //             await apiAddGood(payload);
// //             loadGoods();
// //             setShowForm(false);
// //             setFormAdd({ title: '', description: '', price: '', image: '' });
// //         } catch (error) {
// //             console.error('Error sending item: ', error);
// //         }
// //     };

// //     const handleAddStaff = () => {
// //         console.log("Data sent:", formStaff)
// //     }

// //     const clearForm = (type) => {
// //         if(type === 'staff') setFormStaff({ login: '', emil: '', password: '' });
// //         else if(type === 'goods') setFormAdd({ title: '', description: '', price: '', image: '' });
// //     }

// //     // const addForm = () => (
// //     //     <div className="formAdd">
// //     //         <button className="showForm" onClick={() => { setShowForm(!showForm); clearForm('goods'); }}>
// //     //             {showForm ? 'Hide and clear the form' : 'Add product'}
// //     //         </button>
// //     //         {showForm && (
// //     //             <form onSubmit={(e) => { e.preventDefault(); handleAddGood(); }} className="form formAddGoods">
// //     //                 <input type="text" value={formAdd.title} placeholder="title" onChange={(e) => changeInputForm('title', e.target.value)}/>
// //     //                 <input type="text" value={formAdd.description} placeholder="description" onChange={(e) => changeInputForm('description', e.target.value)}/>
// //     //                 <input type="text" value={formAdd.price} placeholder="price" onChange={(e) => changeInputForm('price', e.target.value)}/>
// //     //                 <input type="text" value={formAdd.image} placeholder="image link" onChange={(e) => changeInputForm('image', e.target.value)}/>
// //     //                 <button className="submitForm">submit</button>
// //     //             </form>
// //     //         )}
// //     //     </div>
// //     // );

// //     // const staffForm = () => (
// //     //     <div className="formAdd">
// //     //         <button className="showForm" onClick={() => { setShowFormStaff(!showFormStaff); clearForm('staff'); }}>
// //     //             {showFormStaff ? 'Hide and clear the form' : 'Add staff'}
// //     //         </button>
// //     //         {showFormStaff && (
// //     //             <form onSubmit={(e) => { e.preventDefault(); handleAddStaff(); }} className="form formAddGoods">
// //     //                 <input type="text" value={formStaff.login} placeholder="login" onChange={(e) => changeInputFormStaff('login', e.target.value)}/>
// //     //                 <input type="text" value={formStaff.emil || ''} placeholder="email" onChange={(e) => changeInputFormStaff('emil', e.target.value)}/>
// //     //                 <input type="text" value={formStaff.password} placeholder="password" onChange={(e) => changeInputFormStaff('password', e.target.value)}/>
// //     //                 <button className="submitForm">submit</button>
// //     //             </form>
// //     //         )}
// //     //     </div>
// //     // );

// //     const Filter = () => (
// //         <div className="filter">
// //             <h2>Filter</h2>
// //             <select value={sortOrder} onChange={handleSortChange}>
// //                 <option value="original">original</option>
// //                 <option value="alphabet">alphabet</option>
// //             </select>
// //         </div>
// //     );

// //     const CategoryNav = () => (
// //         <div className="category-nav">
// //             {categories.length > 0 ? (
// //                 categories.map(cat => (
// //                     <button
// //                         key={cat.id}
// //                         className="category-chip"
// //                         onClick={() => handleCategoryClick(cat.id)}
// //                         type="button"
// //                     >
// //                         {cat.name}
// //                     </button>
// //                 ))
// //             ) : (
// //                 <span className="no-categories">Loading categories...</span>
// //             )}
// //         </div>
// //     );

// //     const renderGoods = (type) => (
// //         <div className="container">
// //             {displayGoods.length > 0 ? (
// //                 displayGoods.map((good) => (
// //                     <Card
// //                         key={good.id}
// //                         id={good.id}
// //                         title={good.title}
// //                         desc={good.description}
// //                         price={good.price}
// //                         image={good.image}
// //                         images={good.images}
// //                         type={type}
// //                         isActive={good.isActive}
// //                         isInBasket={good.isInBasket}
// //                         refreshGoods={refreshGoods}
// //                         basketItemId={good.basketItemId}
// //                     />
// //                 ))
// //             ) : (
// //                 <p>{searchQuery ? 'Products not found' : 'No products'}</p>
// //             )}
// //         </div>
// //     );

// //     if (!isInitialized) {
// //         return (
// //             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
// //                 Loading...
// //             </div>
// //         );
// //     }

// //     if (userRole === 1) {
// //         return (
// //             <section className="store">
// //                 <div className="head">
// //                     <div className="controls">
// //                         <img className='logo' src={Logotype} alt="" />
// //                         <div className="controlsInput">
// //                             <img src={SearchIcon} alt="search"/>
// //                             <input
// //                                 type="search"
// //                                 className='search'
// //                                 value={searchQuery}
// //                                 onChange={handleSearchChange}
// //                                 placeholder="Search"
// //                             />
// //                         </div>
// //                     </div>
// //                     <div className="controllers">
// //                         <NavigateTo path="basket"/>
// //                         <NavigateTo path="orders"/>
// //                         <NavigateTo path="profile"/>
// //                     </div>
// //                 </div>
                
// //                 <CategoryNav />
                
// //                 {renderGoods('user')}
// //             </section>
// //         );
// //     }

// //     if (userRole === 2) {
// //         return (
// //             <section className="store">
// //                 <div className="head">
// //                     <div className="controls">
// //                         <img className='logo' src={Logotype} alt="" />
// //                         <div className="controlsInput">
// //                             <img src={SearchIcon} alt="search"/>
// //                             <input
// //                                 type="search"
// //                                 className='search'
// //                                 value={searchQuery}
// //                                 onChange={handleSearchChange}
// //                                 placeholder="Search"
// //                             />
// //                         </div>
// //                     </div>
// //                     <div className="controls">
// //                         <NavigateTo path="orders"/>
// //                         <NavigateTo path="profile"/>
// //                     </div>
// //                 </div>
                
// //                 <CategoryNav />
                
// //                 <Filter />
// //                 {renderGoods('manager')}
// //             </section>
// //         );
// //     }

// //     if (userRole === 3) {
// //         return (
// //             <section className="store">
// //                 <div className="head">
// //                     <div className="controls">
// //                     <img className='logo' src={Logotype} alt="" />
// //                         <div className="controlsInput">
// //                             <img src={SearchIcon} alt="search"/>
// //                             <input
// //                                 type="search"
// //                                 className='search'
// //                                 value={searchQuery}
// //                                 onChange={handleSearchChange}
// //                                 placeholder="Search"
// //                             />
// //                         </div>
// //                     </div>
// //                     <div className="controls">
// //                         <button 
// //                             className="btn-add-product"
// //                             onClick={() => navigate('/admin/products/add')}
// //                             type="button"
// //                         >
// //                             + Add Product
// //                         </button>
// //                         <NavigateTo path="staff"/>
// //                         <NavigateTo path="orders"/>
// //                         <NavigateTo path="categories"/>
// //                         <NavigateTo path="help"/>
// //                         <NavigateTo path="profile"/>
// //                     </div>
// //                 </div>
                
// //                 <CategoryNav />
                
// //                 <Filter />
// //                 {renderGoods('admin')}
// //             </section>
// //         );
// //     }

// //     return (
// //         <section className="store">
// //             <div className="head">
// //                 <div className="controls">
// //                     <img className='logo' src={Logotype} alt="" />
// //                     <div className="controlsInput">
// //                         <img src={SearchIcon} alt="search"/>
// //                         <input
// //                             type="search"
// //                             className='search'
// //                             value={searchQuery}
// //                             onChange={handleSearchChange}
// //                             placeholder="Search"
// //                         />
// //                     </div>
// //                 </div>
// //                 <div className="controls">
// //                     <NavigateTo path="register"/>
// //                     <NavigateTo path="login"/>
// //                 </div>
// //             </div>
            
// //             <CategoryNav />
            
// //             {renderGoods('login')}
// //         </section>
// //     );
// // }
// import { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getGoods } from "../../api/goods.js";
// import { getCategories } from "../../api/categories.js";
// import Card from "../../components/Card/Card.jsx";
// import { useStore } from '../../store/useUserContext.jsx';
// import styles from './Store.module.css';

// // Ассеты
// import SearchIcon from '../../assets/search.svg';
// import Logotype from '../../assets/logo.svg';

// export default function Store() {
//     const navigate = useNavigate();
//     const { user, isInitialized } = useStore();
//     const userRole = user?.roleID;

//     const [goods, setGoods] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [sortOrder, setSortOrder] = useState('original');

//     const hasToken = !!localStorage.getItem('token');

//     if (isInitialized && !user && hasToken) {
//         return <div className={styles.loader}>Загрузка профиля...</div>;
//     }

//     // Загрузка данных
//     const loadData = async () => {
//         try {
//             const [goodsData, catsData] = await Promise.all([getGoods(), getCategories()]);
//             setGoods(goodsData);
//             setCategories(catsData);
//         } catch (e) { 
//             console.error("Data loading error:", e); 
//         }
//     };

//     // ФИКС 1: Добавляем user в зависимости. 
//     // Теперь при входе в аккаунт данные перегрузятся автоматически под новую роль.
//     useEffect(() => {
//         if (isInitialized) {
//             loadData();
//         }
//     }, [isInitialized, user]); 

//     // ФИКС 2: Добавляем userRole в useMemo, чтобы сетка товаров 
//     // пересчитывалась сразу при смене прав доступа.
//     const processedGoods = useMemo(() => {
//         let result = goods.filter(item => 
//             item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             item.description?.toLowerCase().includes(searchQuery.toLowerCase())
//         );

//         if (sortOrder === 'alphabet') {
//             result.sort((a, b) => a.title.localeCompare(b.title));
//         }
//         return result;
//     }, [goods, searchQuery, sortOrder, userRole]);

//     if (!isInitialized) return <div className={styles.loader}>Loading...</div>;

//     // ФИКС 3: Если роль еще не определена, но мы ждем юзера, 
//     // можно вернуть пустой экран или лоадер, чтобы не мелькал "гость".
//     const getCardType = () => {
//         if (userRole === 3) return 'admin';
//         if (userRole === 2) return 'manager';
//         if (userRole === 1) return 'user';
//         return 'guest';
//     };

//     return (
//         <main className={styles.store}>
//             <header className={styles.store__header}>
//                 <div className={styles.store__topBar}>
//                     <img src={Logotype} alt="Logo" className={styles.store__logo} />
                    
//                     <div className={styles.store__searchWrapper}>
//                         <img src={SearchIcon} alt="" />
//                         <input 
//                             type="text" 
//                             placeholder="Поиск товаров..." 
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className={styles.store__searchInput}
//                         />
//                     </div>

//                     <nav className={styles.store__nav}>
//                         {userRole === 3 && (
//                             <>
//                                 <button onClick={() => navigate('/admin/products/add')} className={styles.store__btnPlus}>+ Товар</button>
//                                 <button onClick={() => navigate('/staff')} className={styles.store__btnAdmin}>Сотрудники</button>
//                                 <button onClick={() => navigate('/categories')} className={styles.store__btnAdmin}>Категории</button>
//                                 <button onClick={() => navigate('/help')} className={styles.store__btnAdmin}>Поддержка</button>
//                             </>
//                         )}

//                         {userRole === 2 && (
//                             <button onClick={() => navigate('/help')}>Поддержка</button>
//                         )}

//                         {userRole ? (
//                             <>
//                                 {userRole === 1 && <button onClick={() => navigate('/basket')}>Корзина</button>}
//                                 <button onClick={() => navigate('/orders')}>Заказы</button>
//                                 <button onClick={() => navigate('/profile')}>Профиль</button>
//                             </>
//                         ) : (
//                             <>
//                                 <button onClick={() => navigate('/login')}>Войти</button>
//                                 <button onClick={() => navigate('/register')}>Регистрация</button>
//                             </>
//                         )}
//                     </nav>
//                 </div>

//                 <div className={styles.store__subHeader}>
//                     <div className={styles.store__categories}>
//                         {categories.map(cat => (
//                             <button key={cat.id} onClick={() => navigate(`/categories/${cat.id}`)} className={styles.store__categoryChip}>
//                                 {cat.name}
//                             </button>
//                         ))}
//                     </div>
                    
//                     <div className={styles.store__filters}>
//                         <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
//                             <option value="original">По умолчанию</option>
//                             <option value="alphabet">По алфавиту</option>
//                         </select>
//                     </div>
//                 </div>
//             </header>

//             <section className={styles.store__content}>
//                 {processedGoods.length > 0 ? (
//                     <div className={styles.store__grid}>
//                         {processedGoods.map(item => (
//                             <Card 
//                                 key={item.id} 
//                                 {...item} 
//                                 type={getCardType()} 
//                                 refreshGoods={loadData}
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     <div className={styles.store__empty}>
//                         <h3>Ничего не найдено</h3>
//                         <p>Попробуйте изменить запрос</p>
//                     </div>
//                 )}
//             </section>
//         </main>
//     );
// }

import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useUserContext.jsx';
import { useStoreData } from '../../hooks/useStoreData.js';
import { useGoodsFilters } from '../../hooks/useGoodsFilters.js';
import Card from "../../components/Card/Card.jsx";
import styles from './Store.module.css';

import SearchIcon from '../../assets/search.svg';
import Logotype from '../../assets/logo.svg';

export default function Store() {
    const navigate = useNavigate();

    // ПОДПИСКА: Берем только то, что нужно. 
    // Изменение корзины (внутри user) теперь не вызовет ререндер всего Store!
    const userRole = useStore((state) => state.user?.roleID);
    const isInitialized = useStore((state) => state.isInitialized);
    
    const { goods, categories, isLoading, refresh } = useStoreData(isInitialized, userRole);
    const { 
        searchQuery, setSearchQuery, 
        sortOrder, setSortOrder, 
        filteredAndSortedGoods 
    } = useGoodsFilters(goods);

    const hasToken = !!localStorage.getItem('token');

    // 1. Предохранитель для авторизации
    if (isInitialized && !userRole && hasToken) return <div className={styles.loader}>Синхронизация...</div>;
    
    // 2. Лоадер только на ПЕРВУЮ загрузку. 
    // Если goods уже есть, при нажатии "в корзину" экран НЕ ТУХНЕТ.
    if (!isInitialized || (isLoading && goods.length === 0)) {
        return <div className={styles.loader}>Loading...</div>;
    }

    const getCardType = () => {
        if (userRole === 3) return 'admin';
        if (userRole === 2) return 'manager';
        if (userRole === 1) return 'user';
        return 'guest';
    };

    return (
        <main className={styles.store}>
            <header className={styles.store__header}>
                <div className={styles.store__topBar}>
                    <img src={Logotype} alt="Logo" className={styles.store__logo} />
                    
                    <div className={styles.store__searchWrapper}>
                        <img src={SearchIcon} alt="" />
                        <input 
                            type="text" 
                            placeholder="Поиск товаров..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.store__searchInput}
                        />
                    </div>

                    <nav className={styles.store__nav}>
                        {/* АДМИН */}
                        {userRole === 3 && (
                            <>
                                <button onClick={() => navigate('/admin/products/add')} className={styles.store__btnPlus}>+ Товар</button>
                                <button onClick={() => navigate('/staff')}>Сотрудники</button>
                                <button onClick={() => navigate('/categories')}>Категории</button>
                                <button onClick={() => navigate('/help')}>Поддержка</button>
                            </>
                        )}

                        {/* МЕНЕДЖЕР */}
                        {userRole === 2 && (
                            <button onClick={() => navigate('/help')}>Поддержка</button>
                        )}

                        {/* ЮЗЕР / ГОСТЬ */}
                        {userRole ? (
                            <>
                                {userRole === 1 && <button onClick={() => navigate('/basket')}>Корзина</button>}
                                <button onClick={() => navigate('/orders')}>Заказы</button>
                                <button onClick={() => navigate('/profile')}>Профиль</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => navigate('/login')}>Войти</button>
                                <button onClick={() => navigate('/register')}>Регистрация</button>
                            </>
                        )}
                    </nav>
                </div>

                <div className={styles.store__subHeader}>
                    <div className={styles.store__categories}>
                        {categories.map(cat => (
                            <button key={cat.id} onClick={() => navigate(`/categories/${cat.id}`)} className={styles.store__categoryChip}>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    
                    <div className={styles.store__filters}>
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="original">По умолчанию</option>
                            <option value="alphabet">По алфавиту</option>
                        </select>
                    </div>
                </div>
            </header>

            <section className={styles.store__content}>
                {/* Вместо того чтобы тушить экран, просто показываем индикатор поверх или ничего не меняем */}
                <div className={styles.store__grid}>
                    {filteredAndSortedGoods.map(item => (
                        <Card 
                            key={item.id} 
                            {...item} 
                            type={getCardType()} 
                            refreshGoods={refresh} 
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}