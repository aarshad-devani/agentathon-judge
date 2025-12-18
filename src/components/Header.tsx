import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  alpha
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      handleClose();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
        borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 58, 237, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.3) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Toolbar sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px",
              // borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'transform 0.2s ease'
            }}
          >
            <GavelIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}
            >
              Agentathon Judge
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: alpha(theme.palette.common.white, 0.7),
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              Evaluation Platform
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'white',
                  fontWeight: 500
                }}
              >
                {user.displayName || 'Judge'}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: alpha(theme.palette.common.white, 0.7),
                  fontFamily: '"JetBrains Mono", monospace'
                }}
              >
                {user.email}
              </Typography>
            </Box>
            
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{
                p: 0,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              <Avatar
                src={user.photoURL}
                sx={{ 
                  width: 40, 
                  height: 40,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: `2px solid ${alpha(theme.palette.common.white, 0.2)}`
                }}
              >
                <PersonIcon />
              </Avatar>
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: '12px',
                  mt: 1,
                  minWidth: 200,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  border: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`
                }
              }}
            >
              <MenuItem 
                onClick={handleSignOut}
                sx={{
                  py: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main
                  }
                }}
              >
                <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                <Typography variant="body2" fontWeight={500}>
                  Sign Out
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
