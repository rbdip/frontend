// src/pages/Catalog/CatalogPageContainer.jsx

import { useEffect, useState, useCallback } from 'react';
import { getAllProjectsApi } from '../../api/projectApi';
import CatalogPageView from './CatalogPageView';

function CatalogPageContainer({ onNotify }) {
    // Список проектов
    const [projects, setProjects] = useState([]);
    // Всего страниц (от бэкенда)
    const [totalPages, setTotalPages] = useState(1);

    // Текущая страница (0-based)
    const [page, setPage] = useState(0);
    // Лимит на странице
    const [limit, setLimit] = useState(20);
    // Строка поиска
    const [query, setQuery] = useState('');

    // Состояния для плавной перерисовки
    const [loading, setLoading] = useState(true);
    const [fadeKey, setFadeKey] = useState(0);
    // fadeKey будем менять при обновлении, чтобы MUI Fade перезапускался

    // Функция загрузки
    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            // Запрашиваем
            const data = await getAllProjectsApi({ limit, page, query });
            // data.projects, data.total_pages
            setProjects(data.projects || []);
            setTotalPages(data.total_pages || 1);
            // Меняем ключ (для анимации Fade)
            setFadeKey((k) => k + 1);
        } catch (err) {
            onNotify(`Ошибка: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [limit, page, query, onNotify]);

    // Загружаем при изменении limit/page/query
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Изменение поиска
    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
        setPage(0); // сбрасываем страницу
    };

    // Изменение лимита
    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(0);
    };

    // Изменение страницы
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <CatalogPageView
            loading={loading}
            projects={projects}
            query={query}
            limit={limit}
            page={page}
            totalPages={totalPages}
            fadeKey={fadeKey}
            onQueryChange={handleQueryChange}
            onLimitChange={handleLimitChange}
            onPageChange={handlePageChange}
        />
    );
}

export default CatalogPageContainer;
