import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Target, 
  Brain, 
  Clock,
  Sparkles,
  ArrowRight
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

interface ProfileSetupProps {
  onProfileComplete: (profile: UserProfile) => void;
}

const motivationStyles = [
  { 
    id: 'encouraging', 
    name: 'Encouraging', 
    description: 'Supportive and positive guidance',
    icon: '🌟'
  },
  { 
    id: 'challenging', 
    name: 'Challenging', 
    description: 'Push yourself with tough goals',
    icon: '💪'
  },
  { 
    id: 'analytical', 
    name: 'Analytical', 
    description: 'Data-driven insights and metrics',
    icon: '📊'
  }
];

const experienceLevels = [
  { id: 'beginner', name: 'Beginner', description: 'Just starting my journey' },
  { id: 'intermediate', name: 'Intermediate', description: 'Some experience with goal setting' },
  { id: 'advanced', name: 'Advanced', description: 'Experienced with productivity systems' }
];

const commonGoals = [
  'Fitness & Health', 'Learning & Education', 'Career Growth', 
  'Financial Goals', 'Creative Projects', 'Relationships',
  'Travel & Adventure', 'Personal Development', 'Entrepreneurship'
];

const commonInterests = [
  'Technology', 'Art & Design', 'Music', 'Sports', 'Reading',
  'Cooking', 'Gaming', 'Photography', 'Writing', 'Science'
];

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onProfileComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    goals: [],
    interests: [],
    motivationStyle: 'encouraging',
    experience: 'beginner',
    preferredDifficulty: 'medium'
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onProfileComplete(profile as UserProfile);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleGoal = (goal: string) => {
    const currentGoals = profile.goals || [];
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal];
    setProfile({ ...profile, goals: newGoals });
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = profile.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    setProfile({ ...profile, interests: newInterests });
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return profile.name && profile.name.trim().length > 0;
      case 2:
        return (profile.goals?.length || 0) > 0;
      case 3:
        return (profile.interests?.length || 0) > 0;
      case 4:
        return profile.availableTime && profile.availableTime.trim().length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-achievement/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mx-auto mb-4">
            <Brain className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl mb-2">Welcome to Quest Forge AI</CardTitle>
          <p className="text-muted-foreground">
            Let's personalize your mentor experience (Step {step} of 4)
          </p>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Tell us about yourself</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">What should we call you?</Label>
                  <Input
                    id="name"
                    value={profile.name || ''}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Experience Level</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                    {experienceLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setProfile({ ...profile, experience: level.id as any })}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          profile.experience === level.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-medium">{level.name}</div>
                        <div className="text-sm text-muted-foreground">{level.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">What are your main goals?</h3>
              </div>
              
              <p className="text-muted-foreground">Select the areas you'd like to focus on:</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonGoals.map((goal) => (
                  <Badge
                    key={goal}
                    variant={profile.goals?.includes(goal) ? "default" : "outline"}
                    className="cursor-pointer p-3 justify-center hover:bg-primary/10 transition-colors"
                    onClick={() => toggleGoal(goal)}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">What are your interests?</h3>
              </div>
              
              <p className="text-muted-foreground">This helps us create more engaging quests:</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={profile.interests?.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer p-3 justify-center hover:bg-primary/10 transition-colors"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Final preferences</h3>
              </div>

              <div>
                <Label>How much time can you dedicate daily?</Label>
                <Textarea
                  value={profile.availableTime || ''}
                  onChange={(e) => setProfile({ ...profile, availableTime: e.target.value })}
                  placeholder="e.g., 30 minutes in the morning, 1 hour in the evening..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Motivation Style</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  {motivationStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setProfile({ ...profile, motivationStyle: style.id as any })}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        profile.motivationStyle === style.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{style.icon}</div>
                      <div className="font-medium">{style.name}</div>
                      <div className="text-sm text-muted-foreground">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Preferred Quest Difficulty</Label>
                <div className="flex gap-3 mt-2">
                  {['easy', 'medium', 'hard'].map((difficulty) => (
                    <Badge
                      key={difficulty}
                      variant={profile.preferredDifficulty === difficulty ? "default" : "outline"}
                      className="cursor-pointer p-3 capitalize hover:bg-primary/10 transition-colors"
                      onClick={() => setProfile({ ...profile, preferredDifficulty: difficulty as any })}
                    >
                      {difficulty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2"
            >
              {step === 4 ? 'Start Your Journey' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};