import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Wrench, X, ExternalLink, Search } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  url?: string;
  isCustom?: boolean;
}

interface ToolsSectionProps {
  suggestedTools: Tool[];
  userTools: Tool[];
  onAddTool: (tool: Tool) => void;
  onRemoveTool: (toolId: string) => void;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({
  suggestedTools,
  userTools,
  onAddTool,
  onRemoveTool
}) => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customTool, setCustomTool] = useState({
    name: '',
    category: '',
    description: '',
    url: ''
  });

  const filteredSuggested = suggestedTools.filter(tool => 
    !userTools.some(userTool => userTool.id === tool.id) &&
    (searchQuery === '' || 
     tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tool.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddCustomTool = () => {
    if (!customTool.name.trim()) return;
    
    const newTool: Tool = {
      id: `custom-${Date.now()}`,
      name: customTool.name,
      category: customTool.category || 'Custom',
      description: customTool.description,
      url: customTool.url,
      isCustom: true
    };
    
    onAddTool(newTool);
    setCustomTool({ name: '', category: '', description: '', url: '' });
    setShowCustomForm(false);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Learning': 'bg-cosmic-blue/10 text-cosmic-blue border-cosmic-blue/20',
      'Organization': 'bg-oracle-glow/10 text-oracle-glow border-oracle-glow/20',
      'Development': 'bg-ethereal-purple/10 text-ethereal-purple border-ethereal-purple/20',
      'Custom': 'bg-mystic-gold/10 text-mystic-gold border-mystic-gold/20',
    };
    return colors[category as keyof typeof colors] || 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  return (
    <div className="space-y-6">
      {/* My Tools Section */}
      <Card className="border-oracle-glow/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-oracle-glow" />
            My Toolkit
            <Badge variant="outline" className="ml-auto">
              {userTools.length} tools
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userTools.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wrench className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tools added yet. Start by adding some from the suggestions below!</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {userTools.map((tool) => (
                <div 
                  key={tool.id} 
                  className="p-4 rounded-lg bg-card/50 border border-border/50 hover:border-oracle-glow/30 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{tool.name}</h4>
                      {tool.url && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => window.open(tool.url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveTool(tool.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{tool.description}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getCategoryColor(tool.category)}`}
                  >
                    {tool.category}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggested Tools Section */}
      <Card className="border-oracle-glow/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-oracle-glow" />
              Suggested Tools
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="border-oracle-glow/30"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Custom
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Custom Tool Form */}
          {showCustomForm && (
            <Card className="border-mystic-gold/20 bg-mystic-gold/5">
              <CardContent className="pt-4 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Tool name *"
                    value={customTool.name}
                    onChange={(e) => setCustomTool({ ...customTool, name: e.target.value })}
                  />
                  <Input
                    placeholder="Category"
                    value={customTool.category}
                    onChange={(e) => setCustomTool({ ...customTool, category: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="Description"
                  value={customTool.description}
                  onChange={(e) => setCustomTool({ ...customTool, description: e.target.value })}
                />
                <Input
                  placeholder="URL (optional)"
                  value={customTool.url}
                  onChange={(e) => setCustomTool({ ...customTool, url: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddCustomTool} size="sm" disabled={!customTool.name.trim()}>
                    Add Tool
                  </Button>
                  <Button variant="outline" onClick={() => setShowCustomForm(false)} size="sm">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggested Tools List */}
          {filteredSuggested.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tools found. Try a different search term.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredSuggested.map((tool) => (
                <div 
                  key={tool.id} 
                  className="p-4 rounded-lg bg-card/30 border border-border/30 hover:border-oracle-glow/50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{tool.name}</h4>
                      {tool.url && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => window.open(tool.url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onAddTool(tool)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{tool.description}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getCategoryColor(tool.category)}`}
                  >
                    {tool.category}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};