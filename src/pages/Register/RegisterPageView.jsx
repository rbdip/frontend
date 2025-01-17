// src/pages/Register/RegisterPageView.jsx
import 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
} from '@mui/material';
import './RegisterPage.css';

function RegisterPageView({ onSubmit, register, errors }) {
    return (
        <Container maxWidth="sm" className="register-container">
            <Box className="register-box">
                <Typography variant="h5" gutterBottom>
                    Регистрация
                </Typography>
                <form onSubmit={onSubmit} className="register-form">
                    <TextField
                        label="Логин (username)"
                        fullWidth
                        margin="normal"
                        {...register('username', { required: 'Укажите логин' })}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                    />
                    <TextField
                        label="Пароль"
                        type="password"
                        fullWidth
                        margin="normal"
                        {...register('password', { required: 'Укажите пароль' })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <TextField
                        label="Отображаемое имя (необязательно)"
                        fullWidth
                        margin="normal"
                        {...register('display_name')}
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
