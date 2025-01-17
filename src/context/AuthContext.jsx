// src/context/AuthContext.jsx
import  { createContext, useContext, useEffect, useState } from 'react';
import { checkCredentials } from '../api/projectApi';

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('authUser');
        const storedPass = localStorage.getItem('authPass');
        if (storedUser && storedPass) {
            setUsername(storedUser);
            setPassword(storedPass);
            setIsAuthenticated(true);
        }
    }, []);

    function doLogin(user, pass) {
        localStorage.setItem('authUser', user);
        localStorage.setItem('authPass', pass);
        setUsername(user);
        setPassword(pass);
        setIsAuthenticated(true);
    }

    function doLogout() {
        localStorage.removeItem('authUser');
        localStorage.removeItem('authPass');
        setUsername(null);
        setPassword(null);
        setIsAuthenticated(false);
    }

    async function login({ user, pass }) {
        // Проверяем пару (логин, пароль) через любой доступный эндпоинт
        await checkCredentials({ username: user, password: pass });
        doLogin(user, pass);
    }

    async function register({ user, pass }) {
        // Заглушка регистрации (нет реального эндпоинта)
        doLogin(user, pass);
    }

    const value = {
        username,
        password,
        isAuthenticated,
        login,
        register,
        logout: doLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
