import { useState, useEffect } from 'react';
import { Header } from '@/widgets/Header/Header';
import { StatsCard } from '@/widgets/StatsCard/StatsCard';
import { TaskList } from '@/widgets/TaskList/TaskList';
import { TaskForm } from '@/features/task-management';
import { Task, TaskCategory, TaskStatus, User } from '@/shared/types';
import { useTheme } from '@/app/providers/ThemeProvider';
import { tasksApi, statsApi } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Plus, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { isToday } from '@/shared/lib/dateUtils';

// Mock user data (TODO: Replace with actual user data from API)
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: '김철수',
  profileImage: '',
  timezone: 'Asia/Seoul',
  createdAt: new Date()
};

export function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stats state
  const [dashboardStats, setDashboardStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    currentStreak: 0,
    todayTasks: 0
  });

  const { theme, setTheme } = useTheme();

  // Load tasks and stats from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load tasks and stats in parallel
        const [tasksResponse, statsResponse] = await Promise.all([
          tasksApi.getTasks(),
          statsApi.getDashboardStats()
        ]);

        if (tasksResponse.success) {
          // Convert date strings back to Date objects
          const tasksWithDates = tasksResponse.data.tasks.map(task => ({
            ...task,
            dueDate: new Date(task.dueDate),
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt)
          }));
          setTasks(tasksWithDates);
        }

        if (statsResponse.success) {
          setDashboardStats(statsResponse.data);
        }
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error('Failed to load data:', err);
        
        // Fallback to empty data
        setTasks([]);
        setDashboardStats({
          totalTasks: 0,
          completedTasks: 0,
          completionRate: 0,
          currentStreak: 0,
          todayTasks: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      if (editingTask) {
        // Update existing task
        const response = await tasksApi.updateTask(editingTask.id, taskData);
        if (response.success) {
          setTasks(prev => prev.map(task => 
            task.id === editingTask.id 
              ? { 
                  ...response.data, 
                  dueDate: new Date(response.data.dueDate),
                  createdAt: new Date(response.data.createdAt),
                  updatedAt: new Date(response.data.updatedAt)
                }
              : task
          ));
        }
      } else {
        // Create new task
        const response = await tasksApi.createTask(taskData);
        if (response.success) {
          const newTask = {
            ...response.data,
            dueDate: new Date(response.data.dueDate),
            createdAt: new Date(response.data.createdAt),
            updatedAt: new Date(response.data.updatedAt)
          };
          setTasks(prev => [newTask, ...prev]);
        }
      }
      setIsTaskFormOpen(false);
      setEditingTask(undefined);
      
      // Refresh stats after task changes
      const statsResponse = await statsApi.getDashboardStats();
      if (statsResponse.success) {
        setDashboardStats(statsResponse.data);
      }
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const response = await tasksApi.updateTaskStatus(taskId, TaskStatus.COMPLETED);
      if (response.success) {
        setTasks(prev => prev.map(task =>
          task.id === taskId
            ? { 
                ...response.data,
                dueDate: new Date(response.data.dueDate),
                createdAt: new Date(response.data.createdAt),
                updatedAt: new Date(response.data.updatedAt)
              }
            : task
        ));
        
        // Refresh stats
        const statsResponse = await statsApi.getDashboardStats();
        if (statsResponse.success) {
          setDashboardStats(statsResponse.data);
        }
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await tasksApi.deleteTask(taskId);
      if (response.success) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        
        // Refresh stats
        const statsResponse = await statsApi.getDashboardStats();
        if (statsResponse.success) {
          setDashboardStats(statsResponse.data);
        }
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      const response = await tasksApi.updateTaskStatus(taskId, status);
      if (response.success) {
        setTasks(prev => prev.map(task =>
          task.id === taskId
            ? { 
                ...response.data,
                dueDate: new Date(response.data.dueDate),
                createdAt: new Date(response.data.createdAt),
                updatedAt: new Date(response.data.updatedAt)
              }
            : task
        ));
        
        // Refresh stats
        const statsResponse = await statsApi.getDashboardStats();
        if (statsResponse.success) {
          setDashboardStats(statsResponse.data);
        }
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  const handleToggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={mockUser}
        notificationCount={3}
        onAddTask={handleAddTask}
        onProfileClick={() => console.log('Profile clicked')}
        onNotificationsClick={() => console.log('Notifications clicked')}
        darkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">안녕하세요, {mockUser.name}님! 👋</h1>
            <p className="text-muted-foreground">오늘 완료할 과제: {dashboardStats.todayTasks}개</p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAddTask}>
              <Plus className="h-4 w-4 mr-2" />
              새 과제 추가
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              캘린더 보기
            </Button>
            <Button variant="outline">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              완료된 과제
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <StatsCard
          completionRate={dashboardStats.completionRate}
          totalTasks={dashboardStats.totalTasks}
          completedTasks={dashboardStats.completedTasks}
          streak={dashboardStats.currentStreak}
          todayTasks={dashboardStats.todayTasks}
        />

        {/* Today's Schedule Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>오늘의 일정</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.filter(task => isToday(task.dueDate) && task.status !== TaskStatus.COMPLETED).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                오늘 예정된 과제가 없습니다. 새로운 과제를 추가해보세요!
              </p>
            ) : (
              <div className="space-y-2">
                {tasks
                  .filter(task => isToday(task.dueDate) && task.status !== TaskStatus.COMPLETED)
                  .slice(0, 3)
                  .map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {task.estimatedMinutes}분 소요
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        시작
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onCompleteTask={handleCompleteTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />

        {/* Task Form Modal */}
        <TaskForm
          task={editingTask}
          onSubmit={handleTaskSubmit}
          onCancel={handleCloseTaskForm}
          isOpen={isTaskFormOpen}
        />
      </main>
    </div>
  );
}