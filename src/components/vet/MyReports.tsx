import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  Download,
  FileText,
  PawPrint,
  Users,
  Activity,
  DollarSign,
  Clock,
  Stethoscope,
  AlertTriangle,
  Heart,
  Pill,
  Syringe,
  Eye,
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

export function MyReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('last30days');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Mock data for reports
  const appointmentData = [
    { month: 'Jan', appointments: 120, completed: 115, cancelled: 5 },
    { month: 'Feb', appointments: 135, completed: 128, cancelled: 7 },
    { month: 'Mar', appointments: 142, completed: 138, cancelled: 4 },
    { month: 'Apr', appointments: 158, completed: 152, cancelled: 6 },
    { month: 'May', appointments: 165, completed: 160, cancelled: 5 },
    { month: 'Jun', appointments: 148, completed: 145, cancelled: 3 },
  ];

  const patientStatusData = [
    { name: 'Healthy', value: 156, color: '#10B981' },
    { name: 'Treatment', value: 42, color: '#F59E0B' },
    { name: 'Follow-up', value: 28, color: '#3B82F6' },
    { name: 'Critical', value: 8, color: '#EF4444' },
    { name: 'Chronic', value: 15, color: '#8B5CF6' },
  ];

  const procedureData = [
    { type: 'Examinations', count: 89, percentage: 35 },
    { type: 'Vaccinations', count: 67, percentage: 26 },
    { type: 'Surgeries', count: 23, percentage: 9 },
    { type: 'Dental', count: 34, percentage: 13 },
    { type: 'Emergency', count: 18, percentage: 7 },
    { type: 'Follow-ups', count: 25, percentage: 10 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12500, procedures: 120 },
    { month: 'Feb', revenue: 14200, procedures: 135 },
    { month: 'Mar', revenue: 15800, procedures: 142 },
    { month: 'Apr', revenue: 17500, procedures: 158 },
    { month: 'May', revenue: 18200, procedures: 165 },
    { month: 'Jun', revenue: 16800, procedures: 148 },
  ];

  const speciesData = [
    { name: 'Dogs', value: 158, color: '#3B82F6' },
    { name: 'Cats', value: 92, color: '#F59E0B' },
    { name: 'Birds', value: 23, color: '#10B981' },
    { name: 'Rabbits', value: 15, color: '#8B5CF6' },
    { name: 'Others', value: 12, color: '#EF4444' },
  ];

  const performanceMetrics = {
    totalPatients: 249,
    totalAppointments: 968,
    completionRate: 96.2,
    averageConsultationTime: 28,
    patientSatisfaction: 4.8,
    totalRevenue: 95200,
    monthlyGrowth: 8.5,
    criticalCases: 8,
    successfulTreatments: 234,
    followUpCompliance: 88.5
  };

  const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-2xl font-bold">{value}</p>
              {change && (
                <div className={`flex items-center gap-1 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {changeType === 'positive' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{change}%</span>
                </div>
              )}
            </div>
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  const OverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={performanceMetrics.totalPatients}
          change={12.5}
          changeType="positive"
          icon={PawPrint}
          color="text-blue-500"
        />
        <StatCard
          title="Total Appointments"
          value={performanceMetrics.totalAppointments}
          change={8.3}
          changeType="positive"
          icon={CalendarIcon}
          color="text-green-500"
        />
        <StatCard
          title="Completion Rate"
          value={`${performanceMetrics.completionRate}%`}
          change={2.1}
          changeType="positive"
          icon={Activity}
          color="text-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${performanceMetrics.totalRevenue.toLocaleString()}`}
          change={performanceMetrics.monthlyGrowth}
          changeType="positive"
          icon={DollarSign}
          color="text-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10B981" name="Completed" />
                <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={patientStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {patientStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Species Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Species Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={speciesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {speciesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const PerformanceReport = () => (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Avg. Consultation</p>
            <p className="text-xl font-bold">{performanceMetrics.averageConsultationTime} min</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Patient Satisfaction</p>
            <p className="text-xl font-bold">{performanceMetrics.patientSatisfaction}/5.0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-xl font-bold">{performanceMetrics.completionRate}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Critical Cases</p>
            <p className="text-xl font-bold">{performanceMetrics.criticalCases}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Stethoscope className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Follow-up Rate</p>
            <p className="text-xl font-bold">{performanceMetrics.followUpCompliance}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Procedure Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Procedure Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {procedureData.map((procedure, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="font-medium">{procedure.type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{procedure.count} procedures</span>
                  <Badge variant="outline">{procedure.percentage}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="appointments" stroke="#3B82F6" strokeWidth={2} name="Total Appointments" />
              <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const FinancialReport = () => (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${performanceMetrics.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                <p className="text-2xl font-bold">{performanceMetrics.monthlyGrowth}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. per Appointment</p>
                <p className="text-2xl font-bold">${Math.round(performanceMetrics.totalRevenue / performanceMetrics.totalAppointments)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold">$16,800</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Procedure Type */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Procedure Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={procedureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Count']} />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            My Reports
          </h1>
          <p className="text-gray-600 mt-1">Practice analytics and performance insights</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last3months">Last 3 months</SelectItem>
              <SelectItem value="last6months">Last 6 months</SelectItem>
              <SelectItem value="lastyear">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Active Patients</p>
                <p className="text-3xl font-bold">{performanceMetrics.totalPatients}</p>
              </div>
              <PawPrint className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Success Rate</p>
                <p className="text-3xl font-bold">{performanceMetrics.completionRate}%</p>
              </div>
              <Activity className="h-10 w-10 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Patient Satisfaction</p>
                <p className="text-3xl font-bold">{performanceMetrics.patientSatisfaction}/5</p>
              </div>
              <Heart className="h-10 w-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Monthly Revenue</p>
                <p className="text-3xl font-bold">$16.8K</p>
              </div>
              <DollarSign className="h-10 w-10 text-yellow-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Activity className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="financial">
            <DollarSign className="h-4 w-4 mr-2" />
            Financial
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewReport />
        </TabsContent>
        
        <TabsContent value="performance">
          <PerformanceReport />
        </TabsContent>
        
        <TabsContent value="financial">
          <FinancialReport />
        </TabsContent>
      </Tabs>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Action Items & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Follow-up Rate Below Target</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  Current follow-up compliance is 88.5%. Consider implementing automated reminders to reach the 95% target.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Appointment Volume Growing</h4>
                <p className="text-sm text-blue-800 mt-1">
                  8.5% growth in appointments this month. Consider adjusting schedule to accommodate increased demand.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <Heart className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">High Patient Satisfaction</h4>
                <p className="text-sm text-green-800 mt-1">
                  4.8/5 satisfaction rating is excellent. Consider leveraging this for referral programs.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}