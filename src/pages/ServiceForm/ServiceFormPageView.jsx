// src/pages/ServiceForm/ServiceFormPageView.jsx
import 'react';
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
                    <TextField
                        label="Name (уникальный)"
                        fullWidth
                        margin="normal"
                        {...register('name', { required: !editMode })}
                        error={!!errors.name}
                        helperText={errors.name ? 'Укажите name (обязательно при создании)' : ''}
                        // disabled={editMode}
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
                        label="Описание (description)"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        {...register('description')}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />

                    {/*<TextField*/}
                    {/*    label="Версия (display_version) (не обязательно)"*/}
                    {/*    fullWidth*/}
                    {/*    margin="normal"*/}
                    {/*    {...register('display_version')}*/}
                    {/*    error={!!errors.display_version}*/}
                    {/*    helperText={errors.display_version?.message}*/}
                    {/*/>*/}

                    {/*<TextField*/}
                    {/*    label="Порядок версии (display_order) (не обязательно)"*/}
                    {/*    fullWidth*/}
                    {/*    margin="normal"*/}
                    {/*    type="number"*/}
                    {/*    {...register('display_order')}*/}
                    {/*    error={!!errors.display_order}*/}
                    {/*    helperText={errors.display_order?.message}*/}
                    {/*/>*/}

                    <Button variant="contained" type="submit" className="service-form-button">
                        {editMode ? 'Сохранить' : 'Создать'}
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default ServiceFormPageView;
