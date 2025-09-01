import { apiClient } from './client';
import type { TaskStats } from '@/shared/types';

interface DashboardStatsResponse {
  success: boolean;
  data: {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    currentStreak: number;
    bestStreak: number;
    todayTasks: number;
    weeklyCompletion: number[];
    categoryStats: {
      category: string;
      total: number;
      completed: number;
    }[];
  };
  message: string;
}

export const statsApi = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    const response = await apiClient.get('/api/v1/stats/dashboard');
    return response.data;
  },
};