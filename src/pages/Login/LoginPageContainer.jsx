// src/pages/Login/LoginPageContainer.jsx
import 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginPageView from './LoginPageView';

function LoginPageContainer({ onNotify }) {
    const { login } = useAuth();
    const navigate = useNavigate();

    // Логика (useForm)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Отправка формы
    const onSubmit = async (data) => {
        try {
            await login({ user: data.username, pass: data.password });
            onNotify('Успешная авторизация!', 'success');
            navigate('/dashboard');
        } catch (error) {
            onNotify(`Ошибка: ${error.message}`, 'error');
        }
    };

    // Передаём нужные пропсы во View
    return (
        <LoginPageView
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
        />
    );
}

export default LoginPageContainer;
