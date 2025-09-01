import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatsCard } from './components/StatsCard';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Plus, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Task, TaskCategory, TaskStatus } from './types';
import { isToday } from './utils/dateUtils';

// Mock data for demonstration
const mockUser = {
  id: '1',
  name: '홍길동',
  email: 'hong@example.com',
  profileImage: '',
  timezone: 'Asia/Seoul',
  createdAt: new Date()
};

const generateMockTasks = (): Task[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return [
    {
      id: '1',
      title: '아침 운동',
      description: '30분 동안 조깅하기',
      category: TaskCategory.EXERCISE,
      status: TaskStatus.PENDING,
      dueDate: today,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: '1',
      estimatedMinutes: 30
    },
    {
      id: '2',
      title: '프로젝트 리뷰',
      description: '지난 주 프로젝트 진행사항 점검 및 다음 주 계획 수립',
      category: TaskCategory.WORK,
      status: TaskStatus.IN_PROGRESS,
      dueDate: today,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: '1',
      estimatedMinutes: 60
    },
    {
      id: '3',
      title: '영어 공부',
      description: '토익 단어 50개 암기',
      category: TaskCategory.STUDY,
      status: TaskStatus.PENDING,
      dueDate: today,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: '1',
      estimatedMinutes: 45
    },
    {
      id: '4',
      title: '독서',
      description: '자기계발서 1장 읽기',
      category: TaskCategory.HOBBY,
      status: TaskStatus.COMPLETED,
      dueDate: yesterday,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: '1',
      estimatedMinutes: 60
    },
    {
      id: '5',
      title: '미팅 준비',
      description: '내일 오전 미팅 자료 준비',
      category: TaskCategory.WORK,
      status: TaskStatus.PENDING,
      dueDate: tomorrow,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: '1',
      estimatedMinutes: 90
    }
  ];
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(generateMockTasks());
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [darkMode, setDarkMode] = useState(false);

  // Calculate statistics
  const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const todayTasks = tasks.filter(task => isToday(task.dueDate)).length;
  const streak = 5; // Mock streak data

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData, updatedAt: new Date() }
          : task
      ));
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: mockUser.id
      };
      setTasks(prev => [newTask, ...prev]);
    }
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status: TaskStatus.COMPLETED, updatedAt: new Date() }
        : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status, updatedAt: new Date() }
        : task
    ));
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={mockUser}
        notificationCount={3}
        onAddTask={handleAddTask}
        onProfileClick={() => console.log('Profile clicked')}
        onNotificationsClick={() => console.log('Notifications clicked')}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">안녕하세요, {mockUser.name}님! 👋</h1>
            <p className="text-muted-foreground">오늘 완료할 과제: {todayTasks}개</p>
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
          completionRate={completionRate}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          streak={streak}
          todayTasks={todayTasks}
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