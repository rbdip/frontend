// src/pages/ServiceForm/ServiceFormPageView.jsx
import 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
} from '@mui/material';
import './ServiceFormPage.css';

function ServiceFormPageView({ editMode, onSubmit, register, errors }) {
    return (
        <Container maxWidth="sm" className="service-form-container">
            <Box className="service-form-box">
                <Typography variant="h5" gutterBottom>
                    {editMode ? 'Редактировать сервис' : 'Создать новый сервис'}
                </Typography>

                <form onSubmit={onSubmit} className="service-form">
                    <TextField
                        label="Name (уникальный идентификатор)"
                        fullWidth
                        margin="normal"
                        {...register('name', { required: 'Введите name' })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        disabled={editMode}
                    />
                    <TextField
                        label="Title (название)"
                        fullWidth
                        margin="normal"
                        {...register('title', { required: 'Введите title' })}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                    />
                    <TextField
                        label="Description (описание)"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        {...register('description')}
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
