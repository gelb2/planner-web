import { useState, useEffect } from 'react';
import { Header } from '@/widgets/Header/Header';
import { StatsCard } from '@/widgets/StatsCard/StatsCard';
import { TaskList } from '@/widgets/TaskList/TaskList';
import { TaskForm } from '@/features/task-management';
import { Task, TaskCategory, TaskStatus, User } from '@/shared/types';
import { useTheme } from '@/app/providers/ThemeProvider';

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: '김철수',
  profileImage: '',
  timezone: 'Asia/Seoul',
  createdAt: new Date()
};

// Mock initial tasks data
const createMockTasks = (): Task[] => {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  return [
    {
      id: '1',
      title: '프로젝트 기획서 작성',
      description: '새로운 웹 애플리케이션 프로젝트를 위한 기획서를 작성합니다.',
      category: TaskCategory.WORK,
      status: TaskStatus.IN_PROGRESS,
      dueDate: now,
      createdAt: yesterday,
      updatedAt: now,
      userId: '1',
      estimatedMinutes: 120,
      difficulty: 3
    },
    {
      id: '2',
      title: 'React 강의 수강',
      description: 'React 고급 기능에 대한 온라인 강의를 수강합니다.',
      category: TaskCategory.STUDY,
      status: TaskStatus.PENDING,
      dueDate: tomorrow,
      createdAt: yesterday,
      updatedAt: now,
      userId: '1',
      estimatedMinutes: 90,
      difficulty: 2
    },
    {
      id: '3',
      title: '헬스장 운동',
      description: '주 3회 헬스장에서 웨이트 트레이닝을 합니다.',
      category: TaskCategory.EXERCISE,
      status: TaskStatus.COMPLETED,
      dueDate: yesterday,
      createdAt: new Date(Date.now() - 86400000 * 2),
      updatedAt: yesterday,
      userId: '1',
      estimatedMinutes: 60,
      difficulty: 2
    },
    {
      id: '4',
      title: '독서: 클린 코드',
      description: '로버트 마틴의 클린 코드 책을 읽고 정리합니다.',
      category: TaskCategory.HOBBY,
      status: TaskStatus.PENDING,
      dueDate: nextWeek,
      createdAt: yesterday,
      updatedAt: now,
      userId: '1',
      estimatedMinutes: 180,
      difficulty: 3
    },
    {
      id: '5',
      title: '병원 예약',
      description: '정기 건강검진 예약을 잡습니다.',
      category: TaskCategory.OTHER,
      status: TaskStatus.PENDING,
      dueDate: new Date(Date.now() + 86400000 * 3),
      createdAt: now,
      updatedAt: now,
      userId: '1',
      estimatedMinutes: 30,
      difficulty: 1
    }
  ];
};

export function HomePage() {
  const { theme, setTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>(createMockTasks());
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const todayTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  }).length;
  
  // Mock streak calculation (would come from backend in real app)
  const streak = 5;

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: TaskStatus.COMPLETED, updatedAt: new Date() }
        : task
    ));
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status, updatedAt: new Date() }
        : task
    ));
  };

  const handleTaskFormSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const now = new Date();
    
    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? {
              ...task,
              ...taskData,
              updatedAt: now
            }
          : task
      ));
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
        createdAt: now,
        updatedAt: now,
        userId: mockUser.id
      };
      setTasks(prev => [newTask, ...prev]);
    }

    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  const handleTaskFormCancel = () => {
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  const handleToggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleNotificationsClick = () => {
    // Mock notification handler
    console.log('Notifications clicked');
  };

  const handleProfileClick = () => {
    // Mock profile handler
    console.log('Profile clicked');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        user={mockUser}
        notificationCount={3}
        onAddTask={handleAddTask}
        onProfileClick={handleProfileClick}
        onNotificationsClick={handleNotificationsClick}
        darkMode={theme === 'dark'}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <section>
          <StatsCard
            completionRate={completionRate}
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            streak={streak}
            todayTasks={todayTasks}
          />
        </section>

        {/* Task List */}
        <section>
          <TaskList
            tasks={tasks}
            onCompleteTask={handleCompleteTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        </section>
      </main>

      {/* Task Form Modal */}
      <TaskForm
        task={editingTask}
        onSubmit={handleTaskFormSubmit}
        onCancel={handleTaskFormCancel}
        isOpen={isTaskFormOpen}
      />
    </div>
  );
}