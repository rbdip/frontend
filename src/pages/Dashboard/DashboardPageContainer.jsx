import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    getUserInfoApi,
    updateUserApi,
    deleteUserApi,
} from '../../api/projectApi';
import DashboardPageView from './DashboardPageView';

function DashboardPageContainer({ onNotify }) {
    const { username, password, logout } = useAuth();

    const [userData, setUserData] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [needsFetch, setNeedsFetch] = useState(true); // Флаг контроля вызовов API
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Функция для загрузки данных пользователя
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

    // Загрузка данных при монтировании или при изменении флага needsFetch
    useEffect(() => {
        if (needsFetch) {
            fetchUserData();
            setNeedsFetch(false); // Блокируем повторный вызов
        }
    }, [needsFetch, fetchUserData]);

    // Сохранить изменения пользователя (PATCH)
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
            onNotify(`Пароль должен быть длиной от 8 до 255 символов`, 'error');
            return
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

    return (
        <DashboardPageView
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
        />
    );
}

export default DashboardPageContainer;
