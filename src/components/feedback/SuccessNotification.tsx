import React from 'react';
import { 
  Snackbar, 
  Alert, 
  AlertProps, 
  Slide, 
  SlideProps,
  useTheme,
  alpha 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

interface SuccessNotificationProps {
  open: boolean;
  message: string;
  severity?: AlertProps['severity'];
  onClose: () => void;
  duration?: number;
}

const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="up" />;
};

const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  open,
  message,
  severity = 'success',
  onClose,
  duration = 6000
}) => {
  const theme = useTheme();

  const getIcon = () => {
    switch (severity) {
      case 'success': return <CheckCircleIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'info': return <InfoIcon />;
      default: return <CheckCircleIcon />;
    }
  };

  const getGradient = () => {
    switch (severity) {
      case 'success': return 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
      case 'error': return 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)';
      case 'warning': return 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)';
      case 'info': return 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)';
      default: return 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ zIndex: theme.zIndex.snackbar + 1 }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        icon={getIcon()}
        sx={{
          minWidth: 350,
          background: getGradient(),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          borderRadius: 3,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          color: 'white',
          fontSize: '0.9rem',
          fontWeight: 500,
          '& .MuiAlert-icon': {
            color: 'white',
            fontSize: '1.5rem'
          },
          '& .MuiAlert-action': {
            color: 'white',
            '& .MuiButtonBase-root': {
              color: 'white'
            }
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessNotification;
