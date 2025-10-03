import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { 
  Calendar, 
  PawPrint, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  Pill,
  Syringe,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';

export function VeterinarianDashboard() {
  const { user, pets, setCurrentView } = useApp();

  // Mock veterinarian statistics
  const vetStats = {
    patientsToday: 8,
    
    pendingRecords: 3,
    totalPatients: 156,
    appointmentsToday: 12,
    completedToday: 7,
    urgentCases: 1
  };

  // Mock today's appointments
  const todayAppointments = [
    {
      id: '1',
      time: '09:00 AM',
      petName: 'Buddy',
      ownerName: 'John Smith',
      type: 'Annual Checkup',
      status: 'confirmed',
      duration: 30,
      notes: 'Routine health examination'
    },
    {
      id: '2',
      time: '10:30 AM',
      petName: 'Max',
      ownerName: 'Sarah Johnson',
      type: 'Vaccination',
      status: 'in-progress',
      duration: 15,
      notes: 'Rabies and DHPP vaccines'
    },
    {
      id: '3',
      time: '11:15 AM',
      petName: 'Luna',
      ownerName: 'Mike Davis',
      type: 'Emergency',
      status: 'urgent',
      duration: 45,
      notes: 'Possible toxin ingestion'
    },
    {
      id: '4',
      time: '02:00 PM',
      petName: 'Whiskers',
      ownerName: 'Emily Chen',
      type: 'Follow-up',
      status: 'confirmed',
      duration: 20,
      notes: 'Post-surgery check'
    }
  ];

  // Mock recent patients
  const recentPatients = [
    {
      id: '1',
      name: 'Buddy',
      species: 'Dog',
      breed: 'Golden Retriever',
      owner: 'John Smith',
      lastVisit: '2025-08-10',
      status: 'healthy',
      imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      name: 'Max',
      species: 'Dog',
      breed: 'German Shepherd',
      owner: 'Sarah Johnson',
      lastVisit: '2025-08-09',
      status: 'treatment',
      imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop'
    },
    {
      id: '3',
      name: 'Luna',
      species: 'Cat',
      breed: 'Siamese',
      owner: 'Mike Davis',
      lastVisit: '2025-08-08',
      status: 'follow-up',
      imageUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=400&fit=crop'
    }
  ];

  // Mock urgent cases
  const urgentCases = [
    {
      id: '1',
      petName: 'Rex',
      ownerName: 'Tom Wilson',
      condition: 'Possible poisoning',
      priority: 'high',
      timeWaiting: '15 minutes',
      symptoms: ['Vomiting', 'Lethargy', 'Loss of appetite']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPatientStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'treatment':
        return 'bg-yellow-100 text-yellow-800';
      case 'follow-up':
        return 'bg-blue-100 text-blue-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-green-600" />
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.specialization} • License: {user?.licenseNumber}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentView('my-appointments')}>
            <Calendar className="h-4 w-4 mr-2" />
            My Schedule
          </Button>
          <Button onClick={() => setCurrentView('my-patients')}>
            <PawPrint className="h-4 w-4 mr-2" />
            My Patients
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Today</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vetStats.patientsToday}</div>
            <p className="text-xs text-muted-foreground">
              Out of {vetStats.appointmentsToday} appointments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{vetStats.completedToday}</div>
            <p className="text-xs text-muted-foreground">
              {vetStats.appointmentsToday - vetStats.completedToday} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{vetStats.urgentCases}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vetStats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Under your care
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Cases Alert */}
      {urgentCases.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Urgent Cases Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {urgentCases.map((case_) => (
              <div key={case_.id} className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
                <div>
                  <h4 className="font-medium text-red-900">{case_.petName} - {case_.ownerName}</h4>
                  <p className="text-sm text-red-700">{case_.condition}</p>
                  <p className="text-xs text-red-600 mt-1">
                    Symptoms: {case_.symptoms.join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className="bg-red-100 text-red-800 mb-2">
                    {case_.priority.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-red-600">Waiting: {case_.timeWaiting}</p>
                  <Button 
                    size="sm" 
                    className="mt-2 bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      toast.success(`Attending to ${case_.petName} - ${case_.condition}`);
                      // In a real app, this would mark case as attended and navigate to patient
                    }}
                  >
                    Attend Now
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Schedule
              </span>
              <Button variant="outline" size="sm" onClick={() => setCurrentView('my-appointments')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-sm font-medium">{appointment.time}</div>
                      <div className="text-xs text-gray-500">{appointment.duration}min</div>
                    </div>
                    <div>
                      <p className="font-medium">{appointment.petName}</p>
                      <p className="text-sm text-gray-600">{appointment.ownerName}</p>
                      <p className="text-xs text-gray-500">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status.replace('-', ' ')}
                    </Badge>
                    {appointment.status === 'in-progress' && (
                      <Button 
                        size="sm" 
                        className="mt-1 ml-2"
                        onClick={() => {
                          toast.info(`Continuing appointment with ${appointment.petName}`);
                          setCurrentView('health-records');
                        }}
                      >
                        Continue
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <PawPrint className="h-5 w-5" />
                Recent Patients
              </span>
              <Button variant="outline" size="sm" onClick={() => setCurrentView('my-patients')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={patient.imageUrl} alt={patient.name} />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.breed} • {patient.owner}</p>
                      <p className="text-xs text-gray-500">
                        Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getPatientStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                    <div className="mt-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast.info(`Opening medical records for ${patient.name}`);
                          setCurrentView('health-records');
                        }}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Records
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => setCurrentView('health-records')}
            >
              <FileText className="h-6 w-6" />
              <span>Update Records</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => setCurrentView('prescriptions')}
            >
              <Pill className="h-6 w-6" />
              <span>Prescriptions</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => setCurrentView('my-appointments')}
            >
              <Calendar className="h-6 w-6" />
              <span>Schedule</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => setCurrentView('vet-reports')}
            >
              <Activity className="h-6 w-6" />
              <span>My Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}