export type Status = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Project {
  id: string;
  name: string;
  description?: string;
  totalUserStories: number;
  totalTasks: number;
  completedTasks: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserStory {
  id: string;
  projectId: string;
  projectName?: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  totalTasks: number;
  completedTasks: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  userStoryId: string;
  userStoryTitle?: string;
  projectId?: string;
  projectName?: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  dueDate?: string | null;
  notified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  taskId?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalUserStories: number;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  urgentTasks: number;
  unreadNotificationsCount: number;
}
