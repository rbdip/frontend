// src/pages/ServiceCard/ServiceCardPageContainer.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getProjectByNameApi,
    deleteProjectApi,
} from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
import ServiceCardPageView from './ServiceCardPageView';

function ServiceCardPageContainer({ onNotify }) {
    const { username, password } = useAuth();
    const { username: authorUsername, projectName } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVersion, setSelectedVersion] = useState(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await getProjectByNameApi(username, password, authorUsername, projectName);
                if (mounted && data) {
                    setProject(data);
                    // Версия, которая отображается сейчас (display_version)
                    setSelectedVersion(data.display_version || '');
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
    }, [username, password, authorUsername, projectName, onNotify]);

    // Удалить проект
    const handleDelete = async () => {
        try {
            await deleteProjectApi(username, password, authorUsername, projectName);
            onNotify('Сервис удалён', 'success');
            navigate('/dashboard');
        } catch (error) {
            onNotify(`Ошибка при удалении: ${error.message}`, 'error');
        }
    };

    // Смена версии в селекторе
    const handleVersionChange = (version) => {
        setSelectedVersion(version);
        // Можно дополнительно что-то делать (обновлять display_version?) 
        // Но по заданию, нужна просто возможность выбора в селекторе.
    };

    return (
        <ServiceCardPageView
            loading={loading}
            project={project}
            currentUser={username}
            onDelete={handleDelete}
            selectedVersion={selectedVersion}
            onSelectVersion={handleVersionChange}
        />
    );
}

export default ServiceCardPageContainer;
