import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { TrendingUp, Target, Clock, Flame } from 'lucide-react';

interface StatsCardProps {
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
  streak: number;
  todayTasks: number;
}

export function StatsCard({
  completionRate,
  totalTasks,
  completedTasks,
  streak,
  todayTasks
}: StatsCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Weekly Completion Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">주간 완료율</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <Progress value={completionRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedTasks}/{totalTasks} 과제 완료
          </p>
        </CardContent>
      </Card>

      {/* Today's Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">오늘의 과제</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayTasks}개</div>
          <p className="text-xs text-muted-foreground mt-2">
            완료 예정 과제
          </p>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">연속 달성</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">{streak}일</div>
          <p className="text-xs text-muted-foreground mt-2">
            연속 과제 완료
          </p>
          {streak >= 7 && (
            <Badge variant="secondary" className="mt-2">
              🔥 일주일 달성!
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Performance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">이번 주 성과</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">우수</div>
          <p className="text-xs text-muted-foreground mt-2">
            평균보다 20% 높음
          </p>
          <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
            ↗ 향상됨
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}