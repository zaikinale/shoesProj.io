import { useNavigate } from "react-router";

export default function NavigateTo ({path}) {
    const navigate = useNavigate();
    return (
        <button className="nav" onClick={() => navigate(`/${path}`)}>
            {path}
        </button>
    )
};