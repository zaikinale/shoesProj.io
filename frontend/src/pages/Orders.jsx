import OrderList from '../components/OrderList.jsx'
import NavigateTo from '../utils/navBtn.jsx'

const testData = [
    {
        id: 1,
        date: '23-11-2010',
        status: 'Доставлен',
        basket: [
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
    },
    {
        id: 21,
        date: '26-10-2010',
        status: 'В сборке',
        basket: [
            {
                id: 7,
                image: "https://i.ibb.co/qLhFKfGv/watch-10-46-rose-gold-light-blush-band-1-1000x1000.jpg",
                title: 'test',
                description: 'desc test good',
                price: 3000,
                quantity: 5,
            },
            {
                id: 8,
                image: "https://i.ibb.co/qLhFKfGv/watch-10-46-rose-gold-light-blush-band-1-1000x1000.jpg",
                title: 'test1',
                description: 'desc test good2',
                price: 100,
                quantity: 3,
            },
            {
                id: 9,
                image: "https://i.ibb.co/qLhFKfGv/watch-10-46-rose-gold-light-blush-band-1-1000x1000.jpg",
                title: 'test21',
                description: 'desc te213st good2',
                price: 56600,
                quantity: 10,
            },
        ]
    }
]

export default function Orders () {

    const renderOrdersBody = (type) => {
        if (type === "user") {
            return (
                <div className="containerColumn">
                    {testData.length > 0 ? (
                        testData.map((order) => (
                            <OrderList
                                key={order.id}
                                id={order.id}
                                data={order.date}
                                status={order.status}
                                list={order.basket}
                            />
                        ))
                    ) : (
                        <p>No orders found</p>        
                    )}
                </div>
            )
        }
        return null;
    }

    return (
        <section className="basket">
            <h1 className="head">
                < NavigateTo path="orders"/>
                <div className="controllers">
                    <NavigateTo path="store"/>
                    <NavigateTo path="basket"/>
                    <NavigateTo path="logout"/>
                </div>
            </h1>
            {renderOrdersBody('user')}
        </section>
    )
}