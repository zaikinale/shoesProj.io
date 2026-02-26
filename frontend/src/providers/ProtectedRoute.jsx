import { useStore } from '../store/useUserContext.jsx';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const user = useStore((state) => state.user);

    if (!user) {
        return (
            <Navigate 
                to="/denied" 
                state={{ status: 403, error: 'Access Denied: Authorization Required' }} 
                replace 
            />
        );
    }
    return children;
};

export { ProtectedRoute }