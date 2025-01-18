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
} from '@mui/material';
import { Link } from 'react-router-dom';
import './ServiceCardPage.css';
import dayjs from 'dayjs';

function ServiceCardPageView({
                                 loading,
                                 project,
                                 currentUser,
                                 onDelete,
                                 selectedVersion,
                                 onSelectVersion,
                             }) {
    const placeholderImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        project ? project.title : 'P'
    )}&background=4a3375&color=ffffff&size=40&rounded=true`;

    if (loading) {
        return (
            <Container maxWidth="lg" className="service-card-container">
                <Skeleton className="service-skeleton-title" />
                <Skeleton className="service-skeleton-line" />
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

    return (
        <Container maxWidth="lg" className="service-card-container">
            {/* Блок заголовка */}
            <Box className="service-header">
                <Box className="service-header-content">
                    {/* Иконка проекта */}
                    <img
                        src={placeholderImage}
                        alt="Project Icon"
                        className="service-project-icon"
                    />
                    <Typography variant="h5" className="service-project-name">
                        {project.title}
                    </Typography>
                    <span className="service-project-visibility">Public</span>
                </Box>

                {/* Блок для кнопок */}
                <Box className="service-header-buttons">
                    <Button
                        variant="outlined"
                        className="header-button"
                        component={Link}
                        to={`/service/${project.author.username}/${project.name}/edit`}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        className="header-button"
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                    <Button variant="outlined" className="header-button">
                        Watch
                    </Button>
                    <Button variant="outlined" className="header-button">
                        Star
                    </Button>
                </Box>
            </Box>

            <Box className="service-layout">
                {/* Основной контент */}
                <Box className="service-main-content">
                    {/* Блок описания */}
                    <Card className="service-description-card">
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Description
                            </Typography>
                            <Typography className="service-description">
                                {project.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Правая панель */}
                <Box className="service-sidebar">
                    {/* Блок выбора версии */}
                    <Card className="service-version-select">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Select Version
                            </Typography>
                            <FormControl fullWidth>
                                <InputLabel>Version</InputLabel>
                                <Select
                                    value={selectedVersion || ''}
                                    label="Version"
                                    onChange={(e) => onSelectVersion(e.target.value)}
                                >
                                    {project.versions?.map((ver) => (
                                        <MenuItem key={ver.id} value={ver.version_name}>
                                            {ver.version_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </CardContent>
                    </Card>

                    {/* Блок About */}
                    <Card className="service-about">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                About
                            </Typography>
                            <Typography className="service-dates">
                                <strong>Created:</strong> {dayjs(project.created_on).format('DD.MM.YYYY HH:mm')}
                            </Typography>
                            <Typography className="service-dates">
                                <strong>Updated:</strong> {dayjs(project.updated_on).format('DD.MM.YYYY HH:mm')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Container>
    );
}

export default ServiceCardPageView;
