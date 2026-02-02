import BasketCard from '../components/BasketCard.jsx'
import NavigateTo from '../utils/navBtn.jsx'
const testData = [
    {
        id: 1,
        image: "https://i.ibb.co/qLhFKfGv/watch-10-46-rose-gold-light-blush-band-1-1000x1000.jpg",
        title: 'test',
        description: 'desc test good',
        price: 3000,
        quantity: 5,
    },
    {
        id: 2,
        image: "https://i.ibb.co/qLhFKfGv/watch-10-46-rose-gold-light-blush-band-1-1000x1000.jpg",
        title: 'test1',
        description: 'desc test good2',
        price: 100,
        quantity: 3,
    },
    {
        id: 3,
        image: "https://i.ibb.co/qLhFKfGv/watch-10-46-rose-gold-light-blush-band-1-1000x1000.jpg",
        title: 'test21',
        description: 'desc te213st good2',
        price: 56600,
        quantity: 10,
    },
]

export default function Basket () {
    const orderBlock = () => {
        const totalPrise = 10000;
        const totalCount = 5;
        return (
            <div className="sectionOrder">
                <p className="totalCount">{`Общее количество товаров: ${totalCount}`}</p>
                <p className="totalSum">{`Общая сумма: ${totalPrise}`}</p>
                <NavigateTo path={'orders'}/>
            </div>
        )
    }

    const renderBasketBody = (type) => {
        if (type === "user") {
            return (
                <div className="containerColumn">
                    {testData.length > 0 ? (
                        <>
                            {testData.map((good) => (
                                <BasketCard
                                    key={good.id}
                                    id={good.id}
                                    title={good.title}
                                    desc={good.description}
                                    price={good.price}
                                    image={good.image}
                                    type={type}
                                    quantity={good.quantity}
                                />
                            ))}
                            {orderBlock()}
                        </>
                    ) : (
                        <p>No products in basket</p>        
                    )}
                </div>
            )
        }
        return null;
    }

    return (
        <section className="basket">
            <h1 className="head">
                < NavigateTo path="basket"/>
                <div className="controllers">
                    < NavigateTo path="store"/>
                    < NavigateTo path="orders"/>
                    < NavigateTo path="logout"/>
                </div>
            </h1>
            {renderBasketBody('user')}
        </section>
    )
}