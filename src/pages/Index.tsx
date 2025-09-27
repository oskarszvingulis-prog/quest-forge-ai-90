import React, { useState, useEffect } from 'react';
import { OracleLanding } from '@/components/OracleLanding';
import { OracleChat } from '@/components/OracleChat';
import { ModularWorkspace } from '@/components/ModularWorkspace';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

type AppState = 'landing' | 'oracle-chat' | 'workspace';

interface UserSession {
  initialMessage: string;
  activeModules: string[];
  createdAt: Date;
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
  const [appState, setAppState] = useState<AppState>('landing');
  const [userSession, setUserSession] = useState<UserSession | null>(null);
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
  const [darkMode, setDarkMode] = useState(true); // Default to dark theme for oracle aesthetic

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('pathkeeper-session');
    const savedQuests = localStorage.getItem('pathkeeper-quests');
    const savedStats = localStorage.getItem('pathkeeper-stats');
    const savedTheme = localStorage.getItem('pathkeeper-theme');

    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      setUserSession({
        ...parsedSession,
        createdAt: new Date(parsedSession.createdAt)
      });
      setAppState(parsedSession.activeModules.length > 0 ? 'workspace' : 'oracle-chat');
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

    // Default to dark mode for oracle aesthetic
    const isDarkMode = savedTheme === 'light' ? false : true;
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Save data to localStorage
  const saveData = (session?: UserSession, questList?: Quest[], stats?: UserStats) => {
    if (session) {
      localStorage.setItem('pathkeeper-session', JSON.stringify(session));
    }
    if (questList) {
      localStorage.setItem('pathkeeper-quests', JSON.stringify(questList));
    }
    if (stats) {
      localStorage.setItem('pathkeeper-stats', JSON.stringify(stats));
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pathkeeper-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pathkeeper-theme', 'light');
    }
  };

  const handleFirstInteraction = (message: string) => {
    const newSession: UserSession = {
      initialMessage: message,
      activeModules: [],
      createdAt: new Date()
    };
    
    setUserSession(newSession);
    setAppState('oracle-chat');
    saveData(newSession);

    // Add welcome achievement
    const welcomeAchievement: Achievement = {
      id: 'oracle-awakened',
      name: 'Oracle Awakened',
      description: 'Connected with your AI Path Keeper!',
      icon: '🔮',
      unlockedAt: new Date(),
      rarity: 'common'
    };
    
    const newStats = {
      ...userStats,
      achievements: [welcomeAchievement]
    };
    setUserStats(newStats);
    saveData(newSession, undefined, newStats);
  };

  const handleModuleActivation = (moduleIds: string[]) => {
    if (!userSession) return;
    
    const updatedSession = {
      ...userSession,
      activeModules: moduleIds
    };
    
    setUserSession(updatedSession);
    setAppState('workspace');
    saveData(updatedSession);
  };

  const handleBackToOracle = () => {
    setAppState('oracle-chat');
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

  return (
    <>
      {/* Theme toggle - floating */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="bg-card/80 backdrop-blur-sm border border-oracle-glow/30"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>

      {/* App States */}
      {appState === 'landing' && (
        <OracleLanding onFirstInteraction={handleFirstInteraction} />
      )}

      {appState === 'oracle-chat' && userSession && (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <OracleChat
              initialMessage={userSession.initialMessage}
              onModuleActivation={handleModuleActivation}
            />
          </div>
        </div>
      )}

      {appState === 'workspace' && userSession && (
        <ModularWorkspace
          activeModules={userSession.activeModules}
          onBackToOracle={handleBackToOracle}
          userStats={userStats}
          quests={quests}
          onQuestComplete={handleQuestComplete}
          onQuestUpdate={handleQuestUpdate}
        />
      )}
    </>
  );
};

export default Index;
