// src/pages/Login/LoginPageView.jsx
import 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import './LoginPage.css';

function LoginPageView({ onSubmit, register, errors }) {
    return (
        <Container maxWidth="sm" className="login-container">
            <Box className="login-box">
                <Typography variant="h5" gutterBottom>
                    Вход (Basic Auth)
                </Typography>
                <form onSubmit={onSubmit} className="login-form">
                    <TextField
                        label="Логин"
                        fullWidth
                        margin="normal"
                        {...register('username', { required: 'Введите логин' })}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                    />
                    <TextField
                        label="Пароль"
                        type="password"
                        fullWidth
                        margin="normal"
                        {...register('password', { required: 'Введите пароль' })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <Button variant="contained" type="submit" className="login-button">
                        Войти
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default LoginPageView;
