// src/pages/Dashboard/DashboardPageContainer.jsx
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    getUserInfoApi,
    updateUserApi,
    deleteUserApi,
    getUserFavouritesApi,
} from '../../api/projectApi';
import DashboardPageView from './DashboardPageView';

function DashboardPageContainer({ onNotify }) {
    const { username, password, logout } = useAuth();

    const [userData, setUserData] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [needsFetch, setNeedsFetch] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Активная вкладка: 0 = «Мои проекты», 1 = «Мои избранные»
    const [currentTab, setCurrentTab] = useState(0);

    // Данные для «Мои избранные»
    const [favourites, setFavourites] = useState([]);

    // Загружаем данные пользователя (Мои проекты)
    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getUserInfoApi(username, password, username);
            setUserData(data);
            setDisplayName(data.display_name || '');
        } catch (error) {
            onNotify(`Ошибка при загрузке профиля: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [username, password, onNotify]);

    // Первый рендер или needsFetch
    useEffect(() => {
        if (needsFetch) {
            fetchUserData();
            setNeedsFetch(false);
        }
    }, [needsFetch, fetchUserData]);

    // Сохранить изменения (display_name)
    const handleSaveUser = async () => {
        try {
            const body = {};
            if (displayName) body.display_name = displayName;

            if (Object.keys(body).length === 0) {
                onNotify('Нет данных для обновления', 'info');
                return;
            }
            const updatedUser = await updateUserApi(username, password, username, body);
            setUserData(updatedUser);
            onNotify('Профиль обновлён', 'success');
        } catch (error) {
            onNotify(`Ошибка при обновлении профиля: ${error.message}`, 'error');
        }
    };

    // Смена пароля
    const handleChangePassword = async () => {
        if (newPassword.length < 8 || newPassword.length > 255) {
            onNotify('Пароль должен быть длиной от 8 до 255 символов', 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            onNotify('Пароли не совпадают', 'error');
            return;
        }
        try {
            await updateUserApi(username, password, username, { password: newPassword });
            onNotify('Пароль изменён. Пожалуйста, войдите заново.', 'success');
            logout();
        } catch (error) {
            onNotify(`Ошибка при смене пароля: ${error.message}`, 'error');
        }
    };

    // Удалить пользователя
    const handleDeleteUser = async () => {
        try {
            await deleteUserApi(username, password, username);
            onNotify('Пользователь удалён!', 'success');
            logout();
        } catch (error) {
            onNotify(`Ошибка при удалении пользователя: ${error.message}`, 'error');
        }
    };

    // Переключение вкладок
    const handleTabChange = (newTab) => {
        setCurrentTab(newTab);
        // Если переходим на вкладку «Избранные», грузим фавориты
        if (newTab === 1) {
            fetchFavourites();
        }
    };

    // Загрузка избранных
    const fetchFavourites = useCallback(async () => {
        try {
            const data = await getUserFavouritesApi(username, password, username);
            // data: { "projects": [...], "total_elements": 2, "total_pages": null }
            setFavourites(data.projects || []);
        } catch (error) {
            onNotify(`Ошибка при загрузке избранного: ${error.message}`, 'error');
        }
    }, [username, password, onNotify]);

    return (
        <DashboardPageView
            // Основные пропсы
            userData={userData}
            displayName={displayName}
            setDisplayName={setDisplayName}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            loading={loading}
            onSaveUser={handleSaveUser}
            onChangePassword={() => setShowPasswordModal(true)}
            onDeleteUser={() => setShowDeleteModal(true)}
            onConfirmPasswordChange={handleChangePassword}
            onConfirmDeleteUser={handleDeleteUser}
            showPasswordModal={showPasswordModal}
            setShowPasswordModal={setShowPasswordModal}
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}

            // Вкладки
            currentTab={currentTab}
            onTabChange={handleTabChange}

            // Избранные
            favourites={favourites}
        />
    );
}

export default DashboardPageContainer;
