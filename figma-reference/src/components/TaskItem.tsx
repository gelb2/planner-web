import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { 
  Clock, 
  Calendar, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Task, TaskCategory, TaskStatus } from '../types';
import { isToday, isPast, formatDate } from '../utils/dateUtils';

interface TaskItemProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const categoryLabels = {
  [TaskCategory.WORK]: '업무',
  [TaskCategory.STUDY]: '학습',
  [TaskCategory.EXERCISE]: '운동',
  [TaskCategory.HOBBY]: '취미',
  [TaskCategory.OTHER]: '기타'
};

const categoryColors = {
  [TaskCategory.WORK]: 'bg-blue-100 text-blue-800',
  [TaskCategory.STUDY]: 'bg-green-100 text-green-800',
  [TaskCategory.EXERCISE]: 'bg-orange-100 text-orange-800',
  [TaskCategory.HOBBY]: 'bg-purple-100 text-purple-800',
  [TaskCategory.OTHER]: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  [TaskStatus.PENDING]: '대기',
  [TaskStatus.IN_PROGRESS]: '진행중',
  [TaskStatus.COMPLETED]: '완료',
  [TaskStatus.ON_HOLD]: '보류'
};

export function TaskItem({
  task,
  onComplete,
  onEdit,
  onDelete,
  onStatusChange
}: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  
  const isOverdue = isPast(task.dueDate) && task.status !== TaskStatus.COMPLETED;
  const isDueToday = isToday(task.dueDate);
  const isCompleted = task.status === TaskStatus.COMPLETED;

  const handleComplete = async () => {
    if (isCompleted) return;
    
    setIsCompleting(true);
    try {
      await onComplete(task.id);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleStatusChange = (status: TaskStatus) => {
    onStatusChange(task.id, status);
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      isCompleted ? 'opacity-75 bg-muted/50' : ''
    } ${isOverdue ? 'border-red-200 bg-red-50/50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Checkbox */}
          <div className="flex items-center pt-1">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleComplete}
              disabled={isCompleting}
              className="h-5 w-5"
            />
          </div>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Status */}
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-medium leading-tight ${
                isCompleted ? 'line-through text-muted-foreground' : ''
              }`}>
                {task.title}
              </h3>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="h-4 w-4 mr-2" />
                    수정
                  </DropdownMenuItem>
                  {task.status === TaskStatus.IN_PROGRESS ? (
                    <DropdownMenuItem onClick={() => handleStatusChange(TaskStatus.PENDING)}>
                      <Pause className="h-4 w-4 mr-2" />
                      일시정지
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}>
                      <Play className="h-4 w-4 mr-2" />
                      시작
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Badges and Meta */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Category */}
              <Badge 
                variant="secondary" 
                className={categoryColors[task.category]}
              >
                {categoryLabels[task.category]}
              </Badge>

              {/* Status */}
              {task.status !== TaskStatus.PENDING && (
                <Badge 
                  variant={task.status === TaskStatus.COMPLETED ? 'default' : 'outline'}
                  className={
                    task.status === TaskStatus.COMPLETED 
                      ? 'bg-green-100 text-green-800' 
                      : task.status === TaskStatus.IN_PROGRESS
                      ? 'border-blue-500 text-blue-700'
                      : 'border-orange-500 text-orange-700'
                  }
                >
                  {statusLabels[task.status]}
                </Badge>
              )}

              {/* Due Date */}
              <div className={`flex items-center space-x-1 ${
                isOverdue ? 'text-red-600' : isDueToday ? 'text-orange-600' : 'text-muted-foreground'
              }`}>
                {isOverdue && <AlertCircle className="h-3 w-3" />}
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDate(task.dueDate)}
                  {isDueToday && ' (오늘)'}
                  {isOverdue && ' (지연)'}
                </span>
              </div>

              {/* Estimated Time */}
              {task.estimatedMinutes && (
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimatedMinutes}분</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}