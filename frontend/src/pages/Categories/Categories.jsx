import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useUserContext.jsx';
import { useCategories } from '../../hooks/useCategories.js';
import * as api from '../../api/categories.js';
import { getGoods } from '../../api/goods.js';

import CategoryList from '../../components/Category/CategoryList';
import ClientCategoryView from '../../components/Category/ClientCategoryView';
import CategoryAdminForm from '../../components/Category/CategoryAdminForm';
import CategoryGoodsManager from '../../components/Category/CategoryGoodsManager';
import styles from './Categories.module.css';

export default function Categories() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useStore();
    const { categories, selectedCategory, categoryGoods, deleteCat, refresh } = useCategories(id);

    const [view, setView] = useState(id ? 'client' : 'list');
    const [allGoods, setAllGoods] = useState([]);
    const [localLoading, setLocalLoading] = useState(false);

    const isAdmin = user?.roleID === 3;
    const isManager = user?.roleID === 2;

    useEffect(() => {
        if (isAdmin || isManager) getGoods().then(setAllGoods).catch(console.error);
    }, [isAdmin, isManager]);

    const handleAddGood = async (goodId) => {
        try {
            await api.addGoodToCategory(Number(id), Number(goodId));
            await refresh();
        } catch (err) {
            console.error("Ошибка добавления:", err);
        }
    };

    const handleRemoveGood = async (goodId) => {
        try {
            await api.removeGoodFromCategory(Number(id), Number(goodId));
            await refresh();
        } catch (err) {
            console.error("Ошибка удаления:", err);
        }
    };

    const handleSave = async (formData) => {
        setLocalLoading(true);
        try {
            let catId = id;
            if (view === 'edit' && id) {
                await api.updateCategory(Number(id), { name: formData.name, description: formData.description });
            } else {
                const newCat = await api.addCategory({ name: formData.name, description: formData.description });
                catId = newCat.id;
            }

            const currentIds = categoryGoods.map(g => g.id);
            const newIds = formData.goodIds.map(Number);

            for (const gId of newIds) {
                if (!currentIds.includes(gId)) await api.addGoodToCategory(Number(catId), gId);
            }
            if (view === 'edit') {
                for (const gId of currentIds) {
                    if (!newIds.includes(gId)) await api.removeGoodFromCategory(Number(catId), gId);
                }
            }

            navigate('/categories');
            setView('list');
            await refresh();
        } catch (err) {
            alert("Ошибка сохранения: " + err.message);
        } finally { setLocalLoading(false); }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <button className='btn' onClick={() => navigate('/store')}>Главная</button>
                    <nav className={styles.nav}>
                        <button className='btn' onClick={() => navigate('/basket')}>Корзина</button>
                        <button className='btn' onClick={() => navigate('/orders')}>Заказы</button>
                        <button className='btn' onClick={() => navigate('/profile')}>Профиль</button>
                    </nav>
                </div>
            </header>
            <main className={styles.container}>
                <div className={styles.pageHead}>
                    <h1 className={styles.pageTitle}>
                        {view === 'list' ? 'Категории' : view === 'edit' ? 'Правка' : selectedCategory?.name || 'Категория'}
                    </h1>
                    <div className={styles.actions}>
                        {isAdmin && view === 'list' && <button className={styles.btnAdd} onClick={() => setView('form')}>+ Создать</button>}
                        {view !== 'list' && <button className={styles.btnBack} onClick={() => { navigate('/categories'); setView('list'); }}>← Назад</button>}
                    </div>
                </div>
                {view === 'list' && <CategoryList items={categories} isAdmin={isAdmin} isManager={isManager} onCategoryClick={(cid) => { navigate(`/categories/${cid}`); setView(isAdmin || isManager ? 'manager' : 'client'); }} onDelete={deleteCat} onEdit={(cat) => { navigate(`/categories/${cat.id}`); setView('edit'); }} />}
                {view === 'client' && selectedCategory && <ClientCategoryView category={selectedCategory} goods={categoryGoods} user={user} />}
                
                {(view === 'form' || view === 'edit') && isAdmin && (
                    <CategoryAdminForm initialData={view === 'edit' ? selectedCategory : null} allGoods={allGoods} loading={localLoading} onSubmit={handleSave} />
                )}

                {view === 'manager' && selectedCategory && (
                    <CategoryGoodsManager 
                        category={selectedCategory} 
                        categoryGoods={categoryGoods} 
                        allGoods={allGoods} 
                        onAdd={handleAddGood} 
                        onRemove={handleRemoveGood} 
                    />
                )}
            </main>
        </div>
    );
}