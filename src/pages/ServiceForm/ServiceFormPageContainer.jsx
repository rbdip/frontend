// src/pages/ServiceForm/ServiceFormPageContainer.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    getProjectByNameApi,
    createProjectApi,
    updateProjectApi,
} from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import ServiceFormPageView from './ServiceFormPageView';

function ServiceFormPageContainer({ onNotify, editMode = false }) {
    const { username, password } = useAuth();
    const navigate = useNavigate();
    const { username: authorUsername, projectName } = useParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const [loading, setLoading] = useState(false);

    // Если editMode, грузим данные проекта, чтобы заполнить форму
    useEffect(() => {
        if (editMode && authorUsername && projectName) {
            let mounted = true;
            (async () => {
                try {
                    setLoading(true);
                    const data = await getProjectByNameApi(username, password, authorUsername, projectName);
                    if (mounted && data) {
                        // Выставляем значения (title, name, description, display_version?)
                        // Но формат PATCH: { project_name, title, version_name, description }
                        // Если хотим дать пользователю менять project_name -> отдельное поле
                        reset({
                            title: data.title || '',
                            project_name: data.project_name || '',
                            display_version: data.display_version || '',
                            description: data.description || '',
                        });
                    }
                } catch (error) {
                    onNotify(`Ошибка: ${error.message}`, 'error');
                } finally {
                    if (mounted) setLoading(false);
                }
            })();
            return () => {
                mounted = false;
            };
        }
    }, [editMode, authorUsername, projectName, username, password, reset, onNotify]);

    const onSubmit = async (formData) => {
        try {
            if (editMode) {
                const updated = await updateProjectApi(
                    username,
                    password,
                    authorUsername,
                    projectName,
                    formData
                );
                onNotify('Сервис обновлён!', 'success');
                // Можем перейти на просмотр
                navigate(`/service/${updated.author.username}/${updated.name}`);
            } else {
                // POST (создать)
                const created = await createProjectApi(username, password, formData);
                onNotify('Сервис создан!', 'success');
                navigate(`/service/${created.author.username}/${created.name}`);
            }
        } catch (error) {
            onNotify(`Ошибка: ${error.message}`, 'error');
        }
    };

    return (
        <ServiceFormPageView
            editMode={editMode}
            loading={loading}
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
        />
    );
}

export default ServiceFormPageContainer;
