
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Crown, Shield, UserMinus, Mail, Calendar, Clock } from "lucide-react";
import { Employee } from "@/types/workspace";

interface EmployeeManagementProps {
  employees: Employee[];
  onEmployeesUpdate: (employees: Employee[]) => void;
}

const EmployeeManagement = ({ employees, onEmployeesUpdate }: EmployeeManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: ""
  });

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email) {
      const employee: Employee = {
        id: Date.now().toString(),
        name: newEmployee.name,
        email: newEmployee.email,
        role: 'employee',
        joinDate: new Date(),
        lastActive: new Date(),
        department: newEmployee.department || 'General'
      };
      
      onEmployeesUpdate([...employees, employee]);
      setNewEmployee({ name: "", email: "", department: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handlePromoteToAdmin = (employeeId: string) => {
    const updatedEmployees = employees.map(emp =>
      emp.id === employeeId ? { ...emp, role: 'admin' as const } : emp
    );
    onEmployeesUpdate(updatedEmployees);
  };

  const handleDemoteToEmployee = (employeeId: string) => {
    const updatedEmployees = employees.map(emp =>
      emp.id === employeeId ? { ...emp, role: 'employee' as const } : emp
    );
    onEmployeesUpdate(updatedEmployees);
  };

  const handleRemoveEmployee = (employeeId: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    onEmployeesUpdate(updatedEmployees);
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-gray-600">Manage your workspace members and permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 text-gray-900">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input
                  placeholder="Enter employee name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  placeholder="Enter employee email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Department</label>
                <Select
                  value={newEmployee.department}
                  onValueChange={(value) => setNewEmployee(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddEmployee} className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                  Add Employee
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Team Members ({employees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="text-gray-600">Employee</TableHead>
                <TableHead className="text-gray-600">Department</TableHead>
                <TableHead className="text-gray-600">Role</TableHead>
                <TableHead className="text-gray-600">Joined</TableHead>
                <TableHead className="text-gray-600">Last Active</TableHead>
                <TableHead className="text-gray-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} className="border-gray-200">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 text-sm font-medium">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{employee.name}</p>
                        <p className="text-gray-600 text-sm flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700">{employee.department}</span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={employee.role === 'admin' ? 'default' : 'secondary'}
                      className={employee.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}
                    >
                      {employee.role === 'admin' ? (
                        <>
                          <Crown className="w-3 h-3 mr-1" />
                          Admin
                        </>
                      ) : (
                        <>
                          <Shield className="w-3 h-3 mr-1" />
                          Employee
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <Calendar className="w-3 h-3" />
                      {employee.joinDate.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <Clock className="w-3 h-3" />
                      {formatLastActive(employee.lastActive)}
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex gap-2">
                      {/* Role-based access control: Only show admin actions if user is admin */}
                      {/* For demo purposes, assuming current user is admin */}
                      {employee.role === 'employee' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePromoteToAdmin(employee.id)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <Crown className="w-3 h-3 mr-1" />
                          Promote to Admin
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDemoteToEmployee(employee.id)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          Demote to Employee
                        </Button>
                      )}
                      {/* Admin cannot be removed by other admins for security */}
                      {employee.role !== 'admin' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveEmployee(employee.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <UserMinus className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
