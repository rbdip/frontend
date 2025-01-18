import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getProjectByNameApi,
    deleteProjectApi,
} from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
import ServiceCardPageView from './ServiceCardPageView';

function ServiceCardPageContainer({ onNotify }) {
    const { username, password } = useAuth();
    const { username: initialAuthorUsername, projectName: initialProjectName } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [authorUsername, setAuthorUsername] = useState(initialAuthorUsername);
    const [projectName, setProjectName] = useState(initialProjectName);
    const [needsFetch, setNeedsFetch] = useState(true); // Контроль вызова API

    // Функция для загрузки данных проекта
    const fetchProjectData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getProjectByNameApi(username, password, authorUsername, projectName);
            setProject(data);
            setSelectedVersion(data.display_version || '');
        } catch (error) {
            onNotify(`Error: ${error.message}`, 'error');
            navigate('/dashboard'); // Перенаправление на случай, если проект не найден
        } finally {
            setLoading(false);
        }
    }, [username, password, authorUsername, projectName, onNotify, navigate]);

    // Первоначальная загрузка данных проекта
    useEffect(() => {
        if (needsFetch) {
            fetchProjectData();
            setNeedsFetch(false); // Блокируем повторный вызов
        }
    }, [needsFetch, fetchProjectData]);

    const handleDelete = async () => {
        try {
            await deleteProjectApi(username, password, authorUsername, projectName);
            onNotify('Service deleted', 'success');
            navigate('/dashboard', { replace: true }); // Перенаправляем на Dashboard
        } catch (error) {
            onNotify(`Error deleting service: ${error.message}`, 'error');
        }
    };

    const handleEditComplete = (newAuthorUsername, newProjectName) => {
        // Обновляем состояние и URL после редактирования
        setAuthorUsername(newAuthorUsername);
        setProjectName(newProjectName);
        setNeedsFetch(true); // Указываем, что требуется обновление данных
        navigate(`/service/${newAuthorUsername}/${newProjectName}`, { replace: true });
    };

    const handleVersionChange = (version) => {
        setSelectedVersion(version);
    };

    return (
        <ServiceCardPageView
            loading={loading}
            project={project}
            currentUser={username}
            onDelete={handleDelete}
            onEditComplete={handleEditComplete}
            selectedVersion={selectedVersion}
            onSelectVersion={handleVersionChange}
        />
    );
}

export default ServiceCardPageContainer;
