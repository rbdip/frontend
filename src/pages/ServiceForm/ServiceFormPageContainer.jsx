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
    const { username: initialAuthorUsername, projectName: initialProjectName } = useParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [authorUsername, setAuthorUsername] = useState(initialAuthorUsername);
    const [projectName, setProjectName] = useState(initialProjectName);

    // Если editMode, загружаем данные проекта для заполнения формы
    useEffect(() => {
        if (editMode && authorUsername && projectName) {
            let mounted = true;
            (async () => {
                try {
                    setLoading(true);
                    const data = await getProjectByNameApi(username, password, authorUsername, projectName);
                    if (mounted && data) {
                        reset({
                            title: data.title || '',
                            name: data.name || '',
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
                // Обновляем проект
                const updated = await updateProjectApi(
                    username,
                    password,
                    authorUsername,
                    projectName,
                    formData
                );
                onNotify('Сервис обновлён!', 'success');

                // Обновляем параметры маршрута
                const newAuthorUsername = updated.author.username;
                const newProjectName = updated.name;
                setAuthorUsername(newAuthorUsername);
                setProjectName(newProjectName);

                // Перенаправляем на новый адрес с заменой истории
                navigate(`/service/${newAuthorUsername}/${newProjectName}`, { replace: true });
            } else {
                // Создаём проект
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
