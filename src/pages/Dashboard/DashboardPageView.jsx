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
    Tabs,
    Tab,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
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
                               currentTab,
                               onTabChange,
                               favourites,
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

    const renderModal = (open, onClose, title, content, action) => (
        <Modal open={open} onClose={onClose}>
            <Paper className="dashboard-modal">
                <Typography variant="h6">{title}</Typography>
                <Box mt={2}>{content}</Box>
                {action && (
                    <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                        <Button variant="outlined" onClick={onClose}>
                            Отмена
                        </Button>
                        <Button variant="contained" onClick={action}>
                            Подтвердить
                        </Button>
                    </Box>
                )}
            </Paper>
        </Modal>
    );

    // Рендер «Мои проекты»
    const renderMyProjects = () => {
        return userData.projects.map((proj) => {
            const createdOnProj = dayjs(proj.created_on).format('DD.MM.YYYY HH:mm');
            return (
                <Card key={proj.name} className="dashboard-project-card">
                    <CardContent>
                        <Typography variant="h6">{proj.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            title: {proj.title}
                        </Typography>
                        {/*<Typography variant="caption" color="text.secondary" display="block">*/}
                        {/*    Лайков: {proj.like_count}*/}
                        {/*</Typography>*/}
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'gray' }}>
                            Дата создания: {createdOnProj}
                        </Typography>

                        <Button
                            variant="contained"
                            component={Link}
                            to={`/service/${proj.author.username}/${proj.name}`}
                            className="dashboard-btn-open"
                            sx={{ mt: 1 }}
                        >
                            Открыть
                        </Button>
                    </CardContent>
                </Card>
            );
        });
    };

    // Рендер «Мои избранные»
    const renderMyFavourites = () => {
        return favourites.map((fproj) => {
            const createdOnFav = dayjs(fproj.created_on).format('DD.MM.YYYY HH:mm');
            return (
                <Card key={fproj.name} className="dashboard-project-card">
                    <CardContent>
                        <Typography variant="h6">{fproj.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            title: {fproj.title}
                        </Typography>
                        {/*<Typography variant="caption" color="text.secondary" display="block">*/}
                        {/*    Лайков: {fproj.like_count}*/}
                        {/*</Typography>*/}
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'gray' }}>
                            Дата создания: {createdOnFav}
                        </Typography>

                        <Button
                            variant="contained"
                            component={Link}
                            to={`/service/${fproj.author.username}/${fproj.name}`}
                            sx={{ mt: 1 }}
                        >
                            Открыть
                        </Button>
                    </CardContent>
                </Card>
            );
        });
    };

    // Человекочитаемая дата
    const createdOnHuman = dayjs(userData.created_on).format('DD.MM.YYYY HH:mm');

    // Модалка смены пароля
    const changePasswordModal = renderModal(
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
    );

    // Модалка подтверждения удаления пользователя
    const deleteUserModal = renderModal(
        showDeleteModal,
        () => setShowDeleteModal(false),
        'Подтверждение удаления',
        <Typography>Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.</Typography>,
        onConfirmDeleteUser
    );

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
                        Сохранить изменения
                    </Button>
                    <Button variant="contained" onClick={onChangePassword} className="dashboard-btn-save">
                        Сменить пароль
                    </Button>
                    <Button variant="outlined" color="error" onClick={onDeleteUser} className="dashboard-btn-delete">
                        Удалить пользователя
                    </Button>
                </Box>
            </Box>

            {/* Вкладки */}
            <Box>
                <Tabs value={currentTab} onChange={(e, val) => onTabChange(val)}>
                    <Tab label="Мои проекты" />
                    <Tab label="Мои избранные" />
                </Tabs>

                {/* Контейнер, в котором обе вкладки присутствуют */}
                <Box sx={{ position: 'relative', minHeight: 200 }}>
                    {/* Вкладка 0: Мои проекты */}
                    <CSSTransition
                        in={currentTab === 0}
                        timeout={300}
                        classNames="fade"
                        unmountOnExit={true}
                    >
                        <Box className="tab-content" sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
                            {renderMyProjects()}
                        </Box>
                    </CSSTransition>

                    {/* Вкладка 1: Мои избранные */}
                    <CSSTransition
                        in={currentTab === 1}
                        timeout={300}
                        classNames="fade"
                        unmountOnExit={true}
                    >
                        <Box className="tab-content" sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
                            {renderMyFavourites()}
                        </Box>
                    </CSSTransition>
                </Box>
            </Box>

            {/* Модалки */}
            {changePasswordModal}
            {deleteUserModal}
        </Container>
    );
}

export default DashboardPageView;
