import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MentorChat } from '@/components/MentorChat';
import { QuestSystem } from '@/components/QuestSystem';
import { ProgressTracker } from '@/components/ProgressTracker';
import { ProfileSetup } from '@/components/ProfileSetup';
import { 
  Brain, 
  Target, 
  Trophy, 
  Settings,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';

interface UserProfile {
  name: string;
  goals: string[];
  interests: string[];
  motivationStyle: 'encouraging' | 'challenging' | 'analytical';
  experience: 'beginner' | 'intermediate' | 'advanced';
  availableTime: string;
  preferredDifficulty: 'easy' | 'medium' | 'hard';
}

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

const Index = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXP: 0,
    questsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: []
  });
  const [darkMode, setDarkMode] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('questforge-profile');
    const savedQuests = localStorage.getItem('questforge-quests');
    const savedStats = localStorage.getItem('questforge-stats');
    const savedTheme = localStorage.getItem('questforge-theme');

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    if (savedQuests) {
      const parsedQuests = JSON.parse(savedQuests).map((quest: any) => ({
        ...quest,
        createdAt: new Date(quest.createdAt),
        deadline: quest.deadline ? new Date(quest.deadline) : undefined
      }));
      setQuests(parsedQuests);
    }

    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      parsedStats.achievements = parsedStats.achievements.map((achievement: any) => ({
        ...achievement,
        unlockedAt: new Date(achievement.unlockedAt)
      }));
      setUserStats(parsedStats);
    }

    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save data to localStorage
  const saveData = (profile?: UserProfile, questList?: Quest[], stats?: UserStats) => {
    if (profile) {
      localStorage.setItem('questforge-profile', JSON.stringify(profile));
    }
    if (questList) {
      localStorage.setItem('questforge-quests', JSON.stringify(questList));
    }
    if (stats) {
      localStorage.setItem('questforge-stats', JSON.stringify(stats));
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('questforge-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('questforge-theme', 'light');
    }
  };

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    saveData(profile);
    
    // Add welcome achievement
    const welcomeAchievement: Achievement = {
      id: 'welcome',
      name: 'Welcome Adventurer',
      description: 'Started your productivity journey!',
      icon: '🎉',
      unlockedAt: new Date(),
      rarity: 'common'
    };
    
    const newStats = {
      ...userStats,
      achievements: [welcomeAchievement]
    };
    setUserStats(newStats);
    saveData(profile, undefined, newStats);
  };

  const handleQuestGenerated = (quest: Quest) => {
    const newQuests = [...quests, quest];
    setQuests(newQuests);
    saveData(undefined, newQuests);
  };

  const handleQuestComplete = (questId: string, xpGained: number) => {
    const newTotalXP = userStats.totalXP + xpGained;
    const newLevel = Math.floor(newTotalXP / 150) + 1; // Level up every 150 XP
    const currentLevelXP = (newLevel - 1) * 150;
    const xpInCurrentLevel = newTotalXP - currentLevelXP;
    const xpToNextLevel = (newLevel * 150) - newTotalXP;
    
    const newAchievements = [...userStats.achievements];
    
    // Check for new achievements
    const completedQuests = userStats.questsCompleted + 1;
    if (completedQuests === 1) {
      newAchievements.push({
        id: 'first-quest',
        name: 'First Quest Complete',
        description: 'Completed your very first quest!',
        icon: '⭐',
        unlockedAt: new Date(),
        rarity: 'common'
      });
    } else if (completedQuests === 5) {
      newAchievements.push({
        id: 'quest-warrior',
        name: 'Quest Warrior',
        description: 'Completed 5 quests!',
        icon: '⚔️',
        unlockedAt: new Date(),
        rarity: 'rare'
      });
    } else if (completedQuests === 10) {
      newAchievements.push({
        id: 'quest-master',
        name: 'Quest Master',
        description: 'Completed 10 quests!',
        icon: '👑',
        unlockedAt: new Date(),
        rarity: 'epic'
      });
    }
    
    if (newLevel > userStats.level) {
      newAchievements.push({
        id: `level-${newLevel}`,
        name: `Level ${newLevel} Achieved`,
        description: `Reached level ${newLevel}!`,
        icon: '🚀',
        unlockedAt: new Date(),
        rarity: newLevel >= 5 ? 'epic' : 'rare'
      });
    }

    const newStats: UserStats = {
      ...userStats,
      level: newLevel,
      xp: xpInCurrentLevel,
      xpToNextLevel: xpToNextLevel,
      totalXP: newTotalXP,
      questsCompleted: completedQuests,
      currentStreak: userStats.currentStreak + 1,
      longestStreak: Math.max(userStats.longestStreak, userStats.currentStreak + 1),
      achievements: newAchievements
    };
    
    setUserStats(newStats);
    saveData(undefined, undefined, newStats);
  };

  const handleQuestUpdate = (updatedQuests: Quest[]) => {
    setQuests(updatedQuests);
    saveData(undefined, updatedQuests);
  };

  // Show profile setup if no profile exists
  if (!userProfile) {
    return <ProfileSetup onProfileComplete={handleProfileComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Quest Forge AI</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {userProfile.name}!
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-level-badge text-level-badge-foreground">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Level {userStats.level}</span>
              </div>
              
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="mentor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="mentor" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Mentor
            </TabsTrigger>
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Quests
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mentor" className="space-y-6">
            <MentorChat 
              onQuestGenerated={handleQuestGenerated}
              userProfile={userProfile}
            />
          </TabsContent>

          <TabsContent value="quests" className="space-y-6">
            <QuestSystem
              quests={quests}
              onQuestComplete={handleQuestComplete}
              onQuestUpdate={handleQuestUpdate}
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProgressTracker stats={userStats} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
