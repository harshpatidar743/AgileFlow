import apiClient from './apiClient';
import { Project, UserStory, TaskItem, NotificationItem, DashboardStats, Status } from '../types';

// Projects API
export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get<Project[]>('/projects');
  return response.data;
};

export const getProjectById = async (id: string): Promise<Project> => {
  const response = await apiClient.get<Project>(`/projects/${id}`);
  return response.data;
};

export const createProject = async (data: Partial<Project>): Promise<Project> => {
  const response = await apiClient.post<Project>('/projects', data);
  return response.data;
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
  const response = await apiClient.put<Project>(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await apiClient.delete(`/projects/${id}`);
};

// User Stories API
export const getUserStories = async (projectId?: string): Promise<UserStory[]> => {
  const params = projectId ? { projectId } : {};
  const response = await apiClient.get<UserStory[]>('/user-stories', { params });
  return response.data;
};

export const getUserStoryById = async (id: string): Promise<UserStory> => {
  const response = await apiClient.get<UserStory>(`/user-stories/${id}`);
  return response.data;
};

export const createUserStory = async (data: Partial<UserStory>): Promise<UserStory> => {
  const response = await apiClient.post<UserStory>('/user-stories', data);
  return response.data;
};

export const updateUserStory = async (id: string, data: Partial<UserStory>): Promise<UserStory> => {
  const response = await apiClient.put<UserStory>(`/user-stories/${id}`, data);
  return response.data;
};

export const deleteUserStory = async (id: string): Promise<void> => {
  await apiClient.delete(`/user-stories/${id}`);
};

// Tasks API
export const getTasks = async (userStoryId?: string, projectId?: string): Promise<TaskItem[]> => {
  const params: Record<string, string> = {};
  if (userStoryId) params.userStoryId = userStoryId;
  if (projectId) params.projectId = projectId;
  const response = await apiClient.get<TaskItem[]>('/tasks', { params });
  return response.data;
};

export const createTask = async (data: Partial<TaskItem>): Promise<TaskItem> => {
  const response = await apiClient.post<TaskItem>('/tasks', data);
  return response.data;
};

export const updateTask = async (id: string, data: Partial<TaskItem>): Promise<TaskItem> => {
  const response = await apiClient.put<TaskItem>(`/tasks/${id}`, data);
  return response.data;
};

export const updateTaskStatus = async (id: string, status: Status): Promise<TaskItem> => {
  const response = await apiClient.patch<TaskItem>(`/tasks/${id}/status`, null, {
    params: { status },
  });
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};

// Notifications API
export const getNotifications = async (): Promise<NotificationItem[]> => {
  const response = await apiClient.get<NotificationItem[]>('/notifications');
  return response.data;
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await apiClient.get<{ unreadCount: number }>('/notifications/unread-count');
  return response.data.unreadCount;
};

export const markNotificationAsRead = async (id: string): Promise<NotificationItem> => {
  const response = await apiClient.patch<NotificationItem>(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await apiClient.patch('/notifications/read-all');
};

export const deleteNotification = async (id: string): Promise<void> => {
  await apiClient.delete(`/notifications/${id}`);
};

// Dashboard API
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>('/dashboard/stats');
  return response.data;
};
