import React, { useState, useEffect } from 'react';
import { MentorLanding } from '@/components/MentorLanding';
import { MentorPath } from '@/components/MentorPath';
import { ProgressSection } from '@/components/ProgressSection';
import { ToolsSection } from '@/components/ToolsSection';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, Sun, Home, Target, TrendingUp, Wrench } from 'lucide-react';

type AppState = 'landing' | 'mentor' | 'dashboard';

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

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  url?: string;
  isCustom?: boolean;
}

interface LearningPath {
  goal: string;
  milestones: Milestone[];
  suggestedTools: Tool[];
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [userTools, setUserTools] = useState<Tool[]>([]);
  const [darkMode, setDarkMode] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPath = localStorage.getItem('mentor-path');
    const savedTools = localStorage.getItem('mentor-tools');
    const savedTheme = localStorage.getItem('mentor-theme');

    if (savedPath) {
      const parsedPath = JSON.parse(savedPath);
      // Restore date objects for milestones
      parsedPath.milestones = parsedPath.milestones.map((milestone: any) => ({
        ...milestone,
        tasks: milestone.tasks.map((task: any) => ({
          ...task,
          completed: Boolean(task.completed)
        }))
      }));
      setLearningPath(parsedPath);
      setAppState('dashboard');
    }

    if (savedTools) {
      setUserTools(JSON.parse(savedTools));
    }

    const isDarkMode = savedTheme === 'light' ? false : true;
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Save data to localStorage
  const saveData = () => {
    if (learningPath) {
      localStorage.setItem('mentor-path', JSON.stringify(learningPath));
    }
    localStorage.setItem('mentor-tools', JSON.stringify(userTools));
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mentor-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mentor-theme', 'light');
    }
  };

  const handleStartJourney = () => {
    setAppState('mentor');
  };

  const handlePathGenerated = (path: LearningPath) => {
    setLearningPath(path);
    setAppState('dashboard');
    saveData();
  };

  const handleTaskToggle = (milestoneId: string, taskId: string) => {
    if (!learningPath) return;

    const updatedMilestones = learningPath.milestones.map(milestone => {
      if (milestone.id === milestoneId) {
        const updatedTasks = milestone.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        return { ...milestone, tasks: updatedTasks };
      }
      return milestone;
    });

    const updatedPath = { ...learningPath, milestones: updatedMilestones };
    setLearningPath(updatedPath);
    saveData();
  };

  const handleAddTool = (tool: Tool) => {
    const updatedTools = [...userTools, tool];
    setUserTools(updatedTools);
    saveData();
  };

  const handleRemoveTool = (toolId: string) => {
    const updatedTools = userTools.filter(tool => tool.id !== toolId);
    setUserTools(updatedTools);
    saveData();
  };

  const handleBackToHome = () => {
    setAppState('landing');
  };

  const handleBackToMentor = () => {
    setAppState('mentor');
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

      {/* Navigation - only show on dashboard */}
      {appState === 'dashboard' && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToHome}
            className="bg-card/80 backdrop-blur-sm border border-oracle-glow/30 mr-2"
          >
            <Home className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToMentor}
            className="bg-card/80 backdrop-blur-sm border border-oracle-glow/30"
          >
            <Target className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* App States */}
      {appState === 'landing' && (
        <MentorLanding onStartJourney={handleStartJourney} />
      )}

      {appState === 'mentor' && (
        <div className="min-h-screen bg-background p-4">
          <div className="container mx-auto py-8 max-w-4xl">
            <MentorPath onPathGenerated={handlePathGenerated} />
          </div>
        </div>
      )}

      {appState === 'dashboard' && learningPath && (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Mentor Journey</h1>
              <p className="text-muted-foreground">Track progress and manage your personalized learning path</p>
            </div>
            
            <Tabs defaultValue="progress" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
                <TabsTrigger value="progress" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Progress & Tasks
                </TabsTrigger>
                <TabsTrigger value="tools" className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Tools
                </TabsTrigger>
                <TabsTrigger value="path" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Learning Path
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="progress" className="space-y-6">
                <ProgressSection
                  milestones={learningPath.milestones}
                  onTaskToggle={handleTaskToggle}
                />
              </TabsContent>
              
              <TabsContent value="tools" className="space-y-6">
                <ToolsSection
                  suggestedTools={learningPath.suggestedTools}
                  userTools={userTools}
                  onAddTool={handleAddTool}
                  onRemoveTool={handleRemoveTool}
                />
              </TabsContent>
              
              <TabsContent value="path" className="space-y-6">
                <MentorPath onPathGenerated={handlePathGenerated} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
