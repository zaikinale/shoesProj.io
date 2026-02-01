import BasketCard from '../components/BasketCard.jsx'
import NavigateTo from '../utils/navBtn.jsx'
const testData = [
    {
        id: 1,
        image: '',
        title: 'test',
        description: 'desc test good',
        price: 3000,
        quantity: 5,
    },
    {
        id: 2,
        image: '',
        title: 'test1',
        description: 'desc test good2',
        price: 100,
        quantity: 3,
    },
    {
        id: 3,
        image: '',
        title: 'test21',
        description: 'desc te213st good2',
        price: 56600,
        quantity: 10,
    },
]

export default function Basket () {
    const orderBlock = () => {
        return (
            <div className="container">
                <button className="order">Order</button>
                <p className="totalSum">500</p>
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
                <span>Store</span>
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