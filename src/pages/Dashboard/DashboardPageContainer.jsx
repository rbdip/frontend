// src/pages/Dashboard/DashboardPageContainer.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserInfoApi } from '../../api/projectApi';
import DashboardPageView from './DashboardPageView';

function DashboardPageContainer({ onNotify }) {
    const { username, password } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await getUserInfoApi(username, password, username);
                if (mounted) {
                    setUserData(data);
                }
            } catch (error) {
                onNotify(`Ошибка при загрузке пользователя: ${error.message}`, 'error');
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        })();
        return () => {
            mounted = false;
        };
    }, [username, password, onNotify]);

    return <DashboardPageView userData={userData} loading={loading} />;
}

export default DashboardPageContainer;
