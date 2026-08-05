import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Tooltip,
  Box,
  Button,
} from '@mui/material';
import { Bell, Menu, Code2, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  unreadCount: number;
  onToggleSidebar: () => void;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ unreadCount, onToggleSidebar, onRefresh }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#1e293b' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={onToggleSidebar}>
            <Menu size={20} />
          </IconButton>
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'opacity 0.2s ease',
              '&:hover': {
                opacity: 0.85,
              },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.2rem',
              }}
            >
              A
            </Box>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
              AgileFlow <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Project Tool</span>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Refresh Application Data">
            <IconButton color="inherit" onClick={onRefresh}>
              <RotateCw size={18} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Open API Documentation (Swagger)">
            <Button
              variant="outlined"
              size="small"
              startIcon={<Code2 size={16} />}
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Swagger Docs
            </Button>
          </Tooltip>

          <Tooltip title="Notifications Inbox">
            <IconButton color="inherit" onClick={() => navigate('/notifications')}>
              <Badge badgeContent={unreadCount} color="error">
                <Bell size={20} />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
