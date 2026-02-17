import {useParams} from "react-router-dom";
import NavigateTo from "../utils/navBtn.jsx";
import {useStore} from "../store/useUserContext.jsx";

export default function Order() {
    const userRole = useStore((state) => state.user?.roleID);
    const { id } = useParams();

    return (
        <section className="basket">
            <div className="head">
                <NavigateTo path="orders"/>
                <div className="controllers">
                    <NavigateTo path="store"/>
                    {userRole !== 2 && userRole !== 3 && <NavigateTo path="basket"/>}
                    <NavigateTo path="profile"/>
                </div>
            </div>
            <div className="body">
                <p className="">its page for order {id}</p>
            </div>
        </section>
    )

}