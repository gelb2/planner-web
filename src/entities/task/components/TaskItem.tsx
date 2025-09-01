import { useState } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Checkbox } from '@/shared/ui/checkbox';
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
} from '@/shared/ui/dropdown-menu';
import { Task, TaskCategory, TaskStatus } from '@/shared/types';
import { isToday, isOverdue, formatDate } from '@/shared/lib/dateUtils';

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
  [TaskCategory.WORK]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [TaskCategory.STUDY]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [TaskCategory.EXERCISE]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  [TaskCategory.HOBBY]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [TaskCategory.OTHER]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
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
  const [isHovered, setIsHovered] = useState(false);
  
  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isInProgress = task.status === TaskStatus.IN_PROGRESS;
  const isPastDue = isOverdue(task.dueDate);
  const isDueToday = isToday(task.dueDate);

  const handleStatusToggle = () => {
    if (isCompleted) {
      onStatusChange(task.id, TaskStatus.PENDING);
    } else if (isInProgress) {
      onComplete(task.id);
    } else {
      onStatusChange(task.id, TaskStatus.IN_PROGRESS);
    }
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md ${
        isCompleted ? 'bg-muted/50' : ''
      } ${isPastDue && !isCompleted ? 'border-destructive/50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Checkbox */}
          <Checkbox
            checked={isCompleted}
            onCheckedChange={handleStatusToggle}
            className="mt-0.5"
          />

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`font-medium ${
                  isCompleted ? 'line-through text-muted-foreground' : ''
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm mt-1 ${
                    isCompleted ? 'text-muted-foreground' : 'text-muted-foreground'
                  }`}>
                    {task.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {/* Status Button */}
                {!isCompleted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStatusToggle}
                    className="flex items-center space-x-1"
                  >
                    {isInProgress ? (
                      <>
                        <Pause className="h-3 w-3" />
                        <span className="hidden sm:inline">완료</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" />
                        <span className="hidden sm:inline">시작</span>
                      </>
                    )}
                  </Button>
                )}

                {/* More Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className={`h-8 w-8 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(task.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Task Meta Info */}
            <div className="flex items-center space-x-4 mt-3">
              {/* Category */}
              <Badge className={`text-xs ${categoryColors[task.category]}`}>
                {categoryLabels[task.category]}
              </Badge>

              {/* Status */}
              <Badge 
                variant={isCompleted ? 'default' : isInProgress ? 'secondary' : 'outline'}
                className="text-xs"
              >
                {statusLabels[task.status]}
              </Badge>

              {/* Due Date */}
              <div className={`flex items-center space-x-1 text-xs ${
                isPastDue && !isCompleted ? 'text-destructive' : 
                isDueToday ? 'text-orange-600' : 'text-muted-foreground'
              }`}>
                {isPastDue && !isCompleted && <AlertCircle className="h-3 w-3" />}
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>

              {/* Estimated Time */}
              {task.estimatedMinutes && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
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