// src/pages/ServiceCard/ServiceCardPageView.jsx
import 'react';
import {
    Container,
    Typography,
    Box,
    Skeleton,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Link } from 'react-router-dom';
import './ServiceCardPage.css';
import dayjs from "dayjs";

function ServiceCardPageView({
                                 loading,
                                 project,
                                 currentUser,
                                 onDelete,
                                 selectedVersion,
                                 onSelectVersion,
                             }) {
    if (loading) {
        return (
            <Container maxWidth="md" className="service-card-container">
                <Skeleton className="service-skeleton-title" />
                <Skeleton className="service-skeleton-line" />
                <Skeleton className="service-skeleton-line" />
            </Container>
        );
    }

    if (!project) {
        return (
            <Container maxWidth="md" className="service-card-container">
                <Typography variant="h6">Проект не найден</Typography>
            </Container>
        );
    }

    const canEdit = currentUser === project.author.username;

    return (
        <Container maxWidth="md" className="service-card-container">
            <Typography variant="h4" gutterBottom>
                {project.title}
            </Typography>
            <Typography className="service-info">
                name: {project.name}
            </Typography>
            <Typography className="service-info">
                Автор: {project.author.username}
            </Typography>
            <Typography className="service-dates">
                Создан: {dayjs(project.created_on).format('DD.MM.YYYY HH:mm')}, Обновлён: {dayjs(project.updated_on).format('DD.MM.YYYY HH:mm')}
            </Typography>
            <Typography className="service-description" sx={{ mt: 2 }}>
                {project.description}
            </Typography>

            {/* Селектор версий */}
            <Box sx={{ mt: 3 }}>
                <FormControl>
                    <InputLabel>Версия</InputLabel>
                    <Select
                        value={selectedVersion || ''}
                        label="Версия"
                        onChange={(e) => onSelectVersion(e.target.value)}
                        sx={{ minWidth: 200 }}
                    >
                        {project.versions?.map((ver) => (
                            <MenuItem key={ver.id} value={ver.version_name}>
                                {ver.version_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Typography variant="body1">
                    Текущая (display_version): {project.display_version}
                </Typography>
            </Box>

            {canEdit && (
                <Box className="service-edit-button">
                    <Button
                        variant="contained"
                        component={Link}
                        to={`/service/${project.author.username}/${project.name}/edit`}
                        sx={{ mr: 2 }}
                    >
                        Редактировать
                    </Button>
                    <Button variant="outlined" color="error" onClick={onDelete}>
                        Удалить
                    </Button>
                </Box>
            )}
        </Container>
    );
}

export default ServiceCardPageView;
