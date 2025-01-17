// src/pages/ServiceForm/ServiceFormPageContainer.jsx
import 'react';
import { useForm } from 'react-hook-form';
import { createProject } from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ServiceFormPageView from './ServiceFormPageView';

function ServiceFormPageContainer({ onNotify }) {
    const { username, password } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            await createProject({ username, password }, data);
            onNotify('Проект успешно создан!', 'success');
            navigate('/catalog');
        } catch (error) {
            onNotify(`Ошибка при создании проекта: ${error.message}`, 'error');
        }
    };

    return (
        <ServiceFormPageView
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
        />
    );
}

export default ServiceFormPageContainer;
