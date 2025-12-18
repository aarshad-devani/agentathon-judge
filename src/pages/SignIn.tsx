import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
  Fade,
  Slide
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useAuth } from '../contexts/AuthContext';

const SignIn: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const theme = useTheme();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
        overflow: 'hidden',
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
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
              gap: 8,
              alignItems: 'center',
              width: '100%'
            }}
          >
            {/* Left side - Hero content */}
            <Fade in timeout={800}>
              <Box sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: { xs: 'center', lg: 'flex-start' } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                      boxShadow: '0 20px 25px -5px rgba(124, 58, 237, 0.2), 0 10px 10px -5px rgba(124, 58, 237, 0.1)'
                    }}
                  >
                    <GavelIcon sx={{ color: 'white', fontSize: 32 }} />
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"JetBrains Mono", monospace',
                      color: theme.palette.text.secondary,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase'
                    }}
                  >
                    Powered by AI
                  </Typography>
                </Box>
                
                <Typography 
                  variant="h1" 
                  sx={{ 
                    mb: 3,
                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  Agentathon Judge Platform
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4, 
                    color: theme.palette.text.secondary,
                    lineHeight: 1.6,
                    fontWeight: 400
                  }}
                >
                  Professional evaluation platform for AI innovation competitions. 
                  Streamlined assessment tools with real-time collaboration and comprehensive analytics.
                </Typography>

                {/* Feature highlights */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                  {[
                    { icon: SecurityIcon, text: 'Secure Google Authentication' },
                    { icon: SpeedIcon, text: 'Fast & Intuitive Evaluation' },
                    { icon: VerifiedIcon, text: 'Real-time Data Synchronization' }
                  ].map((feature, index) => (
                    <Fade in timeout={1000 + index * 200} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'center', lg: 'flex-start' } }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main
                          }}
                        >
                          <feature.icon sx={{ fontSize: 14 }} />
                        </Box>
                        <Typography variant="body1" color="text.secondary">
                          {feature.text}
                        </Typography>
                      </Box>
                    </Fade>
                  ))}
                </Box>
              </Box>
            </Fade>

            {/* Right side - Sign in card */}
            <Slide direction="left" in timeout={1000}>
              <Card 
                sx={{ 
                  maxWidth: 480, 
                  width: '100%',
                  mx: 'auto',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }
                }}
              >
                <CardContent sx={{ p: 6 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'transparent',
                        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                        boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.2), 0 10px 10px -5px rgba(37, 99, 235, 0.1)'
                      }}
                    >
                      <GavelIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Avatar>
                    
                    <Typography variant="h4" component="h1" gutterBottom>
                      Welcome Judge
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                      Sign in with your Google account to access the evaluation platform and start judging innovative AI projects.
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    sx={{
                      py: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                      boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2), 0 4px 6px -2px rgba(37, 99, 235, 0.1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.3), 0 10px 10px -5px rgba(37, 99, 235, 0.2)'
                      },
                      '&:disabled': {
                        background: alpha(theme.palette.action.disabled, 0.1)
                      }
                    }}
                  >
                    {isLoading ? 'Signing in...' : 'Continue with Google'}
                  </Button>

                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      By signing in, you agree to the platform's terms of service and privacy policy.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Slide>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SignIn;
