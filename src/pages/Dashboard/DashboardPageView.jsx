// src/pages/Dashboard/DashboardPageView.jsx
import 'react';
import { Container, Typography, Box, Skeleton } from '@mui/material';
import './DashboardPage.css';

function DashboardPageView({ userData, loading }) {
    return (
        <Container maxWidth="md" className="dashboard-container">
            <Typography variant="h5">Личный кабинет</Typography>

            {loading ? (
                <>
                    <Skeleton variant="rectangular" height={60} className="dashboard-skeleton" />
                    <Skeleton variant="rectangular" height={60} className="dashboard-skeleton" />
                </>
            ) : (
                <>
                    {userData ? (
                        <Box className="dashboard-user">
                            <Typography>Логин: {userData.username}</Typography>
                            <Typography>Отображаемое имя: {userData.display_name}</Typography>
                            <Typography>Дата создания: {userData.created_on}</Typography>
                            {/* userData.projects — список проектов */}
                            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Мои проекты:</Typography>
                            {userData.projects && userData.projects.length > 0 ? (
                                userData.projects.map((p) => (
                                    <Typography key={p.id}>- {p.title} ({p.name})</Typography>
                                ))
                            ) : (
                                <Typography>Нет проектов</Typography>
                            )}
                        </Box>
                    ) : (
                        <Typography>Не удалось загрузить данные</Typography>
                    )}
                </>
            )}
        </Container>
    );
}

export default DashboardPageView;
