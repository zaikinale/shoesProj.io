import { useNavigate } from "react-router";

// eslint-disable-next-line react/prop-types
export default function NavigateTo ({path}) {
    const navigate = useNavigate();
    return (
        <button className="btn" onClick={() => navigate(`/${path}`)}>
            {path}
        </button>
    )
};