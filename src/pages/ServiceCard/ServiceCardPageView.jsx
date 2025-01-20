// src/pages/ServiceCard/ServiceCardPageView.jsx
import React from 'react';
import {
    Container,
    Typography,
    Box,
    Skeleton,
    Button,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Modal,
    Paper,
    TextField,
    IconButton
} from '@mui/material';
import dayjs from 'dayjs';
import './ServiceCardPage.css';

// Иконки
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

// Старое редактирование проекта
import { Link } from 'react-router-dom';

function ServiceCardPageView({
                                 loading,
                                 project,
                                 selectedVersion,
                                 // Модалка удаления проекта
                                 showDeleteModal,
                                 setShowDeleteModal,
                                 onConfirmDeleteProject,
                                 // Методы для версий
                                 onSelectVersion,
                                 onAddVersionClick,
                                 onEditVersionClick,
                                 onDeleteVersionClick,
                                 // Добавить версию
                                 showAddVersionModal,
                                 setShowAddVersionModal,
                                 newVersionName,
                                 setNewVersionName,
                                 newVersionDesc,
                                 setNewVersionDesc,
                                 newVersionOrder,
                                 setNewVersionOrder,
                                 onAddVersion,
                                 // Редактировать версию
                                 showEditVersionModal,
                                 setShowEditVersionModal,
                                 editVersionName,
                                 setEditVersionName,
                                 editVersionDesc,
                                 setEditVersionDesc,
                                 editVersionOrder,
                                 setEditVersionOrder,
                                 onEditVersion,
                                 // Лайк
                                 onToggleFavourite,
                                 // Редактировать description
                                 onEditDescriptionClick,
                                 showEditDescriptionModal,
                                 setShowEditDescriptionModal,
                                 editDescText,
                                 setEditDescText,
                                 onSaveDesc,
                             }) {
    // Модалка общая
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
            <Container maxWidth="lg" className="service-card-container">
                <Skeleton height={40} width="50%" sx={{ mb: 2 }} />
                <Skeleton height={20} width="70%" />
                <Skeleton height={20} width="70%" />
            </Container>
        );
    }

    if (!project) {
        return (
            <Container maxWidth="lg" className="service-card-container">
                <Typography variant="h6">Проект не найден</Typography>
            </Container>
        );
    }

    const liked = project.liked;
    const likeCount = project.like_count || 0;
    const createdOn = dayjs(project.created_on).format('DD.MM.YYYY HH:mm');
    const updatedOn = dayjs(project.updated_on).format('DD.MM.YYYY HH:mm');

    // Модалка удаления проекта
    const DeleteProjectModal = renderModal(
        showDeleteModal,
        () => setShowDeleteModal(false),
        'Подтверждение удаления',
        <Typography>Удалить весь проект целиком? Это действие необратимо.</Typography>,
        onConfirmDeleteProject
    );

    // Модалка «Добавить версию»
    const AddVersionModal = (
        <Modal open={showAddVersionModal} onClose={() => setShowAddVersionModal(false)}>
            <Paper className="dashboard-modal">
                <Typography variant="h6">Добавить версию</Typography>
                <TextField
                    label="version_name (необязательно)"
                    value={newVersionName}
                    onChange={(e) => setNewVersionName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="description (необязательно)"
                    value={newVersionDesc}
                    onChange={(e) => setNewVersionDesc(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                />
                <TextField
                    label="display_order (не обязательно)"
                    value={newVersionOrder}
                    onChange={(e) => setNewVersionOrder(e.target.value)}
                    fullWidth
                    margin="normal"
                    type="number"
                />
                <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" onClick={() => setShowAddVersionModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="contained" onClick={onAddVersion}>
                        Создать
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );

    // Модалка «Редактировать версию»
    const EditVersionModal = (
        <Modal open={showEditVersionModal} onClose={() => setShowEditVersionModal(false)}>
            <Paper className="dashboard-modal">
                <Typography variant="h6">Редактировать версию: {selectedVersion}</Typography>
                <TextField
                    label="Новое version_name"
                    value={editVersionName}
                    onChange={(e) => setEditVersionName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Новое описание"
                    value={editVersionDesc}
                    onChange={(e) => setEditVersionDesc(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                />
                <TextField
                    label="display_order"
                    value={editVersionOrder}
                    onChange={(e) => setEditVersionOrder(e.target.value)}
                    fullWidth
                    margin="normal"
                    type="number"
                />
                <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" onClick={() => setShowEditVersionModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="contained" onClick={onEditVersion}>
                        Сохранить
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );

    // Модалка «Редактировать описание»
    const EditDescriptionModal = (
        <Modal open={showEditDescriptionModal} onClose={() => setShowEditDescriptionModal(false)}>
            <Paper className="dashboard-modal">
                <Typography variant="h6">Редактировать описание (версия: {project.display_version})</Typography>
                <TextField
                    label="Новое описание"
                    value={editDescText}
                    onChange={(e) => setEditDescText(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={5}
                />
                <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                        variant="outlined"
                        onClick={() => setShowEditDescriptionModal(false)}
                    >
                        Отмена
                    </Button>
                    <Button variant="contained" onClick={onSaveDesc}>
                        Сохранить
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );

    // Сортированные версии уже в project.versions (если нужно ещё раз)
    const sortedVersions = project.versions || [];

    return (
        <Container maxWidth="lg" className="service-card-container">
            {/* Заголовок */}
            <Box className="service-header">
                <Box className="service-header-content">
                    <Typography variant="h5" className="service-project-name">
                        {project.title}
                    </Typography>
                    <Link
                        to={`/users/${project.author.username}`}
                        className="service-project-path"
                    >
                        {project.author.username}/{project.name}
                    </Link>
                </Box>

                <Box className="service-header-buttons">
                    {/* Лайк */}
                    {/*<Box display="flex" alignItems="center" gap={1}>*/}
                    {/*    <IconButton onClick={onToggleFavourite} size="small">*/}
                    {/*        {liked ? <StarIcon sx={{ color: 'gold' }} /> : <StarBorderIcon sx={{ color: 'lightgray' }} />}*/}
                    {/*    </IconButton>*/}
                    {/*    <Typography>{likeCount}</Typography>*/}
                    {/*</Box>*/}
                    {/* Старое редактирование проекта */}
                    <Button
                        variant="outlined"
                        className="header-button"
                        component={Link}
                        to={`/service/${project.author.username}/${project.name}/edit`}
                    >
                        Edit Project
                    </Button>
                    {/* Удалить проект */}
                    <Button
                        variant="outlined"
                        className="header-button"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>

            {/* Макет */}
            <Box className="service-layout">
                <Box className="service-main-content">
                    {/* Description */}
                    <Card className="service-description-card">
                        <CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6" gutterBottom>
                                    Описание
                                </Typography>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={onEditDescriptionClick}
                                >
                                    Edit desc
                                </Button>
                            </Box>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                {project.description || 'Нет описания'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Сайдбар */}
                <Box className="service-sidebar">
                    {/* Селектор версий */}
                    {/* Инфа */}
                    <Card className="service-about">
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                                About this project
                            </Typography>
                            <Box
                                sx={{
                                    borderBottom: '1px solid #666',
                                    mb: 1,
                                    opacity: 0.7,
                                }}
                            />
                            <Typography variant="body2" className="service-dates">
                                <strong>Created:</strong> {createdOn}
                            </Typography>
                            <Typography variant="body2" className="service-dates">
                                <strong>Updated:</strong> {updatedOn}
                            </Typography>
                            <Typography variant="body2" className="service-dates">
                                <strong>Author:</strong> {project.author.display_name || project.author.username}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Модалки */}
            {DeleteProjectModal}
            {AddVersionModal}
            {EditVersionModal}
            {EditDescriptionModal}
        </Container>
    );
}

export default ServiceCardPageView;
