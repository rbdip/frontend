// src/components/Header/HeaderView.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import './Header.css';

function HeaderView({ username, isAuthenticated, onLogout }) {
    return (
        <AppBar position="static" className="header-appbar">
            <Toolbar className="header-toolbar">
                <Typography variant="h6" className="header-title">
                    Web Services Store
                </Typography>

                {isAuthenticated ? (
                    <>
                        <Button color="inherit" component={Link} to="/dashboard">
                            Личный кабинет
                        </Button>
                        <Button color="inherit" component={Link} to="/catalog">
                            Каталог
                        </Button>
                        <Button color="inherit" onClick={onLogout}>
                            Выйти
                        </Button>
                        <Typography variant="body1" className="header-username">
                            Пользователь: {username}
                        </Typography>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login">
                            Войти
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Регистрация
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default HeaderView;
