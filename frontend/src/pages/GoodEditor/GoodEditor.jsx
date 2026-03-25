import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGoodEditor } from '../../hooks/useGoodEditor.js';
import NavigateTo from '../../utils/navBtn.jsx';
import styles from './GoodEditor.module.css';

export default function GoodEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { good, setGood, categories, loading, isEditMode, save } = useGoodEditor(id);
    
    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    const [categorySearch, setCategorySearch] = useState('');

    if (loading || !good) return <div className={styles.loader}>Загрузка редактора...</div>;

    const handleChange = (field, value) => setGood(prev => ({ ...prev, [field]: value }));

    const toggleCategory = (catId) => {
        const currentIds = Array.isArray(good.categoryIds) ? good.categoryIds : [];
        const isSelected = currentIds.some(id => String(id) === String(catId));
        
        const nextIds = isSelected
            ? currentIds.filter(id => String(id) !== String(catId))
            : [...currentIds, Number(catId)];
            
        handleChange('categoryIds', nextIds);
    };

    const handleSave = async () => {
        if (!good.title?.trim() || !good.price) return alert('Заполните название и цену');

        const payload = {
            title: good.title.trim(),
            description: good.description?.trim() || '',
            price: Number(good.price),
            image: good.image?.trim() || null,
            isActive: Boolean(good.isActive),
            categoryIds: (good.categoryIds || []).map(id => Number(id)),
            images: (good.images || []).map(img => ({
                url: img.url.trim(),
                isMain: !!img.isMain
            }))
        };

        try {
            await save(payload);
            navigate('/store');
        } catch (err) {
            alert('Ошибка при сохранении');
            console.log(err)
        }
    };

    const filteredCats = categories.filter(c => 
        c.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.navGroup}>
                        <NavigateTo path="store" />
                        <span className={styles.breadcrumb}>/ {isEditMode ? 'Редактирование' : 'Новый товар'}</span>
                    </div>
                    <div className={styles.actions}>
                        <button type="button" className={styles.btnCancel} onClick={() => navigate('/store')}>Отмена</button>
                        <button type="button" className={styles.btnSave} onClick={handleSave}>
                            {isEditMode ? 'Обновить' : 'Создать'}
                        </button>
                    </div>
                </div>
            </header>

            <main className={styles.container}>
                <div className={styles.grid}>
                    <section className={styles.visualSection}>
                        <div className={styles.mainImageCard}>
                            <h3>Главное изображение</h3>
                            <div className={styles.previewBox}>
                                {good.image ? (
                                    <img src={good.image} alt="Preview" />
                                ) : (
                                    <div className={styles.placeholder}>Нет изображения</div>
                                )}
                            </div>
                            <input 
                                type="url" 
                                placeholder="Вставьте прямую ссылку на фото..." 
                                value={good.image || ''} 
                                onChange={(e) => handleChange('image', e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.galleryCard}>
                            <h3>Галерея</h3>
                            <div className={styles.galleryGrid}>
                                {(good.images || []).map((img, idx) => (
                                    <div key={idx} className={styles.galleryItem}>
                                        <img src={img.url} alt="Gallery" />
                                        <button type="button" onClick={() => {
                                            const next = good.images.filter((_, i) => i !== idx);
                                            handleChange('images', next);
                                        }}>×</button>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.addGallery}>
                                <input 
                                    type="url" 
                                    placeholder="Добавить фото в галерею..." 
                                    value={newGalleryUrl} 
                                    onChange={(e) => setNewGalleryUrl(e.target.value)} 
                                />
                                <button type="button" onClick={() => {
                                    if(newGalleryUrl.trim()) {
                                        handleChange('images', [...(good.images || []), { url: newGalleryUrl.trim(), isMain: false }]);
                                        setNewGalleryUrl('');
                                    }
                                }}>+</button>
                            </div>
                        </div>
                    </section>

                    <section className={styles.dataSection}>
                        <div className={styles.card}>
                            <h3>Основная информация</h3>
                            <input 
                                type="text" 
                                className={styles.titleInput} 
                                placeholder="Название товара..." 
                                value={good.title || ''} 
                                onChange={(e) => handleChange('title', e.target.value)}
                            />
                            
                            <textarea 
                                className={styles.descInput} 
                                placeholder="Описание..." 
                                value={good.description || ''} 
                                onChange={(e) => handleChange('description', e.target.value)}
                            />

                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Цена (₽)</label>
                                    <input 
                                        type="number" 
                                        value={good.price || ''} 
                                        onChange={(e) => handleChange('price', e.target.value)} 
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Статус</label>
                                    <select 
                                        value={String(good.isActive)} 
                                        onChange={(e) => handleChange('isActive', e.target.value === 'true')}
                                    >
                                        <option value="true">Активен</option>
                                        <option value="false">Скрыт</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h3>Категории</h3>
                            <input 
                                type="text" 
                                className={styles.searchInput} 
                                placeholder="Поиск категорий..." 
                                value={categorySearch} 
                                onChange={(e) => setCategorySearch(e.target.value)}
                            />
                            <div className={styles.catGrid}>
                                {filteredCats.map(cat => {
                                    const isSelected = (good.categoryIds || []).some(id => String(id) === String(cat.id));
                                    return (
                                        <button 
                                            key={cat.id} 
                                            type="button"
                                            className={`${styles.catChip} ${isSelected ? styles.activeCat : ''}`}
                                            onClick={() => toggleCategory(cat.id)}
                                        >
                                            {cat.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}