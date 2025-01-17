// src/pages/ServiceForm/ServiceFormPageView.jsx
import React from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Skeleton,
} from '@mui/material';
import './ServiceFormPage.css';

function ServiceFormPageView({
                                 editMode,
                                 loading,
                                 onSubmit,
                                 register,
                                 errors,
                             }) {
    if (loading) {
        return (
            <Container maxWidth="sm" className="service-form-container">
                <Box className="service-form-box">
                    <Skeleton height={40} width="60%" />
                    <Skeleton height={20} width="100%" sx={{ mt: 2 }} />
                    <Skeleton height={20} width="100%" />
                    <Skeleton height={20} width="100%" />
                    <Skeleton height={40} width="30%" sx={{ mt: 2 }} />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" className="service-form-container">
            <Box className="service-form-box">
                <Typography variant="h5" gutterBottom>
                    {editMode ? 'Редактировать сервис' : 'Создать новый сервис'}
                </Typography>

                <form onSubmit={onSubmit} className="service-form">
                    {/* project_name — если это обновление, разрешаем изменить имя? */}
                    <TextField
                        label="Project name (уникальный)"
                        fullWidth
                        margin="normal"
                        {...register('project_name')}
                        // Ошибки, если нужны:
                        error={!!errors.project_name}
                        helperText={errors.project_name?.message}
                    />

                    <TextField
                        label="Заголовок (title)"
                        fullWidth
                        margin="normal"
                        {...register('title')}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                    />

                    <TextField
                        label="Версия (version_name)"
                        fullWidth
                        margin="normal"
                        {...register('version_name')}
                        error={!!errors.version_name}
                        helperText={errors.version_name?.message}
                    />

                    <TextField
                        label="Описание (description)"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        {...register('description')}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />

                    <Button variant="contained" type="submit" className="service-form-button">
                        {editMode ? 'Сохранить' : 'Создать'}
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default ServiceFormPageView;
