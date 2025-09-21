import React, { useState } from 'react';
import { Users, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SpaceMember {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string;
  role: string;
  status: string;
}

interface CollapsibleMembersSidebarProps {
  members: SpaceMember[];
}

export const CollapsibleMembersSidebar: React.FC<CollapsibleMembersSidebarProps> = ({
  members
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isExpanded) {
    return (
      <TooltipProvider>
        <div className="w-12 border-l border-r-0 border-t-0 border-b-0 bg-background flex flex-col">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="m-2 p-2 h-8 w-8 hover:bg-muted"
              >
                <Users className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Show Members ({members.length})</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Minimized member avatars */}
          <div className="flex-1 p-1 space-y-2 overflow-hidden">
            {members.slice(0, 8).map((member) => (
              <Tooltip key={member.user_id}>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Avatar className="h-6 w-6 mx-auto">
                      <AvatarImage src={member.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {member.first_name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-green-500 rounded-full border border-background" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <div>
                    <p className="font-medium">{member.first_name} {member.last_name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
            {members.length > 8 && (
              <div className="text-xs text-muted-foreground text-center">
                +{members.length - 8}
              </div>
            )}
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <Card className="w-64 border-l border-r-0 border-t-0 border-b-0 rounded-none bg-background">
      <div className="p-4 border-b flex items-center justify-between">
        <h4 className="font-medium text-sm">Members ({members.length})</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="p-1 h-6 w-6 hover:bg-muted"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="p-2 space-y-1">
          {members.map((member) => (
            <div key={member.user_id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors">
              <div className="relative">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={member.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {member.first_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-green-500 rounded-full border border-background" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {member.first_name} {member.last_name}
                </p>
                <Badge variant="secondary" className="text-xs mt-0.5">
                  {member.role}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};