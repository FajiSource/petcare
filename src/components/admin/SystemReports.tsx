import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  PawPrint, 
  Building,
  Download,
  RefreshCw,
  Filter,
  Eye,
  FileText
} from 'lucide-react';

interface ReportData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export function SystemReports() {
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  // Mock data for different report types
  const overviewData: ReportData[] = [
    { label: 'Total Users', value: 1247, change: 12.5, trend: 'up' },
    { label: 'New Registrations', value: 89, change: 8.3, trend: 'up' },
    { label: 'Active Veterinarians', value: 38, change: 5.2, trend: 'up' },
    { label: 'Total Appointments', value: 892, change: 15.7, trend: 'up' },
    { label: 'Completed Appointments', value: 734, change: 18.2, trend: 'up' },
    { label: 'Total Pets Registered', value: 1456, change: 22.1, trend: 'up' }
  ];

  const appointmentData = [
    { month: 'Jan', appointments: 65, completed: 58, cancelled: 7 },
    { month: 'Feb', appointments: 78, completed: 71, cancelled: 7 },
    { month: 'Mar', appointments: 92, completed: 85, cancelled: 7 },
    { month: 'Apr', appointments: 87, completed: 79, cancelled: 8 },
    { month: 'May', appointments: 101, completed: 94, cancelled: 7 },
    { month: 'Jun', appointments: 114, completed: 106, cancelled: 8 },
    { month: 'Jul', appointments: 128, completed: 119, cancelled: 9 },
    { month: 'Aug', appointments: 95, completed: 89, cancelled: 6 }
  ];

  const userGrowthData = [
    { month: 'Jan', petOwners: 145, veterinarians: 5, admins: 1 },
    { month: 'Feb', petOwners: 167, veterinarians: 6, admins: 1 },
    { month: 'Mar', petOwners: 189, veterinarians: 7, admins: 1 },
    { month: 'Apr', petOwners: 212, veterinarians: 8, admins: 2 },
    { month: 'May', petOwners: 245, veterinarians: 9, admins: 2 },
    { month: 'Jun', petOwners: 278, veterinarians: 11, admins: 2 },
    { month: 'Jul', petOwners: 314, veterinarians: 12, admins: 2 },
    { month: 'Aug', petOwners: 89, veterinarians: 3, admins: 0 }
  ];

  const topVeterinarians = [
    { name: 'Dr. Sarah Johnson', appointments: 156, rating: 4.9, specialty: 'Small Animal Medicine' },
    { name: 'Dr. Michael Chen', appointments: 142, rating: 4.8, specialty: 'Emergency Medicine' },
    { name: 'Dr. Emily Rodriguez', appointments: 134, rating: 4.7, specialty: 'Surgery' },
    { name: 'Dr. David Kim', appointments: 128, rating: 4.6, specialty: 'Internal Medicine' },
    { name: 'Dr. Lisa Thompson', appointments: 119, rating: 4.8, specialty: 'Dermatology' }
  ];

  const topClinics = [
    { name: 'PetCare Veterinary Clinic', appointments: 345, pets: 567, rating: 4.8 },
    { name: 'Animal Health Center', appointments: 298, pets: 445, rating: 4.7 },
    { name: 'City Pet Hospital', appointments: 267, pets: 389, rating: 4.6 },
    { name: 'Emergency Animal Care', appointments: 234, pets: 298, rating: 4.9 }
  ];

  const systemHealthData = [
    { metric: 'Server Uptime', value: '99.8%', status: 'excellent' },
    { metric: 'Average Response Time', value: '245ms', status: 'good' },
    { metric: 'Database Performance', value: '98.2%', status: 'excellent' },
    { metric: 'Error Rate', value: '0.12%', status: 'excellent' },
    { metric: 'Storage Usage', value: '68%', status: 'good' },
    { metric: 'Backup Status', value: 'Current', status: 'excellent' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const exportReport = (type: string) => {
    console.log(`Exporting ${type} report...`);
    // In a real app, this would generate and download the report
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">System Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive system insights and performance metrics</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" onClick={() => exportReport('all')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={reportType} onValueChange={setReportType} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {overviewData.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                  {getTrendIcon(metric.trend)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
                  <p className={`text-xs flex items-center gap-1 ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                    {metric.change}% from last period
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointmentData.slice(-6).map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month.month}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{month.appointments}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">{month.completed}</div>
                          <div className="text-xs text-gray-500">Completed</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-red-600">{month.cancelled}</div>
                          <div className="text-xs text-gray-500">Cancelled</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Veterinarians</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topVeterinarians.slice(0, 5).map((vet, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{vet.name}</div>
                        <div className="text-xs text-gray-500">{vet.specialty}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{vet.appointments} appointments</div>
                        <div className="text-xs text-yellow-600">★ {vet.rating}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userGrowthData.slice(-6).map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month.month}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-600">{month.petOwners}</div>
                          <div className="text-xs text-gray-500">Pet Owners</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">{month.veterinarians}</div>
                          <div className="text-xs text-gray-500">Vets</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-red-600">{month.admins}</div>
                          <div className="text-xs text-gray-500">Admins</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Daily Active Users</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">847</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Weekly Active Users</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">1,156</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                    <div className="flex items-center gap-2">
                      <PawPrint className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Monthly Active Users</span>
                    </div>
                    <span className="text-xl font-bold text-purple-600">1,247</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">82.3%</div>
                      <div className="text-sm text-gray-600">Completion Rate</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">45min</div>
                      <div className="text-sm text-gray-600">Avg Duration</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-2xl font-bold text-yellow-600">7.8%</div>
                      <div className="text-sm text-gray-600">Cancellation Rate</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="text-2xl font-bold text-purple-600">4.7★</div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Clinics by Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topClinics.map((clinic, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{clinic.name}</div>
                        <div className="text-xs text-gray-500">{clinic.pets} pets registered</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{clinic.appointments} appointments</div>
                        <div className="text-xs text-yellow-600">★ {clinic.rating}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">99.8%</div>
                  <div className="text-sm text-gray-600">System Uptime</div>
                  <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1.2s</div>
                  <div className="text-sm text-gray-600">Avg Page Load</div>
                  <div className="text-xs text-gray-500 mt-1">Global average</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">245ms</div>
                  <div className="text-sm text-gray-600">API Response Time</div>
                  <div className="text-xs text-gray-500 mt-1">Average</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health Monitor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemHealthData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{item.metric}</div>
                      <div className="text-sm text-gray-600">{item.value}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}