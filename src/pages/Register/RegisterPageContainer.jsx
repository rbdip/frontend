// src/pages/Register/RegisterPageContainer.jsx
import 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RegisterPageView from './RegisterPageView';

function RegisterPageContainer({ onNotify }) {
    const { register: registerAction } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            await registerAction({ user: data.username, pass: data.password });
            onNotify('Регистрация (заглушка) успешно!', 'success');
            navigate('/dashboard');
        } catch (error) {
            onNotify(`Ошибка: ${error.message}`, 'error');
        }
    };

    return (
        <RegisterPageView
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
        />
    );
}

export default RegisterPageContainer;
