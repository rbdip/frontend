// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { loginUserApi, registerUserApi } from '../api/projectApi';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
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

    /**
     * Если loginUserApi вернёт false => значит 401 => выбросим ошибку
     * Если true => doLogin(...)
     */
    async function login({ user, pass }) {
        const success = await loginUserApi(user, pass);
        if (!success) {
            throw new Error('Неверный логин или пароль');
        }
        doLogin(user, pass);
    }

    async function register({ user, pass, displayName }) {
        const success = await registerUserApi(user, pass, displayName);
        if (!success) {
            throw new Error('Ошибка регистрации или 401');
        }
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
