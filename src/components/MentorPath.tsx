import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, Target, CheckCircle } from 'lucide-react';

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

  const generateLearningPath = async () => {
    if (!userGoal.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/functions/v1/generate-learning-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal: userGoal }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate learning path');
      }

      const learningPath = await response.json();
      setCurrentPath(learningPath);
      onPathGenerated(learningPath);
    } catch (error) {
      console.error('Error generating learning path:', error);
      // Fallback to show error message or retry option
      alert('Failed to generate learning path. Please try again.');
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