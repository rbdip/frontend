// src/pages/ServiceCard/ServiceCardPageContainer.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectByNameApi, deleteProjectApi } from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
import ServiceCardPageView from './ServiceCardPageView';

function ServiceCardPageContainer({ onNotify }) {
    const { username, password } = useAuth();
    const { username: authorUsername, projectName } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await getProjectByNameApi(username, password, authorUsername, projectName);
                if (mounted) setProject(data);
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

    // Удаление проекта
    const handleDelete = async () => {
        try {
            await deleteProjectApi(username, password, authorUsername, projectName);
            onNotify('Проект удалён', 'success');
            // Можно сделать redirect на /catalog
            window.location.href = '/catalog';
        } catch (error) {
            onNotify(`Ошибка при удалении: ${error.message}`, 'error');
        }
    };

    return (
        <ServiceCardPageView
            loading={loading}
            project={project}
            currentUser={username}
            onDelete={handleDelete}
        />
    );
}

export default ServiceCardPageContainer;
