import { useLocation } from 'react-router-dom';
import NavigateTo from '../utils/navBtn'

export default function Denied() {
    const location = useLocation();
    const { status, error } = location.state || {};

    return (
        <div className="errorSec">
            <h2 className="status">{status}</h2>
            <p className="errorInfo">{error}</p>
            <NavigateTo path={'login'}/>
        </div>
    );
}