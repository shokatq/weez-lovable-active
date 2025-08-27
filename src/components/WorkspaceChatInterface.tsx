import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquare,
  Users,
  FileText,
  TrendingUp,
  Clock,
  Send,
  Bot,
  User as UserIcon,
  Sparkles,
  Target,
  Database,
  Activity
} from 'lucide-react';
import ThinkingAnimation from '@/components/ThinkingAnimation';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
}

const WorkspaceChatInterface = () => {
  const { userRole, hasTeam } = useUserRole();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [teamStats, setTeamStats] = useState({
    totalMembers: 0,
    departments: 0,
    activeProjects: 5,
    filesStored: 1247
  });

  // Suggestion bubbles with analytics focus
  const suggestions = [
    "Show me team analytics for this month",
    "What's our current team structure?",
    "How many files were processed today?",
    "Generate department performance report",
    "Show time saved by AI automation"
  ];

  useEffect(() => {
    fetchTeamStats();
    // Add welcome message
    setMessages([{
      id: '1',
      content: `Welcome to your team workspace! I'm your AI assistant. I can help you with team analytics, file management, and department insights. How can I assist you today?`,
      type: 'ai',
      timestamp: new Date()
    }]);
  }, [hasTeam]);

  const fetchTeamStats = async () => {
    if (!hasTeam || !userRole?.teamId) return;

    try {
      // Fetch team members count
      const { data: employees } = await supabase
        .from('team_employees')
        .select('id')
        .eq('team_id', userRole.teamId)
        .eq('status', 'active');

      // Fetch departments count
      const { data: departments } = await supabase
        .from('departments')
        .select('id')
        .eq('team_id', userRole.teamId);

      setTeamStats(prev => ({
        ...prev,
        totalMembers: employees?.length || 0,
        departments: departments?.length || 0
      }));
    } catch (error) {
      console.error('Error fetching team stats:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    // Simulate AI response with analytics focus
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        type: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsThinking(false);
    }, 2000);
  };

  const generateAIResponse = (input: string) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('team analytics') || lowerInput.includes('analytics')) {
      return `## 📊 Team Analytics Overview

**Current Team Stats:**
• **Total Members:** ${teamStats.totalMembers} active employees
• **Departments:** ${teamStats.departments} organizational units
• **Active Projects:** ${teamStats.activeProjects} ongoing initiatives
• **Files Managed:** ${teamStats.filesStored.toLocaleString()} documents

**Performance Insights:**
• **Productivity Increase:** 34% since implementing Weez.AI
• **Time Saved:** 12.5 hours per week per employee
• **Document Retrieval:** 89% faster than previous methods
• **Team Collaboration:** 45% improvement in cross-department communication

**Key Recommendations:**
• Consider expanding to ${teamStats.departments + 2} departments
• Implement advanced AI workflows for ${teamStats.totalMembers} team members
• Schedule quarterly productivity reviews`;
    }

    if (lowerInput.includes('team structure') || lowerInput.includes('structure')) {
      return `## 🏢 Current Team Structure

**Workspace:** ${userRole?.teamName || 'Your Team'}
**Your Role:** ${userRole?.role || 'Member'}

**Organizational Breakdown:**
• **Total Employees:** ${teamStats.totalMembers}
• **Department Count:** ${teamStats.departments}
• **Management Tiers:** 3 levels (Admin → Team Lead → Contributors)

**Department Distribution:**
• Marketing: 8 members
• Creative: 6 members  
• Operations: 5 members
• Sales: 4 members
• HR: 3 members
• Finance: 3 members

**Role Hierarchy:**
• **Admins:** Full workspace access
• **Team Leads:** Department management
• **Contributors:** Project participation
• **Viewers:** Read-only access`;
    }

    if (lowerInput.includes('files') || lowerInput.includes('documents')) {
      return `## 📁 File Management Report

**Storage Statistics:**
• **Total Files:** ${teamStats.filesStored.toLocaleString()} documents
• **Processed Today:** 47 new files
• **AI Summaries Generated:** 23 this week
• **Storage Used:** 487.2 GB across all platforms

**File Distribution:**
• **Google Drive:** 45% (562 files)
• **Notion:** 28% (349 files)  
• **Slack:** 15% (187 files)
• **OneDrive:** 12% (149 files)

**Recent Activity:**
• 12 documents uploaded in the last hour
• 8 AI summaries requested today
• 5 files shared across departments
• 3 collaborative documents created

**Recommendations:**
• Archive files older than 6 months
• Implement automated tagging system
• Schedule weekly file organization`;
    }

    if (lowerInput.includes('time saved') || lowerInput.includes('automation')) {
      return `## ⏱️ AI Automation Impact

**Time Savings Analysis:**
• **Per Employee:** 12.5 hours saved weekly
• **Team Total:** ${(teamStats.totalMembers * 12.5).toFixed(1)} hours per week
• **Monthly Impact:** ${(teamStats.totalMembers * 12.5 * 4).toFixed(0)} hours saved

**Automation Breakdown:**
• **Document Search:** 8.2 hours/week saved
• **File Summarization:** 2.8 hours/week saved  
• **Report Generation:** 1.5 hours/week saved

**ROI Calculation:**
• **Cost Savings:** $${(teamStats.totalMembers * 12.5 * 50 * 4).toLocaleString()}/month
• **Productivity Gain:** 34% increase
• **Employee Satisfaction:** 89% positive feedback

**Next Steps:**
• Implement advanced workflow automation
• Expand AI capabilities to more departments
• Track additional productivity metrics`;
    }

    return `I understand you're asking about "${input}". As your AI workspace assistant, I can help you with:

📊 **Team Analytics** - Performance metrics, productivity insights
👥 **Team Management** - Member roles, department structure  
📁 **File Intelligence** - Document analysis, storage optimization
⚡ **Automation Reports** - Time savings, efficiency gains
🎯 **Project Insights** - Status updates, resource allocation

What specific area would you like me to analyze for you?`;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
      {/* Analytics Overview */}
      <div className="xl:col-span-1 space-y-4">
        <Card className="bg-card border-border backdrop-blur-md shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <TrendingUp className="w-5 h-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-primary/5 rounded-lg">
                <Users className="w-6 h-6 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold text-foreground">{teamStats.totalMembers}</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
              <div className="text-center p-3 bg-primary/5 rounded-lg">
                <Database className="w-6 h-6 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold text-foreground">{teamStats.departments}</div>
                <div className="text-sm text-muted-foreground">Departments</div>
              </div>
              <div className="text-center p-3 bg-primary/5 rounded-lg">
                <Target className="w-6 h-6 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold text-foreground">{teamStats.activeProjects}</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center p-3 bg-primary/5 rounded-lg">
                <FileText className="w-6 h-6 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold text-foreground">{teamStats.filesStored.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Files</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border backdrop-blur-md shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Activity className="w-5 h-5" />
              AI Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Time Saved/Week</span>
              <span className="font-semibold text-foreground">{(teamStats.totalMembers * 12.5).toFixed(1)}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Productivity Boost</span>
              <span className="font-semibold text-green-600">+34%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Files Processed</span>
              <span className="font-semibold text-foreground">47 today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="xl:col-span-2">
        <Card className="bg-card border-border backdrop-blur-md shadow-lg h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <MessageSquare className="w-5 h-5" />
              AI Workspace Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 p-6">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                          }`}
                      >
                        {message.type === 'user' ? (
                          <UserIcon className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                          }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isThinking && (
                  <div className="flex gap-3 justify-start">
                    <ThinkingAnimation type="general" />
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground mb-2">Quick suggestions:</div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs border-primary/20 hover:bg-primary/5 hover:border-primary/40"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about team analytics, file management, or productivity insights..."
                className={`flex-1 border-primary/20 focus:border-primary/40 ${isThinking ? 'animate-pulse-glow border-primary/40' : ''}`}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isThinking}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkspaceChatInterface;