import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  TrendingUp,
  Users,
  Calendar,
  PawPrint,
  Download,
  RefreshCw,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { useAdminDashboardTotals, useGetAppointmentAnalytics, useGetMonthlyAppoinments, useGetTopPerformingClinics, useGetTopVets, useGetUserActivitySummary, useGetUserTrends } from '../../lib/react-query/QueriesAndMutations';
import { ITopVet, IUserTrend } from '../../lib/types';

interface ReportData {
  label: string;
  value: number;
}
export function SystemReports() {
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('overview');
  const { data: totals } = useAdminDashboardTotals()
  const { data: monthlyAppointments } = useGetMonthlyAppoinments()
  const { data: topVeterinarians } = useGetTopVets()
  const { data: userGrowthData } = useGetUserTrends()
  const { data: userActivitySummary } = useGetUserActivitySummary()
  const { data: topClinics } = useGetTopPerformingClinics()
  const { data: appointmentAnalytics } = useGetAppointmentAnalytics()

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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(() => {
              const metricsList: { label: string; value: number }[] = [];
              if (totals) {
                metricsList.push({ label: 'Users', value: totals.users ?? 0 });
                metricsList.push({ label: 'Pets', value: totals.pets ?? 0 });
                metricsList.push({ label: 'Veterinarians', value: totals.vets ?? 0 });
              }
              return metricsList.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
                  </CardContent>
                </Card>
              ));
            })()}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(monthlyAppointments) && monthlyAppointments.length > 0 ? (
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyAppointments.slice(-12)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month_name" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="total" stroke="#3B82F6" name="Total" strokeWidth={2} />
                          <Line type="monotone" dataKey="completed" stroke="#10B981" name="Completed" strokeWidth={2} />
                          <Line type="monotone" dataKey="cancelled" stroke="#EF4444" name="Cancelled" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No appointment data available.</div>
                  )}
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Veterinarians</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topVeterinarians?.map((vet: ITopVet, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{vet.name}</div>
                        <div className="text-xs text-gray-500">{vet.specialization}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{vet.total_appointments} appointments</div>
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
                {Array.isArray(userGrowthData) && userGrowthData.length > 0 ? (
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="petOwners" stroke="#3B82F6" name="Pet Owners" strokeWidth={2} />
                        <Line type="monotone" dataKey="veterinarians" stroke="#10B981" name="Veterinarians" strokeWidth={2} />
                        <Line type="monotone" dataKey="admins" stroke="#EF4444" name="Admins" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No user growth data available.</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity Summary</CardTitle>
              </CardHeader>
                <CardContent>
                  {userActivitySummary ? (
                    (() => {
                      const activityData: ReportData[] = [
                        { label: 'Daily', value: Number(userActivitySummary.daily_active_users ?? 0) },
                        { label: 'Weekly', value: Number(userActivitySummary.weekly_active_users ?? 0) },
                        { label: 'Monthly', value: Number(userActivitySummary.monthly_active_users ?? 0) },
                      ];
                      const colors = ['#3B82F6', '#10B981', '#8B5CF6'];

                      return (
                        <div style={{ width: '100%', height: 300 }}>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={activityData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="label" />
                              <YAxis />
                              <Tooltip formatter={(value: any) => value} />
                              <Bar dataKey="value">
                                {activityData.map((entry, idx) => (
                                  <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-sm text-gray-500">No activity data available.</div>
                  )}
                </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-700">{appointmentAnalytics?.completed ?? 0}%</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-sky-50 rounded">
                      <div className="text-2xl font-bold text-sky-700">{appointmentAnalytics?.confirmed ?? 0}%</div>
                      <div className="text-sm text-gray-600">Confirmed</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">  
                    <div className="text-center p-3 bg-rose-50 rounded">
                      <div className="text-2xl font-bold text-rose-700">{appointmentAnalytics?.cancelled ?? 0}%</div>
                      <div className="text-sm text-gray-600">Cancelled</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded">
                      <div className="text-2xl font-bold text-amber-700">{appointmentAnalytics?.urgent ?? 0}%</div>
                      <div className="text-sm text-gray-600">Urgent</div>
                    </div>
                  </div>
                   <div className="grid grid-cols-2 gap-4">  
                    <div className="text-center p-3 bg-indigo-50 rounded">
                      <div className="text-2xl font-bold text-indigo-700">{appointmentAnalytics?.scheduled ?? 0}%</div>
                      <div className="text-sm text-gray-600">Scheduled</div>
                    </div>
                    <div className="text-center p-3 bg-violet-50 rounded">
                      <div className="text-2xl font-bold text-violet-700">{appointmentAnalytics?.inProgress ?? 0}%</div>
                      <div className="text-sm text-gray-600">In Progress</div>
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
                  {topClinics?.map((clinic: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{clinic.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{clinic.appointments} appointments</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}