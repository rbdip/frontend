// src/pages/Dashboard/DashboardPageContainer.jsx
import 'react';
import DashboardPageView from './DashboardPageView';
import { useAuth } from '../../context/AuthContext';

function DashboardPageContainer() {
    const { username } = useAuth();

    // Здесь могла быть логика загрузки персональных данных
    // Пока просто передаём username во View
    return <DashboardPageView username={username} />;
}

export default DashboardPageContainer;
