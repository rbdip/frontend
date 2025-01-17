// src/pages/ServiceCard/ServiceCardPageView.jsx
import 'react';
import { Container, Typography, Box, Skeleton } from '@mui/material';
import './ServiceCardPage.css';

function ServiceCardPageView({ loading, project }) {
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

    return (
        <Container maxWidth="md" className="service-card-container">
            <Typography variant="h4">{project.title}</Typography>
            <Typography className="service-info">
                name: {project.name}
            </Typography>
            <Typography className="service-author">
                Автор: {project.author_display_name} ({project.author_username})
            </Typography>
            <Typography className="service-description">
                {project.description}
            </Typography>

            {project.versions && project.versions.length > 0 && (
                <Box className="service-versions">
                    <Typography variant="h6">Версии:</Typography>
                    {project.versions.map((v) => (
                        <Box key={v.id} className="service-version-item">
                            <Typography>• {v.display_name}</Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Container>
    );
}

export default ServiceCardPageView;
