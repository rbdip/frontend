// src/components/Header/HeaderContainer.jsx
import 'react';
import HeaderView from './HeaderView';
import { useAuth } from '../../context/AuthContext';

function HeaderContainer() {
    const { username, isAuthenticated, logout } = useAuth();

    return (
        <HeaderView
            username={username}
            isAuthenticated={isAuthenticated}
            onLogout={logout}
        />
    );
}

export default HeaderContainer;
