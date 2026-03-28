import { useNavigate } from "react-router";

export default function NavigateTo ({path}) {
    const navigate = useNavigate();
    return (
        <button className="btn" onClick={() => navigate(`/${path}`)}>
            {path}
        </button>
    )
};