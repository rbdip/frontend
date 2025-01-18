// src/pages/Dashboard/DashboardPageView.jsx
import 'react';
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
import dayjs from 'dayjs';
import './DashboardPage.css';

function DashboardPageView({
                               userData,
                               displayName,
                               setDisplayName,
                               newPassword,
                               setNewPassword,
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

    // Человекочитаемая дата
    const createdOnHuman = dayjs(userData.created_on).format('DD.MM.YYYY HH:mm');

    return (
        <Container maxWidth="md" className="dashboard-container">
            <Typography variant="h5">Личный кабинет</Typography>

            <Box className="dashboard-user-box">
                <Typography>Логин: {userData.username}</Typography>
                <Typography>Дата создания: {createdOnHuman}</Typography>

                <Box className="dashboard-user-edit">
                    <TextField
                        label="Отображаемое имя"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="dashboard-input"
                    />
                    <TextField
                        label="Новый пароль (не обязательно)"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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
                    userData.projects.map((proj) => {
                        const createdOnProj = dayjs(proj.created_on).format('DD.MM.YYYY HH:mm');
                        return (
                            <Card key={proj.id} className="dashboard-project-card">
                                <CardContent>
                                    <Typography variant="h6">{proj.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        title: {proj.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Дата: {createdOnProj}
                                    </Typography>
                                    <br />
                                    <Button
                                        variant="contained"
                                        component={Link}
                                        to={`/service/${proj.author.username}/${proj.name}`}
                                        className="dashboard-btn-open"
                                    >
                                        Открыть
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <Typography sx={{ mt: 2 }}>Нет проектов</Typography>
                )}
            </Box>
        </Container>
    );
}

export default DashboardPageView;
