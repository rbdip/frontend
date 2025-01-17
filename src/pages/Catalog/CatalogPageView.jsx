// src/pages/Catalog/CatalogPageView.jsx
import 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Skeleton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import './CatalogPage.css';

function CatalogPageView({ loading, projects }) {
    if (loading) {
        return (
            <Container maxWidth="md" className="catalog-container">
                <Skeleton variant="rectangular" width="100%" height={60} className="catalog-skeleton" />
                <Skeleton variant="rectangular" width="100%" height={60} className="catalog-skeleton" />
            </Container>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <Container maxWidth="md" className="catalog-container">
                <Typography>Нет проектов.</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" className="catalog-container">
            <Typography variant="h5" gutterBottom>
                Каталог проектов
            </Typography>
            <Box className="catalog-list">
                {projects.map((proj) => (
                    <Card key={proj.id} className="catalog-card">
                        <CardContent>
                            <Typography variant="h6">{proj.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                name: {proj.name}
                            </Typography>
                            <Button
                                variant="text"
                                component={Link}
                                to={`/service/${proj.author_username}/${proj.name}`}
                                className="catalog-more-button"
                            >
                                Подробнее
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
}

export default CatalogPageView;
