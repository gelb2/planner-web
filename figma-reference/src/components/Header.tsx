import { Bell, Plus, User, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

interface HeaderProps {
  user?: {
    name: string;
    profileImage?: string;
  };
  notificationCount?: number;
  onAddTask?: () => void;
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function Header({
  user,
  notificationCount = 0,
  onAddTask,
  onProfileClick,
  onNotificationsClick,
  darkMode = false,
  onToggleDarkMode
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">T</span>
          </div>
          <span className="font-bold text-xl">TestPlanner</span>
        </div>

        {/* User Greeting */}
        {user && (
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-muted-foreground">안녕하세요,</span>
            <span className="font-medium">{user.name}님!</span>
            <span className="text-xl">👋</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            className="relative"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Add Task Button */}
          <Button onClick={onAddTask} size="sm" className="hidden sm:flex">
            <Plus className="h-4 w-4 mr-2" />
            새 과제
          </Button>

          {/* Mobile Add Button */}
          <Button
            onClick={onAddTask}
            size="icon"
            className="sm:hidden"
          >
            <Plus className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationsClick}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </Badge>
            )}
          </Button>

          {/* User Profile */}
          <Button
            variant="ghost"
            onClick={onProfileClick}
            className="p-1"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profileImage} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.charAt(0) || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
}