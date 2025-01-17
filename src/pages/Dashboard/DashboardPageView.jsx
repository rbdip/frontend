// src/pages/Dashboard/DashboardPageView.jsx
import React from 'react';
import {
    Container,
    Typography,
    Box,
    Skeleton,
    TextField,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPageView({
                               userData,
                               displayName,
                               setDisplayName,
                               loading,
                               onSaveUser,
                               onDeleteUser,
                           }) {
    if (loading) {
        return (
            <Container maxWidth="md" className="dashboard-container">
                <Skeleton variant="rectangular" height={60} className="dashboard-skeleton" />
                <Skeleton variant="rectangular" height={60} className="dashboard-skeleton" />
            </Container>
        );
    }

    if (!userData) {
        return (
            <Container maxWidth="md" className="dashboard-container">
                <Typography variant="h6">Не удалось загрузить профиль</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" className="dashboard-container">
            <Typography variant="h5">Личный кабинет</Typography>

            <Box className="dashboard-user-box">
                <Typography>Логин: {userData.username}</Typography>
                <Typography>Дата создания: {userData.created_on}</Typography>

                <Box className="dashboard-user-edit">
                    <TextField
                        label="Отображаемое имя"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="dashboard-input"
                    />
                    <Button variant="contained" onClick={onSaveUser} className="dashboard-btn-save">
                        Сохранить изменения пользователя
                    </Button>
                    <Button variant="outlined" color="error" onClick={onDeleteUser} className="dashboard-btn-delete">
                        Удалить пользователя
                    </Button>
                </Box>
            </Box>

            <Box className="dashboard-projects-box">
                <Typography variant="h6" sx={{ mt: 3 }}>
                    Мои проекты:
                </Typography>
                {userData.projects && userData.projects.length > 0 ? (
                    userData.projects.map((proj) => (
                        <Card key={proj.id} className="dashboard-project-card">
                            <CardContent>
                                <Typography variant="h6">{proj.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    name: {proj.name}
                                </Typography>
                                <Button
                                    variant="contained"
                                    component={Link}
                                    to={`/service/${proj.author}/${proj.name}`}
                                    className="dashboard-btn-open"
                                >
                                    Открыть
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography sx={{ mt: 2 }}>Нет проектов</Typography>
                )}
            </Box>
        </Container>
    );
}

export default DashboardPageView;
