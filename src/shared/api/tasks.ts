import { apiClient } from './client';
import type { Task } from '@/shared/types';

interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
}

interface TasksParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const tasksApi = {
  // Get all tasks
  getTasks: async (params?: TasksParams): Promise<TasksResponse> => {
    const response = await apiClient.get('/api/v1/tasks', { params });
    return response.data;
  },

  // Create a new task
  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<{ success: boolean; data: Task; message: string }> => {
    const response = await apiClient.post('/api/v1/tasks', taskData);
    return response.data;
  },

  // Update a task
  updateTask: async (id: string, taskData: Partial<Task>): Promise<{ success: boolean; data: Task; message: string }> => {
    const response = await apiClient.put(`/api/v1/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/api/v1/tasks/${id}`);
    return response.data;
  },

  // Update task status
  updateTaskStatus: async (id: string, status: string): Promise<{ success: boolean; data: Task; message: string }> => {
    const response = await apiClient.put(`/api/v1/tasks/${id}/status`, { status });
    return response.data;
  },
};