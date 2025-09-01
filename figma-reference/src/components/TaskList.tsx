import { useState } from 'react';
import { TaskItem } from './TaskItem';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, Filter, Calendar, CheckSquare } from 'lucide-react';
import { Task, TaskCategory, TaskStatus } from '../types';
import { isToday, isTomorrow, isPast } from '../utils/dateUtils';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

type FilterType = 'all' | 'today' | 'tomorrow' | 'overdue' | 'completed' | 'pending';
type SortType = 'dueDate' | 'created' | 'priority' | 'category';

export function TaskList({
  tasks,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
  onStatusChange
}: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('dueDate');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Text search
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }

    // Date and status filters
    switch (filterType) {
      case 'today':
        return isToday(task.dueDate);
      case 'tomorrow':
        return isTomorrow(task.dueDate);
      case 'overdue':
        return isPast(task.dueDate) && task.status !== TaskStatus.COMPLETED;
      case 'completed':
        return task.status === TaskStatus.COMPLETED;
      case 'pending':
        return task.status === TaskStatus.PENDING;
      default:
        return true;
    }
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortType) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  // Group tasks
  const todayTasks = sortedTasks.filter(task => isToday(task.dueDate));
  const overdueTasks = sortedTasks.filter(task => isPast(task.dueDate) && task.status !== TaskStatus.COMPLETED);
  const upcomingTasks = sortedTasks.filter(task => 
    !isToday(task.dueDate) && !isPast(task.dueDate)
  );

  const taskCounts = {
    all: tasks.length,
    today: todayTasks.length,
    tomorrow: tasks.filter(task => isTomorrow(task.dueDate)).length,
    overdue: overdueTasks.length,
    completed: tasks.filter(task => task.status === TaskStatus.COMPLETED).length,
    pending: tasks.filter(task => task.status === TaskStatus.PENDING).length
  };

  const renderTaskGroup = (title: string, taskList: Task[], icon: React.ReactNode) => {
    if (taskList.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
          <Badge variant="secondary">{taskList.length}</Badge>
        </div>
        <div className="space-y-2">
          {taskList.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={onCompleteTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">과제 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="과제 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: '전체', count: taskCounts.all },
              { key: 'today', label: '오늘', count: taskCounts.today },
              { key: 'tomorrow', label: '내일', count: taskCounts.tomorrow },
              { key: 'overdue', label: '지연', count: taskCounts.overdue },
              { key: 'pending', label: '대기', count: taskCounts.pending },
              { key: 'completed', label: '완료', count: taskCounts.completed }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={filterType === filter.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(filter.key as FilterType)}
                className="h-8"
              >
                {filter.label}
                {filter.count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 h-5 w-5 flex items-center justify-center text-xs p-0"
                  >
                    {filter.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">카테고리</label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as TaskCategory | 'all')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 카테고리</SelectItem>
                  <SelectItem value={TaskCategory.WORK}>업무</SelectItem>
                  <SelectItem value={TaskCategory.STUDY}>학습</SelectItem>
                  <SelectItem value={TaskCategory.EXERCISE}>운동</SelectItem>
                  <SelectItem value={TaskCategory.HOBBY}>취미</SelectItem>
                  <SelectItem value={TaskCategory.OTHER}>기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">정렬</label>
              <Select
                value={sortType}
                onValueChange={(value) => setSortType(value as SortType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">마감일순</SelectItem>
                  <SelectItem value="created">생성일순</SelectItem>
                  <SelectItem value="category">카테고리순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Groups */}
      <div className="space-y-8">
        {filterType === 'all' ? (
          <>
            {renderTaskGroup(
              '지연된 과제',
              overdueTasks,
              <Calendar className="h-4 w-4 text-red-500" />
            )}
            {renderTaskGroup(
              '오늘의 과제',
              todayTasks,
              <Calendar className="h-4 w-4 text-orange-500" />
            )}
            {renderTaskGroup(
              '예정된 과제',
              upcomingTasks,
              <Calendar className="h-4 w-4 text-blue-500" />
            )}
          </>
        ) : (
          <div className="space-y-2">
            {sortedTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>조건에 맞는 과제가 없습니다.</p>
              </div>
            ) : (
              sortedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={onCompleteTask}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onStatusChange={onStatusChange}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}