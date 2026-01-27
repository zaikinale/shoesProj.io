import { useState } from "react"
import { deleteGood, updateGood } from '../api/goods.js'

export default function Card ({id, title, desc, price, image, type}) {
    const [isChange, setIsChange] = useState(false);
    const [form, setForm] = useState({
        title: title,
        description: desc,
        price: price,
        image: image
    })

    const handleChange = () => {
        setIsChange(!isChange);
    }

    const handleСancellation = () => {
        setForm({
            title: title,
            description: desc,
            price: price,
            image: image
        })
        handleChange()
    }

    const handleDelete = async () => {
        try {
            const resp = await deleteGood(id);
            console.log('Товар удален:', resp);
            // loadGoods(); 
            // setShowForm(false); 
            // setFormAdd({});
        } catch (error) {
            console.error('Ошибка удаления товара:', error);
        }
    }

    const handleSaveChanges = async () => {
        const payload = {
            title: form.title || '',
            description: form.description || '',
            price: Number(form.price),
            image: form.image || null
        };
        
        if (isNaN(payload.price)) {
            alert('Цена должна быть числом');
            return;
        }

        try {
            const resp = await updateGood(id, payload);
            console.log('Товар изменен:', resp);
            handleChange()
        } catch (error) {
            console.error('Ошибка изменения товара:', error);
        }
    }

    const changeInputForm = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (type ==="user") {
        return (
            <div className="card">
                <img className="img" src={image} alt={title} />
                <h3 className="title">{title}</h3>
                <p className="desc">{desc}</p>
                <span className="price">{`${price} ₽`}</span>
                <button className="add">Добавить товар</button>
            </div>
        )
    } else if (type ==="manager") {
        return (
            <div className="card">
                <img className="img" src={image} alt={title} />
                <h3 className="title">{title}</h3>
                <p className="desc">{desc}</p>
                <span className="price">{`${price} ₽`}</span>
                <button className="add">Добавить товар</button>
            </div>
        )
    } else if (type ==="admin") {
        return (
            <div className="card">
                

                { isChange ? ( 
                    <>
                        <input type="text" value={form.title || ''} placeholder="title" onChange={(e) => changeInputForm('title', e.target.value)}/>
                        <input type="text" value={form.description || ''} placeholder="description" onChange={(e) => changeInputForm('description', e.target.value)}/>
                        <input type="text" value={form.price || ''} placeholder="price" onChange={(e) => changeInputForm('price', e.target.value)}/>
                        <input type="text" value={form.image || ''} placeholder="image link" onChange={(e) => changeInputForm('image', e.target.value)}/>
                        <button className="submitForm" onClick={handleSaveChanges}>submit changes</button>
                    </>

                ) : (
                    <>
                        <img className="img" src={image} alt={title} />
                        <h3 className="title">{form.title}</h3>
                        <p className="desc">{form.description}</p>
                        <span className="price">{`${form.price} ₽`}</span>
                    </>
                    
                )

                }
                <button className="change" onClick={handleChange}>{isChange ? 'Скрыть форму' : 'Изменить товар'}</button>
                <button className="add" onClick={isChange ? handleСancellation : handleDelete}>{ isChange ? 'Отменить изменения':'Удалить товар'}</button>
            </div>
        )   
    } else {
        return (
            <div className="card">
                <img className="img" src={image} alt={title} />
                <h3 className="title">{title}</h3>
                <p className="desc">{desc}</p>
                <span className="price">{`${price} ₽`}</span>
            </div>
        )
    }
    
}