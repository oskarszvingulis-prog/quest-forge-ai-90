import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface MentorChatProps {
  onQuestGenerated: (quest: any) => void;
  userProfile: any;
}

export const MentorChat: React.FC<MentorChatProps> = ({ onQuestGenerated, userProfile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${userProfile?.name || 'there'}! I'm your AI mentor, here to help you achieve your goals through personalized quests and guidance. What would you like to work on today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateMentorResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Quest generation triggers
    if (lowerMessage.includes('goal') || lowerMessage.includes('want to') || lowerMessage.includes('need to')) {
      setTimeout(() => {
        generateQuest(userMessage);
      }, 1000);
      return "That sounds like a great goal! Let me create a personalized quest to help you achieve it. 🎯";
    }
    
    // Motivational responses
    if (lowerMessage.includes('stuck') || lowerMessage.includes('difficult') || lowerMessage.includes('hard')) {
      return "I understand it feels challenging right now. Remember, every expert was once a beginner. Let's break this down into smaller, manageable steps. What specific part is causing you the most difficulty?";
    }
    
    if (lowerMessage.includes('procrastinate') || lowerMessage.includes('motivation')) {
      return "Procrastination is often fear in disguise. Let's tackle this with a micro-habit approach. What's the smallest step you could take right now that would move you forward?";
    }
    
    // Productivity advice
    if (lowerMessage.includes('productive') || lowerMessage.includes('focus')) {
      return "Great question! Here are some proven techniques: 1) Use the Pomodoro Technique (25min focused work + 5min break), 2) Eliminate distractions, 3) Set clear priorities for the day. Which resonates most with you?";
    }
    
    // Default responses with context awareness
    const responses = [
      "That's an interesting perspective! How does this relate to your current goals?",
      "I appreciate you sharing that. What action step could you take based on this insight?",
      "Excellent! Building on that thought, what would success look like for you?",
      "That shows great self-awareness. How can we turn this into a learning opportunity?",
      "I see the potential here. What resources or support do you need to move forward?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateQuest = (userInput: string) => {
    // Simple quest generation based on user input
    const questTypes = ['daily', 'weekly', 'learning', 'habit'];
    const randomType = questTypes[Math.floor(Math.random() * questTypes.length)];
    
    const quest = {
      id: Date.now().toString(),
      title: `Quest: ${userInput.charAt(0).toUpperCase() + userInput.slice(1)}`,
      description: `Complete this personalized challenge based on your goal: ${userInput}`,
      type: randomType,
      xpReward: Math.floor(Math.random() * 50) + 25,
      difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
      status: 'active' as const,
      createdAt: new Date(),
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
    
    onQuestGenerated(quest);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const mentorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateMentorResponse(input),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, mentorResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] p-6">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">AI Mentor</h3>
          <p className="text-sm text-muted-foreground">Your personal productivity guide</p>
        </div>
        <Sparkles className="w-5 h-5 text-primary ml-auto" />
      </div>

      <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Share your goals, challenges, or ask for guidance..."
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};