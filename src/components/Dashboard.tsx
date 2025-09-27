import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { 
  Calendar, 
  FileText, 
  Syringe, 
  Pill, 
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus
} from 'lucide-react';

export function Dashboard() {
  const { user, pets, setCurrentView } = useApp();

  const upcomingAppointments = [
    {
      id: '1',
      petName: 'Buddy',
      type: 'Annual Checkup',
      date: '2025-08-15',
      time: '10:00 AM',
      veterinarian: 'Dr. Sarah Johnson'
    },
    {
      id: '2',
      petName: 'Whiskers',
      type: 'Vaccination',
      date: '2025-08-18',
      time: '2:30 PM',
      veterinarian: 'Dr. Michael Chen'
    }
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'vaccination',
      description: 'Buddy received Rabies vaccination',
      date: '2025-08-10',
      status: 'completed'
    },
    {
      id: '2',
      type: 'prescription',
      description: 'Whiskers prescribed antibiotics',
      date: '2025-08-08',
      status: 'active'
    },
    {
      id: '3',
      type: 'appointment',
      description: 'Buddy had dental cleaning',
      date: '2025-08-05',
      status: 'completed'
    }
  ];

  const healthAlerts = [
    {
      id: '1',
      petName: 'Whiskers',
      message: 'Annual vaccination due in 2 weeks',
      severity: 'warning',
      type: 'vaccination'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your pets today
          </p>
        </div>
        <Button onClick={() => setCurrentView('appointments')} className="sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pets.length}</div>
            <p className="text-xs text-muted-foreground">
              Active profiles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records Updated</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Pets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Your Pets
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentView('pet-history')}
              >
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pets.map((pet) => (
              <div key={pet.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={pet.imageUrl} alt={pet.name} />
                    <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{pet.name}</p>
                    <p className="text-sm text-gray-600">{pet.breed} • {pet.age} years old</p>
                  </div>
                </div>
                <Badge variant="secondary">{pet.species}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Upcoming Appointments
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentView('appointments')}
              >
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.petName} - {appointment.type}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Health Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {healthAlerts.length > 0 ? (
              healthAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div>
                    <p className="font-medium text-amber-800">{alert.petName}</p>
                    <p className="text-sm text-amber-700">{alert.message}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setCurrentView('appointments');
                      toast.success(`Scheduling appointment for ${alert.petName}`);
                    }}
                  >
                    Schedule
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>No health alerts</p>
                <p className="text-sm">All your pets are up to date!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => {
              const getIcon = () => {
                switch (activity.type) {
                  case 'vaccination':
                    return <Syringe className="h-4 w-4" />;
                  case 'prescription':
                    return <Pill className="h-4 w-4" />;
                  case 'appointment':
                    return <Calendar className="h-4 w-4" />;
                  default:
                    return <FileText className="h-4 w-4" />;
                }
              };

              return (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    {getIcon()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant={activity.status === 'completed' ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}