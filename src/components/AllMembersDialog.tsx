import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, User, Crown, Shield, Eye, Mail, Building2 } from 'lucide-react';

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  status: string;
  joined_at: string;
  department_id?: string;
  custom_role?: string;
  custom_department?: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
  departments?: {
    name: string;
  };
}

interface AllMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: TeamMember[];
}

const AllMembersDialog = ({ open, onOpenChange, members }: AllMembersDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4" />;
      case 'team_lead': return <Shield className="w-4 h-4" />;
      case 'viewer': return <Eye className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'team_lead': return 'secondary';
      case 'employee': return 'outline';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${member.profiles?.first_name || ''} ${member.profiles?.last_name || ''}`.toLowerCase();
    const email = member.profiles?.email?.toLowerCase() || '';
    const department = member.departments?.name?.toLowerCase() || member.custom_department?.toLowerCase() || '';
    
    return fullName.includes(searchLower) || 
           email.includes(searchLower) || 
           department.includes(searchLower) ||
           member.role.toLowerCase().includes(searchLower);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            All Workspace Members ({members.length})
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search members by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No members found matching your search.
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={member.profiles?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {member.profiles?.first_name?.[0]}{member.profiles?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {member.profiles?.first_name} {member.profiles?.last_name}
                    </h3>
                    <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center gap-1">
                      {getRoleIcon(member.role)}
                      {member.custom_role || member.role}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{member.profiles?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{member.departments?.name || member.custom_department || 'General'}</span>
                    </div>
                    <div className="text-xs">
                      Joined {new Date(member.joined_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`w-3 h-3 rounded-full ${
                    member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <div className="text-xs text-muted-foreground mt-1">
                    {member.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllMembersDialog;