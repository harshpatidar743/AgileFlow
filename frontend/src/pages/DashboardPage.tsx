import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import {
  FolderKanban,
  BookOpen,
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Plus,
} from 'lucide-react';
import { DashboardStats, NotificationItem } from '../types';
import { useNavigate } from 'react-router-dom';

interface DashboardPageProps {
  stats: DashboardStats | null;
  notifications: NotificationItem[];
  hasProjects: boolean;
  hasUserStories: boolean;
  onOpenProjectDialog: () => void;
  onOpenStoryDialog: () => void;
  onOpenTaskDialog: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  notifications,
  hasProjects,
  hasUserStories,
  onOpenProjectDialog,
  onOpenStoryDialog,
  onOpenTaskDialog,
}) => {
  const navigate = useNavigate();

  const completionPercentage =
    stats && stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects ?? 0,
      icon: <FolderKanban size={20} color="#2563eb" />,
      bg: '#eff6ff',
      link: '/projects',
    },
    {
      title: 'User Stories',
      value: stats?.totalUserStories ?? 0,
      icon: <BookOpen size={20} color="#0284c7" />,
      bg: '#f0f9ff',
      link: '/user-stories',
    },
    {
      title: 'Total Tasks',
      value: stats?.totalTasks ?? 0,
      icon: <CheckSquare size={20} color="#7c3aed" />,
      bg: '#f5f3ff',
      link: '/tasks',
    },
    {
      title: 'Completed Tasks',
      value: stats?.completedTasks ?? 0,
      icon: <CheckCircle2 size={20} color="#16a34a" />,
      bg: '#f0fdf4',
      link: '/tasks?status=COMPLETED',
    },
    {
      title: 'Urgent Tasks',
      value: stats?.urgentTasks ?? 0,
      icon: <AlertTriangle size={20} color="#dc2626" />,
      bg: '#fef2f2',
      link: '/tasks?priority=URGENT',
    },
    {
      title: 'Unread Alerts',
      value: stats?.unreadNotificationsCount ?? 0,
      icon: <Bell size={20} color="#ea580c" />,
      bg: '#fff7ed',
      link: '/notifications',
    },
  ];

  return (
    <Box sx={{ pb: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 750, color: '#0f172a' }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.25 }}>
            Agile Work Metrics & Real-time Progress Tracking for Small Teams
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={onOpenProjectDialog}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            New Project
          </Button>
          {hasProjects && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Plus size={16} />}
              onClick={onOpenStoryDialog}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              New User Story
            </Button>
          )}
          {hasUserStories && (
            <Button
              variant="contained"
              size="small"
              startIcon={<Plus size={16} />}
              onClick={onOpenTaskDialog}
              sx={{ textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
            >
              New Task
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={card.title}>
            <Card
              elevation={0}
              onClick={() => navigate(card.link)}
              sx={{
                border: '1px solid #e2e8f0',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 18px -12px rgba(15, 23, 42, 0.35)',
                  borderColor: '#cbd5e1',
                },
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1, mt: 0.75 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 2,
                      backgroundColor: card.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 750, mb: 0.5, color: '#0f172a' }}>
              Overall Task Completion Rate
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
              {stats?.completedTasks ?? 0} out of {stats?.totalTasks ?? 0} tasks completed
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={completionPercentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #2563eb 0%, #16a34a 100%)',
                    },
                  }}
                />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, minWidth: 46, textAlign: 'right' }}>
                {completionPercentage}%
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  To Do
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 750, color: '#334155', lineHeight: 1.2 }}>
                  {stats?.todoTasks ?? 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 600 }}>
                  In Progress
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 750, color: '#0284c7', lineHeight: 1.2 }}>
                  {stats?.inProgressTasks ?? 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 600 }}>
                  Completed
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 750, color: '#16a34a', lineHeight: 1.2 }}>
                  {stats?.completedTasks ?? 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 750, color: '#0f172a' }}>
                Recent Background Alerts
              </Typography>
              <Button
                size="small"
                onClick={() => navigate('/notifications')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                View All
              </Button>
            </Box>

            {notifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3, color: '#94a3b8' }}>
                <Bell size={32} style={{ marginBottom: 6, opacity: 0.5 }} />
                <Typography variant="body2">No background notifications generated yet.</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  (Set a task due date within 24 hours to test background scheduler alerts)
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {notifications.slice(0, 4).map((n) => (
                  <Box
                    key={n.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: n.isRead ? '#f8fafc' : '#fff7ed',
                      border: '1px solid',
                      borderColor: n.isRead ? '#e2e8f0' : '#fed7aa',
                      borderLeft: `3px solid ${n.isRead ? '#cbd5e1' : '#f97316'}`,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: n.isRead ? 400 : 650, color: '#1e293b', lineHeight: 1.45 }}>
                      {n.message}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', mt: 0.25, display: 'block' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
