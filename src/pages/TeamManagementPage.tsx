import TeamManagement from '@/components/TeamManagement';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Employee } from '@/types/workspace';

const TeamManagementPage = () => {
  // Mock employee data
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@company.com',
      role: 'admin',
      department: 'Engineering',
      joinDate: new Date('2023-01-15'),
      lastActive: new Date()
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      role: 'team-lead',
      department: 'Marketing',
      joinDate: new Date('2023-02-20'),
      lastActive: new Date()
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@company.com',
      role: 'contributor',
      department: 'Product',
      joinDate: new Date('2023-03-10'),
      lastActive: new Date()
    }
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.location.href = '/chat'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Chat</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TeamManagement 
          employees={employees}
          onEmployeesUpdate={setEmployees}
          currentUserRole="admin"
          currentUserId="1"
        />
      </div>
    </div>
  );
};

export default TeamManagementPage;