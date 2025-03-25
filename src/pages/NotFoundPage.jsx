import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        color: '#1976d2',
        textAlign: 'center',
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px',
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '4em', marginBottom: '0.2em' }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ fontSize: '1.5em', marginBottom: '1em' }}>
        ¡Ups! Parece que la página que buscas no se encontró.
      </Typography>
      <img
        src="/assets/cat.png"
        alt="Gatito kawaii"
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          marginBottom: '1em',
        }}
      />
      <Typography variant="body1" sx={{ fontSize: '1.2em' }}>
        Quizás este gatito pueda alegrarte el día.
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
          marginTop: '1em',
          '&:hover': { backgroundColor: '#1976d2' },
        }}
        onClick={handleGoHome}
      >
        Volver a la página principal
      </Button>
    </Box>
  );
};

export default NotFoundPage;
