import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  Star, 
  Zap,
  Calendar,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'learning' | 'habit';
  xpReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'active' | 'completed' | 'failed';
  progress?: number;
  maxProgress?: number;
  createdAt: Date;
  deadline?: Date;
}

interface QuestSystemProps {
  quests: Quest[];
  onQuestComplete: (questId: string, xpGained: number) => void;
  onQuestUpdate: (updatedQuests: Quest[]) => void;
}

const difficultyColors = {
  Easy: 'bg-success text-success-foreground',
  Medium: 'bg-warning text-warning-foreground',
  Hard: 'bg-destructive text-destructive-foreground'
};

const typeIcons = {
  daily: Calendar,
  weekly: Clock,
  learning: Star,
  habit: Zap
};

const typeColors = {
  daily: 'bg-info text-info-foreground',
  weekly: 'bg-primary text-primary-foreground',
  learning: 'bg-warning text-warning-foreground',
  habit: 'bg-success text-success-foreground'
};

export const QuestSystem: React.FC<QuestSystemProps> = ({ 
  quests, 
  onQuestComplete, 
  onQuestUpdate 
}) => {
  const { toast } = useToast();
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);

  const activeQuests = quests.filter(quest => quest.status === 'active');
  const completedQuests = quests.filter(quest => quest.status === 'completed');

  const handleCompleteQuest = (quest: Quest) => {
    const updatedQuests = quests.map(q => 
      q.id === quest.id ? { ...q, status: 'completed' as const } : q
    );
    
    onQuestUpdate(updatedQuests);
    onQuestComplete(quest.id, quest.xpReward);
    
    toast({
      title: "Quest Completed! 🎉",
      description: `You earned ${quest.xpReward} XP for completing "${quest.title}"`,
    });
  };

  const updateQuestProgress = (questId: string, newProgress: number) => {
    const updatedQuests = quests.map(quest => {
      if (quest.id === questId) {
        const updatedQuest = { ...quest, progress: newProgress };
        if (newProgress >= (quest.maxProgress || 100)) {
          updatedQuest.status = 'completed';
          onQuestComplete(questId, quest.xpReward);
          toast({
            title: "Quest Completed! 🎉",
            description: `You earned ${quest.xpReward} XP for completing "${quest.title}"`,
          });
        }
        return updatedQuest;
      }
      return quest;
    });
    
    onQuestUpdate(updatedQuests);
  };

  const getDaysUntilDeadline = (deadline?: Date) => {
    if (!deadline) return null;
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const QuestCard: React.FC<{ quest: Quest }> = ({ quest }) => {
    const IconComponent = typeIcons[quest.type];
    const daysLeft = getDaysUntilDeadline(quest.deadline);
    const isExpanded = expandedQuest === quest.id;
    
    return (
      <Card className={`transition-all duration-200 ${quest.status === 'completed' ? 'opacity-75' : 'hover:shadow-md'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`p-2 rounded-lg ${typeColors[quest.type]}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base line-clamp-1">{quest.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={difficultyColors[quest.difficulty]} variant="secondary">
                    {quest.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Trophy className="w-3 h-3 mr-1" />
                    {quest.xpReward} XP
                  </Badge>
                  {daysLeft !== null && (
                    <Badge variant={daysLeft <= 1 ? "destructive" : "secondary"} className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {daysLeft}d left
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {quest.status === 'completed' && (
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {quest.description}
          </p>
          
          {quest.progress !== undefined && quest.maxProgress && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{quest.progress}/{quest.maxProgress}</span>
              </div>
              <Progress 
                value={(quest.progress / quest.maxProgress) * 100} 
                className="h-2"
              />
            </div>
          )}
          
          <div className="flex gap-2">
            {quest.status === 'active' && (
              <>
                {quest.progress !== undefined && quest.maxProgress ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuestProgress(quest.id, (quest.progress || 0) + 1)}
                    disabled={quest.progress >= quest.maxProgress}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Update Progress
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleCompleteQuest(quest)}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
              </>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedQuest(isExpanded ? null : quest.id)}
            >
              {isExpanded ? 'Less' : 'More'} Details
            </Button>
          </div>
          
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-1">Created</p>
                  <p className="text-muted-foreground">
                    {quest.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Type</p>
                  <p className="text-muted-foreground capitalize">{quest.type}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Active Quests */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Active Quests</h2>
          <Badge variant="secondary">{activeQuests.length}</Badge>
        </div>
        
        {activeQuests.length === 0 ? (
          <Card className="p-8 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Active Quests</h3>
            <p className="text-sm text-muted-foreground">
              Chat with your mentor to generate personalized quests based on your goals!
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-success" />
            <h2 className="text-xl font-semibold">Completed Quests</h2>
            <Badge variant="secondary">{completedQuests.length}</Badge>
          </div>
          
          <div className="grid gap-4 max-h-96 overflow-y-auto">
            {completedQuests.slice(0, 5).map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};