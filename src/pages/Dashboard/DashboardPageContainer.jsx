// src/pages/Dashboard/DashboardPageContainer.jsx
import { useEffect, useState } from 'react';
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await getUserInfoApi(username, password, username);
                if (mounted && data) {
                    setUserData(data);
                    // Заполним displayName (если есть)
                    setDisplayName(data.display_name || '');
                }
            } catch (error) {
                onNotify(`Ошибка при загрузке профиля: ${error.message}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [username, password, onNotify]);

    // Сохранить изменения пользователя (PATCH)
    const handleSaveUser = async () => {
        try {
            const body = { display_name: displayName };
            const updatedUser = await updateUserApi(username, password, username, body);
            setUserData(updatedUser);
            onNotify('Профиль обновлён', 'success');
        } catch (error) {
            onNotify(`Ошибка при обновлении профиля: ${error.message}`, 'error');
        }
    };

    // Удалить пользователя
    const handleDeleteUser = async () => {
        try {
            await deleteUserApi(username, password, username);
            onNotify('Пользователь удалён!', 'success');
            // Выходим из профиля
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
            loading={loading}
            onSaveUser={handleSaveUser}
            onDeleteUser={handleDeleteUser}
        />
    );
}

export default DashboardPageContainer;
