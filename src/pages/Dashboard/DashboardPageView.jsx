// src/pages/Dashboard/DashboardPageView.jsx
import 'react';
import { Container, Typography } from '@mui/material';
import './DashboardPage.css';

function DashboardPageView({ username }) {
    return (
        <Container maxWidth="md" className="dashboard-container">
            <Typography variant="h5">Личный кабинет</Typography>
            <Typography className="dashboard-welcome">
                Добро пожаловать, {username}!
            </Typography>
        </Container>
    );
}

export default DashboardPageView;
