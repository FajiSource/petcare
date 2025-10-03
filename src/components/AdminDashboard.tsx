import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { cn } from './ui/utils';
import {
  Users,
  Building,
  PawPrint,
  Calendar,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  Activity,
  BarChart3,
  Plus,
  Eye,
} from 'lucide-react';
import { useAdminDashboardTotals, useGetRecentUserRegistrations } from '../lib/react-query/QueriesAndMutations';
import { IRecentUser } from '../lib/types';

export function AdminDashboard() {
  const { user, pets, veterinarians, clinics, setCurrentView } = useApp();
  const { data: totals, isPending: isGettingTotals } = useAdminDashboardTotals()
  const { data: recentUsers } = useGetRecentUserRegistrations()

  const recentActivities = [
    {
      id: '1',
      type: 'user_registration',
      description: 'New user registered: Sarah Chen',
      timestamp: '2 minutes ago',
      severity: 'info'
    },
    {
      id: '2',
      type: 'appointment_scheduled',
      description: 'Appointment scheduled by John Smith for Buddy',
      timestamp: '15 minutes ago',
      severity: 'success'
    },
    {
      id: '3',
      type: 'system_alert',
      description: 'Server response time increased to 245ms',
      timestamp: '1 hour ago',
      severity: 'warning'
    },
    {
      id: '4',
      type: 'vet_registered',
      description: 'New veterinarian registered: Dr. Michael Torres',
      timestamp: '2 hours ago',
      severity: 'info'
    }
  ];

  // Mock system alerts
  const systemAlerts = [
    {
      id: '1',
      title: 'High Server Load',
      description: 'Server CPU usage is at 85%. Consider scaling resources.',
      severity: 'warning',
      timestamp: '30 minutes ago'
    },
    {
      id: '2',
      title: 'Backup Completed',
      description: 'Daily database backup completed successfully.',
      severity: 'success',
      timestamp: '2 hours ago'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <Users className="h-4 w-4" />;
      case 'appointment_scheduled':
        return <Calendar className="h-4 w-4" />;
      case 'system_alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'vet_registered':
        return <UserCheck className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-amber-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            System overview and management portal
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentView('system-reports')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button onClick={() => setCurrentView('system-settings')}>
            <Plus className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* System Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals?.users}</div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals?.pets}</div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veterinarians</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals?.vets}</div>

          </CardContent>
        </Card>
      </div>



      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total This Month</span>
                    <span className="font-medium">{totals?.totalAppointments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active</span>
                    <span className="font-medium text-blue-600">{totals?.activeAppointments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed</span>
                    <span className="font-medium text-green-600">{totals?.completedAppointments}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Veterinarians</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {veterinarians.slice(0, 3).map((vet, index) => (
                    <div key={vet.id} className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-xs font-medium">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{vet.name}</p>
                        <p className="text-xs text-gray-500">{vet.specialization}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {Math.floor(Math.random() * 50) + 20} patients
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers?.map((user: IRecentUser) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{user.role}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Appointment management interface</p>
                <p className="text-sm">View and manage all system appointments</p>
                <Button
                  className="mt-4"
                  onClick={() => setCurrentView('all-appointments')}
                >
                  View All Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              System Activity
              <Button variant="outline" size="sm">
                <Eye className="h-3 w-3 mr-1" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", getSeverityColor(activity.severity))}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setCurrentView('manage-users')}
            >
              <Users className="h-4 w-4" />
              Manage Users
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setCurrentView('manage-vets')}
            >
              <UserCheck className="h-4 w-4" />
              Manage Veterinarians
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setCurrentView('manage-clinics')}
            >
              <Building className="h-4 w-4" />
              Manage Clinics
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setCurrentView('all-appointments')}
            >
              <Calendar className="h-4 w-4" />
              View All Appointments
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setCurrentView('system-reports')}
            >
              <BarChart3 className="h-4 w-4" />
              Generate Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}