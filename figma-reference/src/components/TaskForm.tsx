import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CalendarIcon, Clock, X } from 'lucide-react';
import { formatLongDate } from '../utils/dateUtils';
import { Task, TaskCategory, TaskStatus } from '../types';

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const categoryOptions = [
  { value: TaskCategory.WORK, label: '업무' },
  { value: TaskCategory.STUDY, label: '학습' },
  { value: TaskCategory.EXERCISE, label: '운동' },
  { value: TaskCategory.HOBBY, label: '취미' },
  { value: TaskCategory.OTHER, label: '기타' }
];

const estimatedTimeOptions = [
  { value: 15, label: '15분' },
  { value: 30, label: '30분' },
  { value: 45, label: '45분' },
  { value: 60, label: '1시간' },
  { value: 90, label: '1시간 30분' },
  { value: 120, label: '2시간' },
  { value: 180, label: '3시간' },
  { value: 240, label: '4시간' }
];

export function TaskForm({ task, onSubmit, onCancel, isOpen }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: TaskCategory.WORK,
    status: TaskStatus.PENDING,
    dueDate: new Date(),
    estimatedMinutes: 30,
    notificationEnabled: true,
    notificationTime: '09:00'
  });

  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        category: task.category,
        status: task.status,
        dueDate: task.dueDate,
        estimatedMinutes: task.estimatedMinutes || 30,
        notificationEnabled: true,
        notificationTime: '09:00'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: TaskCategory.WORK,
        status: TaskStatus.PENDING,
        dueDate: new Date(),
        estimatedMinutes: 30,
        notificationEnabled: true,
        notificationTime: '09:00'
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      category: formData.category,
      status: formData.status,
      dueDate: formData.dueDate,
      estimatedMinutes: formData.estimatedMinutes
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{task ? '과제 수정' : '새 과제 추가'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="과제 제목을 입력하세요"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="과제에 대한 자세한 설명을 입력하세요"
                rows={3}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>카테고리</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label>마감일</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatLongDate(formData.dueDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => {
                      if (date) {
                        handleInputChange('dueDate', date);
                        setCalendarOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Estimated Time */}
            <div className="space-y-2">
              <Label>예상 소요시간</Label>
              <Select
                value={formData.estimatedMinutes.toString()}
                onValueChange={(value) => handleInputChange('estimatedMinutes', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {estimatedTimeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notification Settings */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notification"
                  checked={formData.notificationEnabled}
                  onCheckedChange={(checked) => handleInputChange('notificationEnabled', checked)}
                />
                <Label htmlFor="notification">알림 받기</Label>
              </div>
              
              {formData.notificationEnabled && (
                <div className="ml-6 space-y-2">
                  <Label>알림 시간</Label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={formData.notificationTime}
                      onChange={(e) => handleInputChange('notificationTime', e.target.value)}
                      className="w-32"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                취소
              </Button>
              <Button type="submit" className="flex-1">
                {task ? '수정' : '저장'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}