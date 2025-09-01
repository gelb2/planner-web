export enum TaskCategory {
  WORK = 'work',
  STUDY = 'study',
  EXERCISE = 'exercise',
  HOBBY = 'hobby',
  OTHER = 'other'
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  estimatedMinutes?: number;
  difficulty?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  timezone: string;
  createdAt: Date;
}

export interface NotificationSettings {
  enabled: boolean;
  time: string;
  frequency: 'daily' | 'weekly' | 'custom';
}

export interface UserPreferences {
  notificationSettings: NotificationSettings;
  darkMode: boolean;
  language: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  streak: number;
  weeklyCompletion: number[];
}