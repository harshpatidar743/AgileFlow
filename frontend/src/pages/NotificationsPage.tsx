import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Chip,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Trash2,
  Info,
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Background Notifications Inbox
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Automated alerts triggered by Spring Scheduler background task monitoring
          </Typography>
        </Box>

        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<CheckCheck size={16} />}
            onClick={onMarkAllAsRead}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Mark All as Read
          </Button>
        )}
      </Box>

      <Alert
        icon={<Info size={20} />}
        severity="info"
        sx={{ mb: 4, borderRadius: 3, border: '1px solid #bfdbfe' }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          How Async Scheduler Notifications Work:
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          The backend runs a Spring Scheduler worker (<code>TaskReminderScheduler</code>) every minute. It checks SQLite for tasks due within the next 24 hours that have not been notified yet, inserts a notification record, and marks <code>notified = true</code>.
        </Typography>
      </Alert>

      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
        {notifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: '#94a3b8' }}>
            <Bell size={48} style={{ marginBottom: 8, opacity: 0.4 }} />
            <Typography variant="h6">No Notifications</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Create a Task with a due date set within the next 24 hours to test background reminders!
            </Typography>
          </Box>
        ) : (
          notifications.map((n, idx) => (
            <Box
              key={n.id}
              sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: n.isRead ? '#ffffff' : '#fff7ed',
                borderBottom: idx < notifications.length - 1 ? '1px solid #f1f5f9' : 'none',
                transition: 'background-color 0.2s ease',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexGrow: 1, pr: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: n.isRead ? '#f1f5f9' : '#ffedd5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 0.5,
                  }}
                >
                  <Bell size={20} color={n.isRead ? '#64748b' : '#ea580c'} />
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ fontWeight: n.isRead ? 400 : 600, color: '#0f172a' }}>
                    {n.message}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </Typography>
                    {!n.isRead && (
                      <Chip label="Unread Alert" color="warning" size="small" sx={{ height: 18, fontSize: '0.7rem', fontWeight: 700 }} />
                    )}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {!n.isRead && (
                  <Tooltip title="Mark as Read">
                    <IconButton size="small" color="primary" onClick={() => onMarkAsRead(n.id)}>
                      <CheckCircle2 size={18} />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete Notification">
                  <IconButton size="small" color="error" onClick={() => onDeleteNotification(n.id)}>
                    <Trash2 size={18} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
};
