// src/pages/Catalog/CatalogPageView.jsx

import React from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Skeleton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Pagination,
    Fade
} from '@mui/material';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import './CatalogPage.css';

function CatalogPageView({
                             loading,
                             projects,
                             query,
                             limit,
                             page,
                             totalPages,
                             fadeKey,
                             onQueryChange,
                             onLimitChange,
                             onPageChange
                         }) {
    const handleSubmitSearch = (e) => {
        e.preventDefault();
        // Если нужно обрабатывать Enter...
    };

    const handleLimitSelect = (e) => {
        onLimitChange(parseInt(e.target.value, 10));
    };

    const handlePageSelect = (event, value) => {
        onPageChange(value - 1);
    };

    return (
        <Container maxWidth="md" className="catalog-container">
            {/*<Box*/}
            {/*    component="form"*/}
            {/*    onSubmit={handleSubmitSearch}*/}
            {/*    sx={{*/}
            {/*        display: 'flex',*/}
            {/*        alignItems: 'center',*/}
            {/*        gap: 2,*/}
            {/*        mb: 3,*/}
            {/*        flexWrap: 'wrap',*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Typography variant="h4" sx={{ flex: '1 1 auto' }}>*/}
            {/*        Каталог сервисов*/}
            {/*    </Typography>*/}

            {/*    /!* Поле поиска *!/*/}
            {/*    <TextField*/}
            {/*        size="small"*/}
            {/*        label="Поиск"*/}
            {/*        value={query}*/}
            {/*        onChange={(e) => onQueryChange(e.target.value)}*/}
            {/*        sx={{ minWidth: 200 }}*/}
            {/*    />*/}

            {/*    /!* Выбор limit *!/*/}
            {/*    <FormControl size="small" sx={{ width: 100 }}>*/}
            {/*        <InputLabel id="limit-label">На странице</InputLabel>*/}
            {/*        <Select*/}
            {/*            labelId="limit-label"*/}
            {/*            label="На странице"*/}
            {/*            value={String(limit)}*/}
            {/*            onChange={handleLimitSelect}*/}
            {/*        >*/}
            {/*            <MenuItem value="5">5</MenuItem>*/}
            {/*            <MenuItem value="10">10</MenuItem>*/}
            {/*            <MenuItem value="20">20</MenuItem>*/}
            {/*            <MenuItem value="50">50</MenuItem>*/}
            {/*        </Select>*/}
            {/*    </FormControl>*/}
            {/*</Box>*/}

            {/* Пока грузится - Skeleton */}
            {loading && (
                <>
                    <Skeleton variant="rectangular" height={60} className="catalog-skeleton" />
                    <Skeleton variant="rectangular" height={60} className="catalog-skeleton" />
                </>
            )}

            {/* Если не грузим и нет проектов */}
            {!loading && (!projects || projects.length === 0) && (
                <Typography>В каталоге нет сервисов.</Typography>
            )}

            {/* Fade для плавного появления списка */}
            <Fade in={!loading} key={fadeKey} timeout={400}>
                <Box>
                    {(!loading && projects && projects.length > 0) && (
                        <Box className="catalog-list">
                            {projects.map((proj) => {
                                const createdOnHuman = dayjs(proj.created_on).format('DD.MM.YYYY HH:mm');
                                return (
                                    <Card key={proj.name} className="catalog-card">
                                        <CardContent>
                                            <Typography variant="h6">
                                                {proj.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                title: {proj.title}
                                            </Typography>
                                            {/*<Typography variant="caption" color="text.secondary" display="block">*/}
                                            {/*    Лайков: {proj.like_count}*/}
                                            {/*</Typography>*/}
                                            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'gray' }}>
                                                Дата создания: {createdOnHuman}
                                            </Typography>

                                            <Button
                                                variant="contained"
                                                component={Link}
                                                to={`/service/${proj.author.username}/${proj.name}`}
                                                className="catalog-more-button"
                                                sx={{ mt: 1 }}
                                            >
                                                Открыть
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    )}
                </Box>
            </Fade>

            {/* Пагинация */}
            {/*{!loading && (projects && projects.length > 0) && (*/}
            {/*    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>*/}
            {/*        <Pagination*/}
            {/*            count={totalPages}*/}
            {/*            page={page + 1} // MUI pagination is 1-based*/}
            {/*            onChange={handlePageSelect}*/}
            {/*            color="primary"*/}
            {/*        />*/}
            {/*    </Box>*/}
            {/*)}*/}
        </Container>
    );
}

export default CatalogPageView;
