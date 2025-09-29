import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, Target, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Milestone {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  order: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  url?: string;
}

interface LearningPath {
  goal: string;
  milestones: Milestone[];
  suggestedTools: Tool[];
}

interface MentorPathProps {
  onPathGenerated: (path: LearningPath) => void;
}

export const MentorPath: React.FC<MentorPathProps> = ({ onPathGenerated }) => {
  const [userGoal, setUserGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPath, setCurrentPath] = useState<LearningPath | null>(null);

  const buildFallbackPath = (goal: string): LearningPath => {
    const topic = goal.trim() || 'your goal';
    const mkTask = (m: number, t: number, title: string, description: string): Task => ({
      id: `${m}-${t}`,
      title,
      description,
      completed: false,
    });

    return {
      goal,
      milestones: [
        {
          id: '1',
          title: `Foundation: ${topic}`,
          description: `Learn the fundamentals needed to start with ${topic}.`,
          order: 1,
          tasks: [
            mkTask(1,1,`Set up your tools for ${topic}`,'Install required apps and create a dedicated workspace.'),
            mkTask(1,2,'Study core concepts','Spend 2 hours reading a beginner-friendly overview.'),
            mkTask(1,3,'Make a weekly plan','Define 3 time blocks per week for practice.'),
          ],
        },
        {
          id: '2',
          title: `Practice: ${topic}`,
          description: 'Build skill through guided exercises.',
          order: 2,
          tasks: [
            mkTask(2,1,'Do a small project','Complete a 60–90 minute project following a tutorial.'),
            mkTask(2,2,'Get feedback','Share your work with a friend or community and note improvements.'),
            mkTask(2,3,'Reflect and adjust','Write 5 bullet points on what to improve next week.'),
          ],
        },
        {
          id: '3',
          title: `Apply & Showcase: ${topic}`,
          description: 'Create something you can show others.',
          order: 3,
          tasks: [
            mkTask(3,1,'Build a portfolio piece','Create a simple but polished artifact that demonstrates your skills.'),
            mkTask(3,2,'Document learnings','Summarize what you learned and next steps.'),
            mkTask(3,3,'Share publicly','Post your work in a relevant community.'),
          ],
        },
      ],
      suggestedTools: [
        { id: 'tool-1', name: 'Notion', category: 'Organization', description: 'Plan tasks and take notes.' },
        { id: 'tool-2', name: 'YouTube', category: 'Learning', description: 'Find tutorials and walkthroughs.' },
        { id: 'tool-3', name: 'Google Keep', category: 'Notes', description: 'Quick notes and checklists.' },
      ],
    };
  };

  const generateLearningPath = async () => {
    if (!userGoal.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const endpoints = [
        '/functions/v1/generate-learning-path',
        '/api/functions/v1/generate-learning-path',
        '/api/functions/generate-learning-path',
        '/edge-functions/generate-learning-path',
        '/api/edge-functions/generate-learning-path',
      ];

      let lastError: string | null = null;
      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goal: userGoal.trim() + '\n' }),
          });

          if (response.ok) {
            const learningPath = await response.json();
            setCurrentPath(learningPath);
            onPathGenerated(learningPath);
            toast({ title: 'Plan generated', description: 'Your personalized path is ready.' });
            return;
          }

          lastError = `${response.status} ${response.statusText}`;
        } catch (e) {
          lastError = e instanceof Error ? e.message : String(e);
        }
      }

      throw new Error(lastError || 'Unknown error');
    } catch (error) {
      console.error('Error generating learning path:', error);
      const fallback = buildFallbackPath(userGoal);
      setCurrentPath(fallback);
      onPathGenerated(fallback);
      toast({ title: 'Using demo plan', description: 'AI service unavailable right now. Showing a quick plan so you can continue.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartOver = () => {
    setCurrentPath(null);
    setUserGoal('');
  };

  if (currentPath) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Learning Path</h2>
            <p className="text-muted-foreground">Goal: {currentPath.goal}</p>
          </div>
          <Button variant="outline" onClick={handleStartOver}>
            Create New Path
          </Button>
        </div>
        
        <div className="grid gap-4">
          {currentPath.milestones.map((milestone) => (
            <Card key={milestone.id} className="border-oracle-glow/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-oracle-glow" />
                  {milestone.title}
                  <Badge variant="outline" className="ml-auto">
                    Milestone {milestone.order}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{milestone.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {milestone.tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-card/50">
                      <CheckCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-oracle-glow to-cosmic-blue flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-background" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">What do you want to learn or improve?</h2>
        <p className="text-muted-foreground">
          Tell me about your goal and I'll create a personalized learning path with actionable milestones and tasks.
        </p>
      </div>

      <Card className="border-oracle-glow/20">
        <CardContent className="space-y-4 pt-6">
          <Textarea
            placeholder="Example: I want to learn web development and build my first website..."
            value={userGoal}
            onChange={(e) => setUserGoal(e.target.value)}
            className="min-h-[120px] resize-none bg-background/50"
          />
          
          <Button 
            onClick={generateLearningPath}
            disabled={!userGoal.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-oracle-glow to-cosmic-blue hover:from-oracle-glow/90 hover:to-cosmic-blue/90"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                Generating Your Path...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Generate My Learning Path
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};