// src/pages/ServiceCard/ServiceCardPageContainer.jsx
import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProject } from '../../api/projectApi';
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
                const data = await getProject({ username, password }, authorUsername, projectName);
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

    return (
        <ServiceCardPageView loading={loading} project={project} />
    );
}

export default ServiceCardPageContainer;
