// src/components/ProtectedRoute.jsx
import 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Если не авторизован, только тогда редиректим
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute;
