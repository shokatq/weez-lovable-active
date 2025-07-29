import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Crown, 
  Eye, 
  Trash2, 
  Settings,
  Building2,
  FileText,
  Bell,
  Activity,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX
} from 'lucide-react';
import { Employee } from '@/types/workspace';

interface TeamManagementProps {
  employees: Employee[];
  onEmployeesUpdate: (employees: Employee[]) => void;
  currentUserRole?: 'admin' | 'employee';
  currentUserId?: string;
}

const departments = [
  'Engineering', 'Sales', 'Marketing', 'Product', 'Legal', 'HR', 'Finance', 'Operations'
];

const roles = [
  { value: 'admin', label: 'Admin', icon: Crown, description: 'Full access and user management' },
  { value: 'team-lead', label: 'Team Lead', icon: Shield, description: 'Project management and AI summaries' },
  { value: 'contributor', label: 'Contributor', icon: UserCheck, description: 'Upload and manage documents' },
  { value: 'viewer', label: 'Viewer', icon: Eye, description: 'Read-only access' }
];

const TeamManagement: React.FC<TeamManagementProps> = ({ 
  employees, 
  onEmployeesUpdate, 
  currentUserRole = 'admin',
  currentUserId = 'current-user' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: 'contributor' as Employee['role'],
    department: ''
  });

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesRole = selectedRole === 'all' || employee.role === selectedRole;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const handleAddEmployee = () => {
    if (currentUserRole !== 'admin') return;
    
    if (newEmployee.name && newEmployee.email && newEmployee.department) {
      const employee: Employee = {
        id: `emp-${Date.now()}`,
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role,
        department: newEmployee.department,
        joinDate: new Date(),
        lastActive: new Date()
      };
      
      onEmployeesUpdate([...employees, employee]);
      setNewEmployee({ name: '', email: '', role: 'contributor', department: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleRoleChange = (employeeId: string, newRole: Employee['role']) => {
    if (currentUserRole !== 'admin') return;
    if (employeeId === currentUserId && newRole !== 'admin') return; // Can't demote yourself
    
    const updatedEmployees = employees.map(emp =>
      emp.id === employeeId ? { ...emp, role: newRole } : emp
    );
    onEmployeesUpdate(updatedEmployees);
  };

  const handleRemoveEmployee = (employeeId: string) => {
    if (currentUserRole !== 'admin') return;
    if (employeeId === currentUserId) return; // Can't remove yourself
    
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee?.role === 'admin') return; // Can't remove other admins
    
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    onEmployeesUpdate(updatedEmployees);
  };

  const canManageEmployee = (employee: Employee) => {
    if (currentUserRole !== 'admin') return false;
    if (employee.id === currentUserId) return false; // Can't manage yourself
    return true;
  };

  const getRoleIcon = (role: Employee['role']) => {
    const roleData = roles.find(r => r.value === role);
    return roleData?.icon || UserCheck;
  };

  const getDepartmentStats = () => {
    const stats = departments.map(dept => ({
      name: dept,
      count: employees.filter(emp => emp.department === dept).length,
      admins: employees.filter(emp => emp.department === dept && emp.role === 'admin').length
    }));
    return stats.filter(stat => stat.count > 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Team Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage your organization's team structure and permissions
          </p>
        </div>
        {currentUserRole === 'admin' && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Full Name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                />
                <Input
                  placeholder="Email Address"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                />
                <Select
                  value={newEmployee.department}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newEmployee.role}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value as Employee['role'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-2">
                          <role.icon className="w-4 h-4" />
                          <span>{role.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddEmployee} className="w-full">
                  Add Team Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="team" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="team">Team Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center p-4 bg-muted rounded-lg">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team Members Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEmployees.map((employee) => {
              const RoleIcon = getRoleIcon(employee.role);
              return (
                <Card key={employee.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback>
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-sm">{employee.name}</h3>
                          <p className="text-xs text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                      {canManageEmployee(employee) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEmployee(employee.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          <Building2 className="w-3 h-3 mr-1" />
                          {employee.department}
                        </Badge>
                        <Badge 
                          variant={employee.role === 'admin' ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {roles.find(r => r.value === employee.role)?.label}
                        </Badge>
                      </div>
                      
                      {currentUserRole === 'admin' && canManageEmployee(employee) && (
                        <Select
                          value={employee.role}
                          onValueChange={(value) => handleRoleChange(employee.id, value as Employee['role'])}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                <div className="flex items-center gap-2">
                                  <role.icon className="w-3 h-3" />
                                  <span className="text-xs">{role.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Joined: {employee.joinDate.toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getDepartmentStats().map((dept) => (
              <Card key={dept.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {dept.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Members:</span>
                      <span className="font-medium">{dept.count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Admins:</span>
                      <span className="font-medium">{dept.admins}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <div className="grid gap-4">
            {roles.map((role) => (
              <Card key={role.value}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <role.icon className="w-5 h-5" />
                    {role.label}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    Members: {employees.filter(emp => emp.role === role.value).length}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <UserPlus className="w-4 h-4 text-green-500" />
                  <span>New team member added</span>
                  <span className="text-muted-foreground ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Settings className="w-4 h-4 text-blue-500" />
                  <span>Role updated for team member</span>
                  <span className="text-muted-foreground ml-auto">1 day ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <UserX className="w-4 h-4 text-red-500" />
                  <span>Team member removed</span>
                  <span className="text-muted-foreground ml-auto">3 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;