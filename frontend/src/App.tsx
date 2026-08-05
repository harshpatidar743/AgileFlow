import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme, CircularProgress } from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';

import {
  Project,
  UserStory,
  TaskItem,
  NotificationItem,
  DashboardStats,
  Status,
} from './types';
import * as api from './api/services';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ConfirmDialog } from './components/ConfirmDialog';
import { ProjectDialog } from './components/ProjectDialog';
import { UserStoryDialog } from './components/UserStoryDialog';
import { TaskDialog } from './components/TaskDialog';

import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { UserStoriesPage } from './pages/UserStoriesPage';
import { TasksPage } from './pages/TasksPage';
import { NotificationsPage } from './pages/NotificationsPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#7c3aed',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
  },
  shape: {
    borderRadius: 8,
  },
});

const AppContent: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Core App Data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Dialog States
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [storyDialogOpen, setStoryDialogOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [defaultStoryProjectId, setDefaultStoryProjectId] = useState<string | undefined>();

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [defaultTaskStoryId, setDefaultTaskStoryId] = useState<string | undefined>();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    action: () => Promise<void>;
  }>({ title: '', message: '', action: async () => {} });

  // Fetch all data
  const fetchData = useCallback(async (showToast = false) => {
    try {
      const [statsData, projectsData, storiesData, tasksData, notifsData, unread] =
        await Promise.all([
          api.getDashboardStats(),
          api.getProjects(),
          api.getUserStories(),
          api.getTasks(),
          api.getNotifications(),
          api.getUnreadNotificationCount(),
        ]);

      setStats(statsData);
      setProjects(projectsData);
      setUserStories(storiesData);
      setTasks(tasksData);
      setNotifications(notifsData);
      setUnreadCount(unread);

      if (showToast) {
        enqueueSnackbar('Data refreshed successfully', { variant: 'success' });
      }
    } catch (err: any) {
      enqueueSnackbar(err.message || 'Failed to load data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchData();

    // Poll for notifications and stats every 10 seconds
    const interval = setInterval(() => {
      api.getUnreadNotificationCount().then(setUnreadCount).catch(() => {});
      api.getNotifications().then(setNotifications).catch(() => {});
      api.getDashboardStats().then(setStats).catch(() => {});
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchData]);

  // Project Handlers
  const handleSaveProject = async (data: Partial<Project>) => {
    try {
      if (selectedProject) {
        await api.updateProject(selectedProject.id, data);
        enqueueSnackbar('Project updated successfully', { variant: 'success' });
      } else {
        await api.createProject(data);
        enqueueSnackbar('Project created successfully', { variant: 'success' });
      }
      setProjectDialogOpen(false);
      fetchData();
    } catch (err: any) {
      enqueueSnackbar(err.message || 'Failed to save project', { variant: 'error' });
    }
  };

  const handleDeleteProject = (project: Project) => {
    setConfirmConfig({
      title: 'Delete Project?',
      message: `Are you sure you want to delete "${project.name}"? This will permanently delete all associated user stories and tasks.`,
      action: async () => {
        await api.deleteProject(project.id);
        enqueueSnackbar('Project deleted', { variant: 'info' });
        fetchData();
      },
    });
    setConfirmDialogOpen(true);
  };

  // User Story Handlers
  const handleSaveUserStory = async (data: Partial<UserStory>) => {
    try {
      if (selectedStory) {
        await api.updateUserStory(selectedStory.id, data);
        enqueueSnackbar('User Story updated successfully', { variant: 'success' });
      } else {
        await api.createUserStory(data);
        enqueueSnackbar('User Story created successfully', { variant: 'success' });
      }
      setStoryDialogOpen(false);
      fetchData();
    } catch (err: any) {
      enqueueSnackbar(err.message || 'Failed to save user story', { variant: 'error' });
    }
  };

  const handleDeleteUserStory = (story: UserStory) => {
    setConfirmConfig({
      title: 'Delete User Story?',
      message: `Are you sure you want to delete "${story.title}"? This will delete all child tasks.`,
      action: async () => {
        await api.deleteUserStory(story.id);
        enqueueSnackbar('User story deleted', { variant: 'info' });
        fetchData();
      },
    });
    setConfirmDialogOpen(true);
  };

  // Task Handlers
  const handleSaveTask = async (data: Partial<TaskItem>) => {
    try {
      if (selectedTask) {
        await api.updateTask(selectedTask.id, data);
        enqueueSnackbar('Task updated successfully', { variant: 'success' });
      } else {
        await api.createTask(data);
        enqueueSnackbar('Task created successfully', { variant: 'success' });
      }
      setTaskDialogOpen(false);
      fetchData();
    } catch (err: any) {
      enqueueSnackbar(err.message || 'Failed to save task', { variant: 'error' });
    }
  };

  const handleTaskStatusChange = async (taskId: string, status: Status) => {
    try {
      await api.updateTaskStatus(taskId, status);
      enqueueSnackbar(`Task status updated to ${status}`, { variant: 'success' });
      fetchData();
    } catch (err: any) {
      enqueueSnackbar(err.message || 'Failed to update task status', { variant: 'error' });
    }
  };

  const handleDeleteTask = (task: TaskItem) => {
    setConfirmConfig({
      title: 'Delete Task?',
      message: `Are you sure you want to delete task "${task.title}"?`,
      action: async () => {
        await api.deleteTask(task.id);
        enqueueSnackbar('Task deleted', { variant: 'info' });
        fetchData();
      },
    });
    setConfirmDialogOpen(true);
  };

  // Notification Handlers
  const handleMarkNotifAsRead = async (id: string) => {
    try {
      await api.markNotificationAsRead(id);
      fetchData();
    } catch (err: any) {
      enqueueSnackbar(err.message || 'Failed to mark notification', { variant: 'error' });
    }
  };

  const handleMarkAllNotifsAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      enqueueSnackbar('All notifications marked as read', { variant: 'success' });
      fetchData();
    } catch (err: any) {
      enqueueSnackbar(err.message || 'Failed to mark all notifications', { variant: 'error' });
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await api.deleteNotification(id);
      enqueueSnackbar('Notification removed', { variant: 'info' });
      fetchData();
    } catch (err: any) {
      enqueueSnackbar(err.message || 'Failed to delete notification', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navbar
        unreadCount={unreadCount}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onRefresh={() => fetchData(true)}
      />

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          unreadCount={unreadCount}
        />

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  stats={stats}
                  notifications={notifications}
                  onOpenProjectDialog={() => {
                    setSelectedProject(null);
                    setProjectDialogOpen(true);
                  }}
                  onOpenStoryDialog={() => {
                    setSelectedStory(null);
                    setStoryDialogOpen(true);
                  }}
                  onOpenTaskDialog={() => {
                    setSelectedTask(null);
                    setTaskDialogOpen(true);
                  }}
                />
              }
            />
            <Route
              path="/projects"
              element={
                <ProjectsPage
                  projects={projects}
                  onOpenCreateDialog={() => {
                    setSelectedProject(null);
                    setProjectDialogOpen(true);
                  }}
                  onOpenEditDialog={(p) => {
                    setSelectedProject(p);
                    setProjectDialogOpen(true);
                  }}
                  onConfirmDelete={handleDeleteProject}
                />
              }
            />
            <Route
              path="/user-stories"
              element={
                <UserStoriesPage
                  userStories={userStories}
                  projects={projects}
                  onOpenCreateDialog={(projId) => {
                    setSelectedStory(null);
                    setDefaultStoryProjectId(projId);
                    setStoryDialogOpen(true);
                  }}
                  onOpenEditDialog={(s) => {
                    setSelectedStory(s);
                    setStoryDialogOpen(true);
                  }}
                  onConfirmDelete={handleDeleteUserStory}
                />
              }
            />
            <Route
              path="/tasks"
              element={
                <TasksPage
                  tasks={tasks}
                  userStories={userStories}
                  projects={projects}
                  onOpenCreateDialog={(storyId) => {
                    setSelectedTask(null);
                    setDefaultTaskStoryId(storyId);
                    setTaskDialogOpen(true);
                  }}
                  onOpenEditDialog={(t) => {
                    setSelectedTask(t);
                    setTaskDialogOpen(true);
                  }}
                  onConfirmDelete={handleDeleteTask}
                  onStatusChange={handleTaskStatusChange}
                />
              }
            />
            <Route
              path="/notifications"
              element={
                <NotificationsPage
                  notifications={notifications}
                  onMarkAsRead={handleMarkNotifAsRead}
                  onMarkAllAsRead={handleMarkAllNotifsAsRead}
                  onDeleteNotification={handleDeleteNotification}
                />
              }
            />
          </Routes>
        </Box>
      </Box>

      {/* Dialog Modals */}
      <ProjectDialog
        open={projectDialogOpen}
        project={selectedProject}
        onClose={() => setProjectDialogOpen(false)}
        onSave={handleSaveProject}
      />

      <UserStoryDialog
        open={storyDialogOpen}
        userStory={selectedStory}
        projects={projects}
        defaultProjectId={defaultStoryProjectId}
        onClose={() => setStoryDialogOpen(false)}
        onSave={handleSaveUserStory}
      />

      <TaskDialog
        open={taskDialogOpen}
        task={selectedTask}
        userStories={userStories}
        defaultUserStoryId={defaultTaskStoryId}
        onClose={() => setTaskDialogOpen(false)}
        onSave={handleSaveTask}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={async () => {
          setConfirmDialogOpen(false);
          await confirmConfig.action();
        }}
      />
    </Box>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Router>
          <AppContent />
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
