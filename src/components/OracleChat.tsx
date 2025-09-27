import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Sparkles, 
  Target, 
  Calendar, 
  ListTodo, 
  TrendingUp,
  Settings,
  Zap
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'oracle';
  timestamp: Date;
  modules?: string[];
}

interface ModuleOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface OracleChatProps {
  initialMessage: string;
  onModuleActivation: (moduleIds: string[]) => void;
}

const availableModules: ModuleOption[] = [
  {
    id: 'quests',
    name: 'Quest System',
    description: 'Gamified tasks and challenges',
    icon: <Target className="w-4 h-4" />,
    color: 'bg-quest-active text-quest-active-foreground'
  },
  {
    id: 'calendar',
    name: 'Calendar & Planning',
    description: 'Time management and scheduling',
    icon: <Calendar className="w-4 h-4" />,
    color: 'bg-cosmic-blue text-primary-foreground'
  },
  {
    id: 'tasks',
    name: 'Task Manager',
    description: 'Organize and track your todos',
    icon: <ListTodo className="w-4 h-4" />,
    color: 'bg-ethereal-purple text-primary-foreground'
  },
  {
    id: 'progress',
    name: 'Progress Analytics',
    description: 'Track your growth and achievements',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'bg-mystic-gold text-primary-foreground'
  },
  {
    id: 'habits',
    name: 'Habit Tracker',
    description: 'Build and maintain positive habits',
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-success text-success-foreground'
  }
];

export const OracleChat = ({ initialMessage, onModuleActivation }: OracleChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [showModuleSelection, setShowModuleSelection] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate oracle response to initial message
    const initialResponse: Message = {
      id: 'oracle-initial',
      content: `I sense great potential within you. "${initialMessage}" - these words reveal much about your journey ahead. 

Let me divine the tools that will best serve your path to enlightenment. I can manifest various modules to assist you:

Would you like me to activate any of these mystical tools for your workspace?`,
      type: 'oracle',
      timestamp: new Date(),
      modules: availableModules.map(m => m.id)
    };

    setMessages([
      {
        id: 'user-initial',
        content: initialMessage,
        type: 'user',
        timestamp: new Date()
      },
      initialResponse
    ]);
    
    setShowModuleSelection(true);
  }, [initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      type: 'user',
      timestamp: new Date()
    };

    // Simulate oracle response
    const oracleResponse: Message = {
      id: `oracle-${Date.now()}`,
      content: generateOracleResponse(input),
      type: 'oracle',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, oracleResponse]);
    setInput('');
  };

  const generateOracleResponse = (userInput: string): string => {
    const responses = [
      "I perceive wisdom in your words. The path becomes clearer...",
      "The cosmic energies align with your intentions. Continue on this journey...",
      "Your dedication illuminates the way forward. Let us proceed...",
      "The oracle sees great potential in your approach. Trust in your path...",
      "Your spirit resonates with the frequencies of success. Embrace this energy..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleActivateModules = () => {
    onModuleActivation(selectedModules);
    setShowModuleSelection(false);
    
    const activationMessage: Message = {
      id: `oracle-activation-${Date.now()}`,
      content: `The chosen modules have been woven into your workspace. Your personalized realm of productivity is now complete. May these tools serve you well on your journey to greatness.`,
      type: 'oracle',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, activationMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-xs lg:max-w-md ${
              message.type === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card border-oracle-glow/30'
            }`}>
              <CardContent className="p-3">
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
                  {message.type === 'oracle' && <Sparkles className="w-3 h-3" />}
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Module Selection */}
        {showModuleSelection && (
          <Card className="bg-card/80 backdrop-blur-sm border-oracle-glow/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-oracle-glow">
                <Settings className="w-5 h-5" />
                Choose Your Mystical Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableModules.map((module) => (
                  <Card
                    key={module.id}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedModules.includes(module.id)
                        ? 'ring-2 ring-oracle-glow bg-oracle-glow/10'
                        : 'hover:bg-card/80'
                    }`}
                    onClick={() => handleModuleToggle(module.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Badge className={module.color}>
                          {module.icon}
                        </Badge>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{module.name}</h4>
                          <p className="text-xs text-muted-foreground">{module.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Button
                onClick={handleActivateModules}
                className="w-full bg-gradient-to-r from-oracle-glow to-ethereal-purple hover:from-oracle-glow/80 hover:to-ethereal-purple/80"
                disabled={selectedModules.length === 0}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Manifest Selected Tools ({selectedModules.length})
              </Button>
            </CardContent>
          </Card>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <Card className="m-4 bg-card/80 backdrop-blur-sm border-oracle-glow/30">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Speak with your Oracle..."
              className="flex-1 bg-input/50 border-oracle-glow/30 focus:border-oracle-glow"
            />
            <Button 
              type="submit"
              className="bg-gradient-to-r from-oracle-glow to-ethereal-purple hover:from-oracle-glow/80 hover:to-ethereal-purple/80"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};