import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Target, TrendingUp } from 'lucide-react';

interface MentorLandingProps {
  onStartJourney: () => void;
}

export const MentorLanding: React.FC<MentorLandingProps> = ({ onStartJourney }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-oracle-glow to-cosmic-blue flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-background animate-pulse" />
              </div>
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-oracle-glow opacity-20 animate-ping"></div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-oracle-glow via-cosmic-blue to-ethereal-purple bg-clip-text text-transparent">
            Your Mentor Journey
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Transform your goals into actionable plans with personalized guidance, 
            progress tracking, and curated tools for success.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="p-6 rounded-lg bg-card/50 border border-oracle-glow/20 backdrop-blur-sm">
            <Target className="w-8 h-8 text-oracle-glow mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Smart Goals</h3>
            <p className="text-sm text-muted-foreground">AI breaks down your objectives into achievable milestones</p>
          </div>
          
          <div className="p-6 rounded-lg bg-card/50 border border-cosmic-blue/20 backdrop-blur-sm">
            <TrendingUp className="w-8 h-8 text-cosmic-blue mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Track Progress</h3>
            <p className="text-sm text-muted-foreground">Visual progress bars and task completion tracking</p>
          </div>
          
          <div className="p-6 rounded-lg bg-card/50 border border-ethereal-purple/20 backdrop-blur-sm">
            <Sparkles className="w-8 h-8 text-ethereal-purple mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Curated Tools</h3>
            <p className="text-sm text-muted-foreground">Personalized recommendations for apps and resources</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <Button 
            onClick={onStartJourney}
            size="lg"
            className="bg-gradient-to-r from-oracle-glow to-cosmic-blue hover:from-oracle-glow/90 hover:to-cosmic-blue/90 text-background font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-oracle-glow/25 transition-all duration-300"
          >
            Start My Path
            <Sparkles className="ml-2 w-5 h-5" />
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Begin your personalized learning journey in seconds
          </p>
        </div>
      </div>
    </div>
  );
};