import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Download, Filter, Search, Shield, Activity, FileText, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_values?: any;
  new_values?: any;
  metadata?: any;
  timestamp: string;
  severity: string;
  profiles?: { first_name?: string; last_name?: string; email?: string } | null;
}

interface AnomalyAlert {
  id: string;
  alert_type: string;
  user_id: string;
  description: string;
  severity: string;
  status: string;
  created_at: string;
  profiles?: { first_name?: string; last_name?: string; email?: string } | null;
}

const AuditDashboard = () => {
  const { userRole, isAdmin } = useUserRole();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [anomalyAlerts, setAnomalyAlerts] = useState<AnomalyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    if (!isAdmin || !userRole?.teamId) return;
    fetchAuditData();
  }, [isAdmin, userRole?.teamId, dateRange]);

  const fetchAuditData = async () => {
    if (!userRole?.teamId) return;
    
    setLoading(true);
    try {
      const dateThreshold = new Date();
      switch (dateRange) {
        case '1d':
          dateThreshold.setDate(dateThreshold.getDate() - 1);
          break;
        case '7d':
          dateThreshold.setDate(dateThreshold.getDate() - 7);
          break;
        case '30d':
          dateThreshold.setDate(dateThreshold.getDate() - 30);
          break;
        default:
          dateThreshold.setDate(dateThreshold.getDate() - 7);
      }

      // Fetch audit logs
      const { data: logs, error: logsError } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('team_id', userRole.teamId)
        .gte('timestamp', dateThreshold.toISOString())
        .order('timestamp', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;
      
      // Fetch user profiles for the logs
      const userIds = logs?.map(log => log.user_id).filter(Boolean) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', userIds);

      // Merge profiles with logs
      const logsWithProfiles = logs?.map(log => ({
        ...log,
        profiles: profiles?.find(p => p.id === log.user_id) || null
      })) || [];

      setAuditLogs(logsWithProfiles as AuditLog[]);

      // Fetch anomaly alerts
      const { data: alerts, error: alertsError } = await supabase
        .from('anomaly_alerts')
        .select('*')
        .eq('team_id', userRole.teamId)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (alertsError) throw alertsError;
      
      // Fetch user profiles for alerts
      const alertUserIds = alerts?.map(alert => alert.user_id).filter(Boolean) || [];
      const { data: alertProfiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', alertUserIds);

      // Merge profiles with alerts
      const alertsWithProfiles = alerts?.map(alert => ({
        ...alert,
        profiles: alertProfiles?.find(p => p.id === alert.user_id) || null
      })) || [];

      setAnomalyAlerts(alertsWithProfiles as AnomalyAlert[]);

    } catch (error) {
      console.error('Error fetching audit data:', error);
      toast.error('Failed to load audit data');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format: 'json' | 'csv') => {
    try {
      const filteredLogs = auditLogs.filter(log => {
      const matchesSearch = searchTerm === '' || 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = filterAction === 'all' || log.action === filterAction;
        const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
        return matchesSearch && matchesAction && matchesSeverity;
      });

      if (format === 'json') {
        const dataStr = JSON.stringify(filteredLogs, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `audit_logs_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      } else {
        const csvHeaders = ['Timestamp', 'User', 'Action', 'Resource Type', 'Severity', 'Description'];
        const csvRows = filteredLogs.map(log => [
          new Date(log.timestamp).toLocaleString(),
          log.profiles?.email || 'Unknown',
          log.action,
          log.resource_type,
          log.severity,
          JSON.stringify(log.metadata || {})
        ]);
        
        const csvContent = [
          csvHeaders.join(','),
          ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        const exportFileDefaultName = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      }
      
      toast.success(`Audit logs exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('anomaly_alerts')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;
      
      setAnomalyAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast.success('Alert resolved');
    } catch (error) {
      toast.error('Failed to resolve alert');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    return matchesSearch && matchesAction && matchesSeverity;
  });

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-foreground">Access Denied</h3>
          <p className="mt-1 text-sm text-muted-foreground">Only administrators can access audit logs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Audit Dashboard</h1>
        <p className="text-muted-foreground">Monitor and analyze system activities and security events</p>
      </div>

      {/* Anomaly Alerts */}
      {anomalyAlerts.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Active Security Alerts ({anomalyAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {anomalyAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                      <span className="font-medium">{alert.alert_type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    <p className="text-xs text-muted-foreground">
                      User: {alert.profiles?.email || 'Unknown'} • {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="user_login">Login</SelectItem>
                    <SelectItem value="file_access">File Access</SelectItem>
                    <SelectItem value="file_edit">File Edit</SelectItem>
                    <SelectItem value="file_delete">File Delete</SelectItem>
                    <SelectItem value="permission_change">Permission Change</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => exportData('json')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs ({filteredLogs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {log.profiles?.first_name} {log.profiles?.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {log.profiles?.email || 'Unknown'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.resource_type}</TableCell>
                        <TableCell>
                          <Badge variant={getSeverityColor(log.severity)}>
                            {log.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="text-sm truncate">
                            {JSON.stringify(log.metadata || {})}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditLogs.length}</div>
                <p className="text-xs text-muted-foreground">Last {dateRange}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Severity Events</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {auditLogs.filter(log => log.severity === 'high' || log.severity === 'critical').length}
                </div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{anomalyAlerts.length}</div>
                <p className="text-xs text-muted-foreground">Security anomalies</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditDashboard;