// src/pages/Register/RegisterPageView.jsx
import 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import './RegisterPage.css';

function RegisterPageView({ onSubmit, register, errors }) {
    return (
        <Container maxWidth="sm" className="register-container">
            <Box className="register-box">
                <Typography variant="h5" gutterBottom>
                    Регистрация (заглушка)
                </Typography>

                <form onSubmit={onSubmit} className="register-form">
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

                    <Button variant="contained" type="submit" className="register-button">
                        Зарегистрироваться
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default RegisterPageView;
