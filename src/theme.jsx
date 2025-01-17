// src/theme.jsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Пример цвета
        },
        secondary: {
            main: '#f50057',
        },
    },
    shape: {
        borderRadius: 12, // Закруглённые углы
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

export default theme;
