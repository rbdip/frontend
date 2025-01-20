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

    function validateLength(spaceValue, spaceName, startSize, endSize) {
        if (spaceValue.length < startSize || spaceValue.length > endSize) {
            throw new Error(`${spaceName} должно быть длиной от ${startSize} до ${endSize} символов`);
        }
    }

    function validateNotNull(spaceValue, spaceName) {
        if (!spaceValue) {
            throw new Error(`${spaceName} не может быть пустым`);
        }
    }

    function validatePattern(spaceValue, spaceName) {
        if (!/^[a-zA-Z\-_0-9]+$/.test(spaceValue)) {
            throw new Error(
                `${spaceName} может содержать только буквы, цифры, дефис и подчеркивание`
            );
        }
    }

    const onSubmit = async (formData) => {
        try {
            validateNotNull(formData.name, "Name");
            validateLength(formData.name, "Name", 5, 255);
            validatePattern(formData.name, "Name");
            validateNotNull(formData.title, "Заголовок");
            validateLength(formData.title, "Заголовок", 1, 255);
            // validatePattern(formData.display_version, "Версия");
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
