import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  CheckSquare,
  Bell,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  unreadCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose, unreadCount }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { text: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { text: 'User Stories', path: '/user-stories', icon: <BookOpen size={20} /> },
    { text: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    {
      text: 'Notifications',
      path: '/notifications',
      icon: <Bell size={20} />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 900) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ width: 260, pt: 2, pb: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 3, pb: 2 }}>
        <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: 1 }}>
          Agile Workflow
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Team Work Tracker
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem disablePadding key={item.text} sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: '8px',
                  '&.Mui-selected': {
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    fontWeight: 600,
                    '& .MuiListItemIcon-root': { color: '#2563eb' },
                  },
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isSelected ? '#2563eb' : '#64748b' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: isSelected ? 600 : 500,
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    color="error"
                    size="small"
                    sx={{ height: 20, fontSize: '0.75rem', fontWeight: 700 }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', px: 3, pt: 2 }}>
        <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontWeight: 600 }}>
            AgileFlow Project Tool
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
            Spring Boot + SQLite + React
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260 },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
            borderRight: '1px solid #e2e8f0',
            top: '64px',
            height: 'calc(100vh - 64px)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
