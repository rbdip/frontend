// src/pages/Catalog/CatalogPageContainer.jsx
import  { useEffect, useState } from 'react';
import CatalogPageView from './CatalogPageView';
import { getAllProjects } from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';

function CatalogPageContainer({ onNotify }) {
    const { username, password } = useAuth();
    const [projects, setProjects] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await getAllProjects({ username, password });
                if (mounted) {
                    setProjects(data);
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
    }, [username, password, onNotify]);

    return (
        <CatalogPageView
            loading={loading}
            projects={projects}
        />
    );
}

export default CatalogPageContainer;
