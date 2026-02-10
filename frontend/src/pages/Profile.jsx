import NavigateTo from "../utils/navBtn"
export default function Profile () {

    return (
        <section className="profile">
            <div className="head">
                < NavigateTo path="profile"/>
                <div className="controls">
                    < NavigateTo path="store"/>
                    < NavigateTo path="basket"/>
                    < NavigateTo path="orders"/>
                    < NavigateTo path="logout"/>
                </div>
            </div>
            <aside className="info">
                <h1>Hello user!</h1>
                <div className="profile-info">
                    <p className="name">name: User1</p>
                    <p className="email">email: User1@email.ru</p>
                    <div className="controls">
                        <button className="change-info">change info</button>
                        <button className="change-pass">change password</button>
                    </div>
                </div>
            </aside>
            <aside className="saved">
                <h2>Your saved</h2>
                <div className="saved-cards">

                </div>
            </aside>
        </section>
    )
}