import { useState } from 'react';
import { TaskItem } from '@/entities/task/components/TaskItem';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Search, Filter, Calendar, CheckSquare } from 'lucide-react';
import { Task, TaskCategory, TaskStatus } from '@/shared/types';
import { isToday, isOverdue } from '@/shared/lib/dateUtils';

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

  const isTomorrow = (date: Date): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    );
  };

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
        return isOverdue(task.dueDate) && task.status !== TaskStatus.COMPLETED;
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

  // Task count by filter
  const taskCounts = {
    all: tasks.length,
    today: tasks.filter(task => isToday(task.dueDate)).length,
    tomorrow: tasks.filter(task => isTomorrow(task.dueDate)).length,
    overdue: tasks.filter(task => isOverdue(task.dueDate) && task.status !== TaskStatus.COMPLETED).length,
    completed: tasks.filter(task => task.status === TaskStatus.COMPLETED).length,
    pending: tasks.filter(task => task.status === TaskStatus.PENDING).length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckSquare className="h-5 w-5" />
          <span>과제 목록</span>
          <Badge variant="secondary">{sortedTasks.length}</Badge>
        </CardTitle>
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="과제 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
              <SelectTrigger className="w-36">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 ({taskCounts.all})</SelectItem>
                <SelectItem value="today">오늘 ({taskCounts.today})</SelectItem>
                <SelectItem value="tomorrow">내일 ({taskCounts.tomorrow})</SelectItem>
                <SelectItem value="overdue">지연됨 ({taskCounts.overdue})</SelectItem>
                <SelectItem value="pending">대기중 ({taskCounts.pending})</SelectItem>
                <SelectItem value="completed">완료됨 ({taskCounts.completed})</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={(value: TaskCategory | 'all') => setSelectedCategory(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                <SelectItem value={TaskCategory.WORK}>업무</SelectItem>
                <SelectItem value={TaskCategory.STUDY}>학습</SelectItem>
                <SelectItem value={TaskCategory.EXERCISE}>운동</SelectItem>
                <SelectItem value={TaskCategory.HOBBY}>취미</SelectItem>
                <SelectItem value={TaskCategory.OTHER}>기타</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'today', 'overdue', 'completed'] as FilterType[]).map((filter) => (
            <Button
              key={filter}
              variant={filterType === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(filter)}
              className="flex items-center space-x-1"
            >
              {filter === 'today' && <Calendar className="h-3 w-3" />}
              <span>
                {filter === 'all' && '전체'}
                {filter === 'today' && '오늘'}
                {filter === 'overdue' && '지연됨'}
                {filter === 'completed' && '완료됨'}
              </span>
              <Badge variant={filterType === filter ? 'secondary' : 'outline'} className="ml-1">
                {taskCounts[filter]}
              </Badge>
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery || filterType !== 'all' || selectedCategory !== 'all' ? (
              <div>
                <p>검색 조건에 맞는 과제가 없습니다.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                    setSelectedCategory('all');
                  }}
                  className="mt-2"
                >
                  필터 초기화
                </Button>
              </div>
            ) : (
              <p>아직 과제가 없습니다. 새로운 과제를 추가해보세요!</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedTasks.map(task => (
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
        )}
      </CardContent>
    </Card>
  );
}