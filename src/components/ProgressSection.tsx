import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, CheckCircle, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  order: number;
}

interface ProgressSectionProps {
  milestones: Milestone[];
  onTaskToggle: (milestoneId: string, taskId: string) => void;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({ 
  milestones, 
  onTaskToggle 
}) => {
  const calculateOverallProgress = () => {
    const totalTasks = milestones.reduce((sum, milestone) => sum + milestone.tasks.length, 0);
    const completedTasks = milestones.reduce(
      (sum, milestone) => sum + milestone.tasks.filter(task => task.completed).length, 
      0
    );
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const calculateMilestoneProgress = (milestone: Milestone) => {
    const completedTasks = milestone.tasks.filter(task => task.completed).length;
    return milestone.tasks.length > 0 ? Math.round((completedTasks / milestone.tasks.length) * 100) : 0;
  };

  const overallProgress = calculateOverallProgress();
  const totalTasks = milestones.reduce((sum, milestone) => sum + milestone.tasks.length, 0);
  const completedTasksCount = milestones.reduce(
    (sum, milestone) => sum + milestone.tasks.filter(task => task.completed).length, 
    0
  );

  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <Card className="border-oracle-glow/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-oracle-glow" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedTasksCount} of {totalTasks} tasks completed
            </span>
            <span className="font-semibold text-oracle-glow">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-muted-foreground">{completedTasksCount} Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-muted-foreground">{totalTasks - completedTasksCount} Remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Milestones & Tasks</h3>
        
        {milestones.map((milestone) => {
          const milestoneProgress = calculateMilestoneProgress(milestone);
          const isCompleted = milestoneProgress === 100;
          
          return (
            <Card key={milestone.id} className={`border-2 transition-colors ${
              isCompleted 
                ? 'border-success/30 bg-success/5' 
                : 'border-oracle-glow/20 hover:border-oracle-glow/40'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className={`w-5 h-5 ${isCompleted ? 'text-success' : 'text-oracle-glow'}`} />
                    {milestone.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={isCompleted ? "default" : "outline"} 
                      className={isCompleted ? 'bg-success text-success-foreground' : ''}
                    >
                      Milestone {milestone.order}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {milestoneProgress}%
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{milestone.description}</p>
                <Progress value={milestoneProgress} className="h-2" />
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {milestone.tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        task.completed 
                          ? 'bg-success/10 border border-success/20' 
                          : 'bg-card/50 border border-border/50 hover:bg-card'
                      }`}
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => onTaskToggle(milestone.id, task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <h4 className={`font-medium transition-colors ${
                          task.completed 
                            ? 'text-success line-through' 
                            : 'text-foreground'
                        }`}>
                          {task.title}
                        </h4>
                        <p className={`text-sm transition-colors ${
                          task.completed 
                            ? 'text-muted-foreground line-through' 
                            : 'text-muted-foreground'
                        }`}>
                          {task.description}
                        </p>
                      </div>
                      {task.completed && (
                        <CheckCircle className="w-5 h-5 text-success mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};