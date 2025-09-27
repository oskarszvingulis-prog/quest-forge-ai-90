import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Send } from 'lucide-react';
import oracleImage from '@/assets/oracle-figure.jpg';

interface OracleLandingProps {
  onFirstInteraction: (message: string) => void;
}

export const OracleLanding = ({ onFirstInteraction }: OracleLandingProps) => {
  const [input, setInput] = useState('');
  const [isGreeting, setIsGreeting] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onFirstInteraction(input.trim());
      setIsGreeting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card relative overflow-hidden">
      {/* Mystical background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-oracle-glow rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-mystic-gold rounded-full animate-pulse opacity-70"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cosmic-blue rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-ethereal-purple rounded-full animate-pulse opacity-80"></div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen relative z-10">
        {/* Oracle Figure */}
        <div className="mb-8 relative">
          <div className="w-80 h-60 rounded-full overflow-hidden border-4 border-oracle-glow shadow-2xl shadow-oracle-glow/30 relative">
            <img 
              src={oracleImage} 
              alt="Oracle Path Keeper" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-oracle-glow/10"></div>
          </div>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-oracle-glow rounded-full animate-pulse opacity-70"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-mystic-gold rounded-full animate-pulse opacity-60"></div>
        </div>

        {/* Welcome Message */}
        <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm border border-oracle-glow/30 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-oracle-glow mr-2" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-oracle-glow to-mystic-gold bg-clip-text text-transparent">
                Welcome to your personalized AI Path Keeper
              </h1>
              <Sparkles className="w-6 h-6 text-oracle-glow ml-2" />
            </div>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              I am your mystical guide through the realms of productivity and personal growth. 
              Share your aspirations with me, and I shall illuminate the path to your destiny.
            </p>

            {isGreeting ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tell me about your goals, dreams, or what you seek to achieve..."
                    className="flex-1 bg-input/50 border-oracle-glow/30 focus:border-oracle-glow text-foreground placeholder:text-muted-foreground"
                  />
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-oracle-glow to-ethereal-purple hover:from-oracle-glow/80 hover:to-ethereal-purple/80 text-primary-foreground px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground/70">
                  Your journey begins with a single message to your Path Keeper
                </p>
              </form>
            ) : (
              <div className="animate-fade-in">
                <p className="text-oracle-glow font-medium">
                  The oracle is awakening... Your personalized workspace is being prepared...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mystical footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground/60 italic">
            "Every great journey begins with understanding oneself"
          </p>
        </div>
      </div>
    </div>
  );
};