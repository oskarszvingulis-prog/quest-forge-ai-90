import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target,
  Award,
  TrendingUp,
  Calendar,
  Flame
} from 'lucide-react';

interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXP: number;
  questsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ProgressTrackerProps {
  stats: UserStats;
}

const rarityColors = {
  common: 'bg-muted text-muted-foreground',
  rare: 'bg-info text-info-foreground',
  epic: 'bg-warning text-warning-foreground',
  legendary: 'bg-achievement text-achievement-foreground'
};

const getXPForLevel = (level: number): number => {
  return level * 100 + (level - 1) * 50; // Exponential XP requirements
};

const getCurrentLevelProgress = (xp: number, level: number): number => {
  const currentLevelXP = level > 1 ? getXPForLevel(level - 1) : 0;
  const nextLevelXP = getXPForLevel(level);
  const progressXP = xp - currentLevelXP;
  const levelRange = nextLevelXP - currentLevelXP;
  return Math.max(0, Math.min(100, (progressXP / levelRange) * 100));
};

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ stats }) => {
  const levelProgress = getCurrentLevelProgress(stats.totalXP, stats.level);
  const recentAchievements = stats.achievements
    .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Level & XP Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-level-badge text-level-badge-foreground">
                <Star className="w-5 h-5" />
              </div>
              Level {stats.level}
            </CardTitle>
            <Badge className="bg-xp-bar text-primary-foreground">
              {stats.totalXP.toLocaleString()} Total XP
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to Level {stats.level + 1}</span>
                <span>{stats.xp} / {stats.xpToNextLevel} XP</span>
              </div>
              <div className="relative">
                <Progress value={levelProgress} className="h-3" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full" />
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              {stats.xpToNextLevel - stats.xp} XP needed for next level
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-quest-completed text-quest-completed-foreground">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quests</p>
              <p className="text-lg font-semibold">{stats.questsCompleted}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning text-warning-foreground">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Streak</p>
              <p className="text-lg font-semibold">{stats.currentStreak}d</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info text-info-foreground">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Best Streak</p>
              <p className="text-lg font-semibold">{stats.longestStreak}d</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-achievement text-achievement-foreground">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Achievements</p>
              <p className="text-lg font-semibold">{stats.achievements.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-achievement" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{achievement.name}</h4>
                      <Badge className={rarityColors[achievement.rarity]} variant="secondary">
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivation */}
      <Card className="bg-gradient-to-r from-primary/10 to-achievement/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Keep Going!</h3>
          <p className="text-sm text-muted-foreground">
            You're doing great! Every quest completed brings you closer to your goals.
            {stats.currentStreak > 0 && ` Your ${stats.currentStreak}-day streak shows your dedication!`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};