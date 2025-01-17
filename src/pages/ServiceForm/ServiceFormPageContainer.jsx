// src/pages/ServiceForm/ServiceFormPageContainer.jsx
import  { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    createProjectApi,
    getProjectByNameApi,
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

    useEffect(() => {
        if (editMode && authorUsername && projectName) {
            let mounted = true;
            (async () => {
                try {
                    const data = await getProjectByNameApi(
                        username,
                        password,
                        authorUsername,
                        projectName
                    );
                    if (mounted && data) {
                        reset({
                            name: data.name,
                            title: data.title,
                            description: data.description,
                        });
                    }
                } catch (error) {
                    onNotify(`Ошибка: ${error.message}`, 'error');
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
                await updateProjectApi(
                    username,
                    password,
                    authorUsername,
                    projectName,
                    formData
                );
                onNotify('Проект обновлён!', 'success');
            } else {
                await createProjectApi(username, password, formData);
                onNotify('Проект создан!', 'success');
            }
            navigate('/catalog');
        } catch (error) {
            onNotify(`Ошибка: ${error.message}`, 'error');
        }
    };

    return (
        <ServiceFormPageView
            editMode={editMode}
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
        />
    );
}

export default ServiceFormPageContainer;
