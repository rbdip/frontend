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
    Modal,
    Paper,
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
                               confirmPassword,
                               setConfirmPassword,
                               loading,
                               onSaveUser,
                               onChangePassword,
                               onDeleteUser,
                               onConfirmPasswordChange,
                               onConfirmDeleteUser,
                               showPasswordModal,
                               setShowPasswordModal,
                               showDeleteModal,
                               setShowDeleteModal,
                           }) {
    const renderModal = (open, onClose, title, content, action) => (
        <Modal open={open} onClose={onClose}>
            <Paper className="dashboard-modal">
                <Typography variant="h6">{title}</Typography>
                <Box mt={2}>{content}</Box>
                <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button variant="contained" onClick={action}>
                        Подтвердить
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );

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
                    <Button variant="contained" onClick={onSaveUser} className="dashboard-btn-save">
                        Сохранить изменения пользователя
                    </Button>
                    <Button variant="contained" onClick={onChangePassword} className="dashboard-btn-save">
                        Сменить пароль
                    </Button>
                    <Button variant="outlined" color="error" onClick={onDeleteUser} className="dashboard-btn-delete">
                        Удалить пользователя
                    </Button>
                </Box>
            </Box>

            {renderModal(
                showPasswordModal,
                () => setShowPasswordModal(false),
                'Смена пароля',
                <>
                    <TextField
                        label="Новый пароль"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Подтвердите пароль"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                </>,
                onConfirmPasswordChange
            )}

            {renderModal(
                showDeleteModal,
                () => setShowDeleteModal(false),
                'Подтверждение удаления',
                <Typography>Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.</Typography>,
                onConfirmDeleteUser
            )}

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
