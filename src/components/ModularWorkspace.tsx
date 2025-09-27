import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestSystem } from '@/components/QuestSystem';
import { ProgressTracker } from '@/components/ProgressTracker';
import { 
  Target, 
  Calendar, 
  ListTodo, 
  TrendingUp, 
  Zap, 
  MessageCircle,
  ArrowLeft
} from 'lucide-react';

interface ModularWorkspaceProps {
  activeModules: string[];
  onBackToOracle: () => void;
  userStats: any;
  quests: any[];
  onQuestComplete: (questId: string, xp: number) => void;
  onQuestUpdate: (quests: any[]) => void;
}

const moduleIcons: Record<string, React.ReactNode> = {
  quests: <Target className="w-4 h-4" />,
  calendar: <Calendar className="w-4 h-4" />,
  tasks: <ListTodo className="w-4 h-4" />,
  progress: <TrendingUp className="w-4 h-4" />,
  habits: <Zap className="w-4 h-4" />
};

const moduleNames: Record<string, string> = {
  quests: 'Quests',
  calendar: 'Calendar',
  tasks: 'Tasks',
  progress: 'Progress',
  habits: 'Habits'
};

export const ModularWorkspace = ({
  activeModules,
  onBackToOracle,
  userStats,
  quests,
  onQuestComplete,
  onQuestUpdate
}: ModularWorkspaceProps) => {
  const PlaceholderModule = ({ title }: { title: string }) => (
    <Card className="h-96 flex items-center justify-center border-dashed border-2 border-oracle-glow/30">
      <div className="text-center">
        <div className="text-4xl mb-4 text-oracle-glow">✨</div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          {title} Module
        </h3>
        <p className="text-sm text-muted-foreground">
          Coming soon to your mystical workspace
        </p>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-oracle-glow/30 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToOracle}
                className="text-oracle-glow hover:bg-oracle-glow/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Oracle
              </Button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-oracle-glow to-mystic-gold bg-clip-text text-transparent">
                  AI Path Keeper Workspace
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your personalized productivity realm
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToOracle}
              className="text-oracle-glow hover:bg-oracle-glow/10"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Consult Oracle
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="container mx-auto px-4 py-8">
        {activeModules.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-6 text-oracle-glow">🔮</div>
              <h2 className="text-2xl font-bold mb-4">No modules activated</h2>
              <p className="text-muted-foreground mb-6">
                Consult with your Oracle to activate mystical tools for your workspace
              </p>
              <Button onClick={onBackToOracle} className="bg-oracle-glow hover:bg-oracle-glow/80">
                <MessageCircle className="w-4 h-4 mr-2" />
                Speak with Oracle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue={activeModules[0]} className="space-y-6">
            <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full lg:w-auto">
              {activeModules.map((moduleId) => (
                <TabsTrigger
                  key={moduleId}
                  value={moduleId}
                  className="flex items-center gap-2"
                >
                  {moduleIcons[moduleId]}
                  {moduleNames[moduleId]}
                </TabsTrigger>
              ))}
            </TabsList>

            {activeModules.map((moduleId) => (
              <TabsContent key={moduleId} value={moduleId} className="space-y-6">
                {moduleId === 'quests' && (
                  <QuestSystem
                    quests={quests}
                    onQuestComplete={onQuestComplete}
                    onQuestUpdate={onQuestUpdate}
                  />
                )}
                {moduleId === 'progress' && (
                  <ProgressTracker stats={userStats} />
                )}
                {moduleId === 'calendar' && <PlaceholderModule title="Calendar" />}
                {moduleId === 'tasks' && <PlaceholderModule title="Task Manager" />}
                {moduleId === 'habits' && <PlaceholderModule title="Habit Tracker" />}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
    </div>
  );
};