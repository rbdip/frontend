// src/pages/ServiceCard/ServiceCardPageContainer.jsx
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import {
    getProjectByNameApi,
    deleteProjectApi,
    createProjectVersionApi,
    updateProjectVersionApi,
    deleteProjectVersionApi,
    setFavouriteApi,
    unsetFavouriteApi,
} from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
import ServiceCardPageView from './ServiceCardPageView';

function sortVersions(versions) {
    return versions.slice().sort((a, b) => {
        // Сортируем по display_order (DESC)
        if (b.display_order !== a.display_order) {
            return b.display_order - a.display_order;
        }
        // При равенстве — по updated_on (DESC)
        return dayjs(b.updated_on).valueOf() - dayjs(a.updated_on).valueOf();
    });
}

function ServiceCardPageContainer({ onNotify }) {
    const { username, password } = useAuth();
    const { username: authorUsername, projectName } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Из query ?ver=v2.0
    const query = new URLSearchParams(location.search);
    const versionParam = query.get('ver') || '';

    // Текущий проект
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // Контроль запросов
    const [needsFetch, setNeedsFetch] = useState(true);

    // Выбранная версия
    const [selectedVersion, setSelectedVersion] = useState('');

    // Модалки
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddVersionModal, setShowAddVersionModal] = useState(false);
    const [showEditVersionModal, setShowEditVersionModal] = useState(false);
    const [showEditDescriptionModal, setShowEditDescriptionModal] = useState(false);

    // Поля формы «Добавить версию»
    const [newVersionName, setNewVersionName] = useState('');
    const [newVersionDesc, setNewVersionDesc] = useState('');
    const [newVersionOrder, setNewVersionOrder] = useState('');

    // Поля формы «Редактировать версию»
    const [editVersionName, setEditVersionName] = useState('');
    const [editVersionDesc, setEditVersionDesc] = useState('');
    const [editVersionOrder, setEditVersionOrder] = useState('');

    // Поля для «Редактировать описание» (из блока description)
    const [editDescText, setEditDescText] = useState('');

    // Функция загрузки
    const fetchProjectData = useCallback(async (ver) => {
        try {
            setLoading(true);
            const data = await getProjectByNameApi(username, password, authorUsername, projectName, ver);
            data.versions = sortVersions(data.versions || []);
            setProject(data);
            setSelectedVersion(data.display_version || '');
        } catch (error) {
            onNotify(`Ошибка загрузки проекта: ${error.message}`, 'error');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    }, [username, password, authorUsername, projectName, onNotify, navigate]);

    // useEffect для контроля needsFetch
    useEffect(() => {
        if (needsFetch) {
            fetchProjectData(versionParam).finally(() => setNeedsFetch(false));
        }
    }, [needsFetch, versionParam, fetchProjectData]);

    // Удалить проект
    const handleDeleteProject = async () => {
        try {
            await deleteProjectApi(username, password, authorUsername, projectName);
            onNotify('Проект удалён', 'success');
            navigate('/dashboard', { replace: true });
        } catch (error) {
            onNotify(`Ошибка при удалении: ${error.message}`, 'error');
        }
    };

    // Выбор версии
    const handleVersionChange = (ver) => {
        setSelectedVersion(ver);
        const params = new URLSearchParams();
        if (ver) {
            params.set('ver', ver);
        }
        navigate({
            pathname: `/service/${authorUsername}/${projectName}`,
            search: params.toString(),
        }, { replace: true });
        setNeedsFetch(true);
    };

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

    // Добавить версию
    const handleAddVersion = async () => {
        try {
            validateNotNull(newVersionName, "version_name")
            validatePattern(newVersionName, "version_name")
            validateNotNull(newVersionDesc, "description")
            if (!newVersionName && !newVersionDesc) {
                onNotify('Укажите хотя бы version_name или description', 'error');
                return;
            }
            const body = { version_name: newVersionName };
            if (newVersionDesc) body.description = newVersionDesc;
            if (newVersionOrder) body.display_order = newVersionOrder;

            await createProjectVersionApi(username, password, authorUsername, projectName, body);
            onNotify('Версия добавлена!', 'success');
            setShowAddVersionModal(false);
            setNewVersionName('');
            setNewVersionDesc('');
            setNewVersionOrder('');
            setNeedsFetch(true);
        } catch (error) {
            onNotify(`Ошибка при добавлении версии: ${error.message}`, 'error');
        }
    };

    // Редактировать версию
    const handleEditVersion = async () => {
        try {
            validatePattern(editVersionName, "version_name")
            if (!editVersionName && !editVersionDesc && !editVersionOrder) {
                onNotify('Укажите хотя бы одно поле', 'error');
                return;
            }
            const body = {};
            if (editVersionName) body.version_name = editVersionName;
            if (editVersionDesc) body.description = editVersionDesc;
            if (editVersionOrder) body.display_order = editVersionOrder;

            await updateProjectVersionApi(
                username,
                password,
                authorUsername,
                projectName,
                selectedVersion,
                body
            );
            onNotify('Версия обновлена!', 'success');
            setShowEditVersionModal(false);
            setEditVersionName('');
            setEditVersionDesc('');
            setEditVersionOrder('');
            // Если переименовали версию:
            const newVer = editVersionName || selectedVersion;
            navigate({
                pathname: `/service/${authorUsername}/${projectName}`,
                search: newVer ? `ver=${encodeURIComponent(newVer)}` : '',
            }, { replace: true });
            setNeedsFetch(true);
        } catch (error) {
            onNotify(`Ошибка при обновлении версии: ${error.message}`, 'error');
        }
    };

    // Удалить версию
    const handleDeleteVersion = async () => {
        if (!selectedVersion) {
            onNotify('Нет выбранной версии', 'warning');
            return;
        }
        try {
            await deleteProjectVersionApi(username, password, authorUsername, projectName, selectedVersion);
            onNotify(`Версия '${selectedVersion}' удалена`, 'success');
            setSelectedVersion('');
            setNeedsFetch(true);
            navigate(`/service/${authorUsername}/${projectName}`, { replace: true });
        } catch (error) {
            onNotify(`Ошибка при удалении версии: ${error.message}`, 'error');
        }
    };

    // Лайк
    const handleToggleFavourite = async () => {
        if (!project) return;
        try {
            if (project.liked) {
                // Удалить из избранного
                // Возможно сервер вернёт 204
                await unsetFavouriteApi(username, password, authorUsername, projectName);
                onNotify('Убрали из избранного', 'success');
            } else {
                // Добавить в избранное
                await setFavouriteApi(username, password, authorUsername, projectName);
                onNotify('Добавили в избранное', 'success');
            }

            // Чтобы обновить точно поля like_count, liked,
            // заново загружаем проект (или обновляем state вручную).
            const updated = await getProjectByNameApi(username, password, authorUsername, projectName);
            setProject(updated);

            // ВАЖНО: не делаем navigate или reload => страница не перезагружается
        } catch (error) {
            onNotify(`Ошибка при изменении избранного: ${error.message}`, 'error');
        }
    };

    // Редактирование description
    const handleEditDescClick = () => {
        if (!project) return;
        setEditDescText(project.description || '');
        setShowEditDescriptionModal(true);
    };
    const handleSaveDesc = async () => {
        if (!selectedVersion) {
            // Предположим, что если версия не выбрана, редактируем default
            // или можно запретить
            onNotify('Для изменения описания необходима выбранная версия', 'error');
            return;
        }
        if (!editDescText) {
            onNotify('Описание пустое', 'warning');
        }
        try {
            await updateProjectVersionApi(username, password, authorUsername, projectName, selectedVersion, {
                description: editDescText,
            });
            onNotify('Описание обновлено!', 'success');
            setShowEditDescriptionModal(false);
            setNeedsFetch(true);
        } catch (error) {
            onNotify(`Ошибка при обновлении описания: ${error.message}`, 'error');
        }
    };

    return (
        <ServiceCardPageView
            loading={loading}
            project={project}
            selectedVersion={selectedVersion}

            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            onConfirmDeleteProject={handleDeleteProject}

            onSelectVersion={handleVersionChange}
            onAddVersionClick={() => setShowAddVersionModal(true)}
            onEditVersionClick={() => setShowEditVersionModal(true)}
            onDeleteVersionClick={handleDeleteVersion}

            // «Добавить версию»
            showAddVersionModal={showAddVersionModal}
            setShowAddVersionModal={setShowAddVersionModal}
            newVersionName={newVersionName}
            setNewVersionName={setNewVersionName}
            newVersionDesc={newVersionDesc}
            setNewVersionDesc={setNewVersionDesc}
            newVersionOrder={newVersionOrder}
            setNewVersionOrder={setNewVersionOrder}
            onAddVersion={handleAddVersion}

            // «Редактировать версию»
            showEditVersionModal={showEditVersionModal}
            setShowEditVersionModal={setShowEditVersionModal}
            editVersionName={editVersionName}
            setEditVersionName={setEditVersionName}
            editVersionDesc={editVersionDesc}
            setEditVersionDesc={setEditVersionDesc}
            editVersionOrder={editVersionOrder}
            setEditVersionOrder={setEditVersionOrder}
            onEditVersion={handleEditVersion}

            // Лайк
            onToggleFavourite={handleToggleFavourite}

            // Редактирование description
            onEditDescriptionClick={handleEditDescClick}
            showEditDescriptionModal={showEditDescriptionModal}
            setShowEditDescriptionModal={setShowEditDescriptionModal}
            editDescText={editDescText}
            setEditDescText={setEditDescText}
            onSaveDesc={handleSaveDesc}
        />
    );
}

export default ServiceCardPageContainer;
