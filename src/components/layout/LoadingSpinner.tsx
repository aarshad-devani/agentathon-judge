import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

const LoadingSpinner: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 3,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 58, 237, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Fade in timeout={600}>
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box
            sx={{
              position: 'relative',
              display: 'inline-block',
              mb: 2
            }}
          >
            <CircularProgress 
              size={80} 
              thickness={4}
              sx={{
                color: 'transparent',
                '& .MuiCircularProgress-circle': {
                  stroke: 'url(#gradient)',
                  strokeLinecap: 'round'
                }
              }}
            />
            <svg width={0} height={0}>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
            </svg>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #3b82f6 100%)',
                opacity: 0.1,
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          </Box>
          
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Agentathon Judge
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontSize: '0.875rem'
            }}
          >
            Loading Platform...
          </Typography>
        </Box>
      </Fade>
      
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.1;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 0.2;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default LoadingSpinner;
