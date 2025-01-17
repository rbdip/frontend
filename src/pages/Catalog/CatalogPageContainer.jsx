// src/pages/Catalog/CatalogPageContainer.jsx
import { useEffect, useState } from 'react';
import { getAllProjectsApi } from '../../api/projectApi';
import CatalogPageView from './CatalogPageView';

function CatalogPageContainer({ onNotify }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getAllProjectsApi(); // без логин/пароль
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
    }, [onNotify]);

    return <CatalogPageView loading={loading} projects={projects} />;
}

export default CatalogPageContainer;
