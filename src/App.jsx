// src/App.jsx
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HeaderContainer from './components/Header/HeaderContainer';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPageContainer from './pages/Login/LoginPageContainer';
import RegisterPageContainer from './pages/Register/RegisterPageContainer';
import DashboardPageContainer from './pages/Dashboard/DashboardPageContainer';
import CatalogPageContainer from './pages/Catalog/CatalogPageContainer'; // <- без защиты
import ServiceCardPageContainer from './pages/ServiceCard/ServiceCardPageContainer';
import ServiceFormPageContainer from './pages/ServiceForm/ServiceFormPageContainer';

import { Snackbar, Alert } from '@mui/material';
import './App.css';

function App() {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const showNotification = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    return (
        <div className="app-container">
            <HeaderContainer />

            <Routes>
                {/* Открытые маршруты */}
                <Route
                    path="/login"
                    element={<LoginPageContainer onNotify={showNotification} />}
                />
                <Route
                    path="/register"
                    element={<RegisterPageContainer onNotify={showNotification} />}
                />
                <Route
                    path="/catalog"
                    element={<CatalogPageContainer onNotify={showNotification} />}
                />

                {/* Приватные маршруты */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPageContainer onNotify={showNotification} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/service/:username/:projectName"
                    element={
                        <ProtectedRoute>
                            <ServiceCardPageContainer onNotify={showNotification} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/service/:username/:projectName/edit"
                    element={
                        <ProtectedRoute>
                            <ServiceFormPageContainer onNotify={showNotification} editMode />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/service/new"
                    element={
                        <ProtectedRoute>
                            <ServiceFormPageContainer onNotify={showNotification} />
                        </ProtectedRoute>
                    }
                />
            </Routes>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default App;
