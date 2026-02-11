import { useState, useEffect } from "react"
import { Link } from "react-router";
import { deleteGood, updateGood } from '../api/goods.js'
import { addGood as addToBasket, deleteGood as deleteFromBasket } from "../api/basket.js";
import { checkIfSaved, removeSavedGood, saveGood } from '../api/saves.js'
import BookMarkActive from '../assets/bookmark_active.svg'
import BookMarkUnActive from '../assets/bookmark_unactive.svg'

// eslint-disable-next-line react/prop-types
export default function Card ({id, title, desc, price, image, type, isInBasket, refreshGoods, basketItemId}) {
    const [inBasket, setInBasket] = useState(isInBasket);
    const [isChange, setIsChange] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [form, setForm] = useState({
        title: title,
        description: desc,
        price: price,
        image: image
    })

    const loadGoods = async () => {
        try {
            const resp = await checkIfSaved(id);
            setIsSave(resp)
        } catch (error) {
            console.error('Error loading is save status good: ', error);
        }
    };
    
    
    useEffect(() => {
        loadGoods();
    }, []);

    const handleAddSaveGood = async() => {
        try {
            await saveGood(id);
            loadGoods()
        } catch (error) {
            console.error('Error fetch add good save: ', error);
        }
    }

    const handleRemoveSaveGood = async() => {
        try {
            await removeSavedGood(id);
            loadGoods()
        } catch (error) {
            console.error('Error fetch delete good save: ', error);
        }
    }


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
        refreshGoods()
    }

    const handleDelete = async () => {
        try {
            const resp = await deleteGood(id);
            console.log('Product removed: ', resp);
            refreshGoods()
        } catch (error) {
            console.error('Product deletion error: ', error);
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
            alert('The price must be a number');
            return;
        }

        try {
            const resp = await updateGood(id, payload);
            console.log('Product changed:', resp);
            handleChange()
            refreshGoods()
        } catch (error) {
            console.error('Product change error: ', error);
        }
    }

    const handleAddToBasket = async () => {
        try {
            await addToBasket(id);
            setInBasket(true);
            console.log('Added to basket');
            refreshGoods()
        } catch (error) {
            console.error('Add to basket error:', error);
        }
    };

    const handleRemoveFromBasket = async () => {
        try {
            await deleteFromBasket(basketItemId);
            setInBasket(false);
            console.log('Removed from basket');
            refreshGoods()
        } catch (error) {
            console.error('Remove from basket error:', error);
        }
    };

    const changeInputForm = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (type ==="user") {
        return (
            <div className="card">
                <button className="saveBtn saveBtnPos" onClick={isSave ? handleRemoveSaveGood : handleAddSaveGood }>
                    <img src={isSave ? BookMarkActive : BookMarkUnActive } alt={isSave ? 'Delete' : 'Save' }  />
                </button>
                <Link to={`/good/${id}`}>{
                    <>
                    <img className="img" src={image} alt={title} />
                    <h3 className="title">{title}</h3>
                    <p className="desc">{desc}</p>
                    <span className="price">{`${price} ₽`}</span>
                    </>
                }</Link>
                {inBasket ? (
                    <button 
                        className="remove-basket" 
                        onClick={handleRemoveFromBasket}
                    >
                        Delete from basket
                    </button>
                ) : (
                    <button 
                        className="add-basket" 
                        onClick={handleAddToBasket}
                    >
                        Add in basket
                    </button>
                )}
            </div>
        )
    } else if (type ==="manager") {
        return (
            <div className="card">
                <Link to={`/good/${id}`}>{
                    <>
                        <img className="img" src={image} alt={title} />
                        <h3 className="title">{title}</h3>
                        <p className="desc">{desc}</p>
                        <span className="price">{`${price} ₽`}</span>
                    </>
                }</Link>
                {inBasket ? (
                    <button 
                        className="remove-basket" 
                        onClick={handleRemoveFromBasket}
                    >
                        Delete from basket
                    </button>
                ) : (
                    <button 
                        className="add-basket" 
                        onClick={handleAddToBasket}
                    >
                        Add in basket
                    </button>
                )}
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
                        <Link to={`/good/${id}`}>{
                            <>
                                <img className="img" src={image} alt={title} />
                                <h3 className="title">{title}</h3>
                                <p className="desc">{desc}</p>
                                <span className="price">{`${price} ₽`}</span>
                            </>
                        }</Link>
                    </>
                    
                )

                }
                <button className="change" onClick={handleChange}>{isChange ? 'Hide form' : 'Change product'}</button>
                <button className="add" onClick={isChange ? handleСancellation : handleDelete}>{ isChange ? 'Cancel changes':'Remove product'}</button>
            </div>
        )   
    } else {
        return (
            <div className="card">
                <Link to={`/good/${id}`}>{
                    <>
                        <img className="img" src={image} alt={title} />
                        <h3 className="title">{title}</h3>
                        <p className="desc">{desc}</p>
                        <span className="price">{`${price} ₽`}</span>
                    </>
                }</Link>
            </div>
        )
    }
    
}