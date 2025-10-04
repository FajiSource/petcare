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
import { useGetVetRecents, useGetVetTodaySchedules, useGetVetTotals, useGetVetUrgents, useUpdateAppointmentStatus } from '../lib/react-query/QueriesAndMutations';
import { IAppointment } from '../lib/types';

export function VeterinarianDashboard() {
  const { user, pets, setCurrentView } = useApp();
  const { data:vetStats , refetch:loadVetTotals} = useGetVetTotals()
  const { data:todayAppointments, refetch:loadTodayAppointments  } = useGetVetTodaySchedules()
  const { data:urgentCases , refetch:loadUrgentCases } = useGetVetUrgents()
  const { data:recentPatients , refetch:laodRecentPatients } = useGetVetRecents()
  const { mutateAsync:attendNow} = useUpdateAppointmentStatus()
 
 
  const handleAttentNow = async (selectedCase:IAppointment) => {
    try {
        await attendNow({
          id: selectedCase.id  as number,
          status: 'confirmed'
        })
        toast.success(`Attending to ${selectedCase.pet?.name ?? `pet #${selectedCase.pet_id}`}`);
        loadTodayAppointments()
        loadUrgentCases()
        loadVetTotals()
    } catch (error) {
      toast.success(`something went wrong.`);
    }
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
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
            {urgentCases.map((case_) => {
              // symptoms may come as a JSON string or an array
              let symptomsList: string[] = [];
              try {
                if (typeof case_.symptoms === 'string') {
                  const parsed = JSON.parse(case_.symptoms);
                  if (Array.isArray(parsed)) symptomsList = parsed;
                } else if (Array.isArray(case_.symptoms)) {
                  symptomsList = case_.symptoms;
                }
              } catch (e) {
                // fallback: treat as raw string
                symptomsList = [String(case_.symptoms)];
              }

              return (
                <div key={case_.id} className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
                  <div>
                    <h4 className="font-medium text-red-900">{case_.pet?.name ?? `Pet #${case_.pet_id}` } - {case_.pet?.species ?? 'Unknown'}</h4>
                    <p className="text-sm text-red-700">{case_.condition ?? case_.type}</p>
                    <p className="text-xs text-red-600 mt-1">
                      Symptoms: {symptomsList.length > 0 ? symptomsList.join(', ') : 'None reported'}
                    </p>
                    {case_.clinic && (
                      <p className="text-xs text-red-600 mt-1">Clinic: {case_.clinic}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-100 text-red-800 mb-2">
                      {String(case_.priority ?? '').toUpperCase() || 'N/A'}
                    </Badge>
                    <p className="text-xs text-red-600">Waiting: {case_.time_waiting ?? '—'}</p>
                    {case_.notes && (
                      <p className="text-xs text-red-600 mt-1">Notes: {case_.notes}</p>
                    )}
                    {case_.veterinarian_id && (
                      <p className="text-xs text-red-600 mt-1">Vet ID: {case_.veterinarian_id}</p>
                    )}
                    <Button 
                      size="sm" 
                      className="mt-2 bg-red-600 hover:bg-red-700"
                      onClick={() => handleAttentNow(case_)}
                    >
                      Attend Now
                    </Button>
                  </div>
                </div>
              );
            })}
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
            <div className="mt-1 text-sm text-gray-600">Clinic: Animal Health Center</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(todayAppointments || []).map((appointment: any) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-sm font-medium">{appointment.time || '—'}</div>
                      <div className="text-xs text-gray-500">{appointment.duration ? `${appointment.duration} min` : '—'}</div>
                    </div>
                    <div>
                      <p className="font-medium">{appointment.pet?.name ?? `Pet #${appointment.pet_id ?? '—'}`}</p>
                      <p className="text-sm text-gray-600">{appointment.pet?.species ?? 'Unknown species'}</p>
                      <p className="text-xs text-gray-500">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {(appointment.status || '').toString().replace('-', ' ')}
                      </Badge>
                      {appointment.priority && (
                        <Badge className={
                          appointment.priority === 'high' ? 'bg-red-100 text-red-800' :
                          appointment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {appointment.priority.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    {appointment.notes && (
                      <p className="text-xs text-gray-500 mt-1">Notes: {appointment.notes}</p>
                    )}
                    {appointment.veterinarian_id && (
                      <p className="text-xs text-gray-500 mt-1">Vet ID: {appointment.veterinarian_id}</p>
                    )}
                    {appointment.status === 'in-progress' && (
                      <Button 
                        size="sm" 
                        className="mt-1 ml-2"
                        onClick={() => {
                          toast.info(`Continuing appointment with ${appointment.pet?.name ?? 'patient'}`);
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
              {(recentPatients || []).map((patient: any) => {
                // calculate age from date_of_birth
                let ageLabel = 'Unknown';
                if (patient?.date_of_birth) {
                  const dob = new Date(patient.date_of_birth);
                  const now = new Date();
                  let years = now.getFullYear() - dob.getFullYear();
                  const m = now.getMonth() - dob.getMonth();
                  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) years--;
                  if (years > 0) ageLabel = `${years} yr${years > 1 ? 's' : ''}`;
                  else {
                    const days = Math.floor((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
                    ageLabel = `${days} day${days !== 1 ? 's' : ''}`;
                  }
                }

                return (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={patient.imageUrl ?? undefined} alt={patient.name} />
                        <AvatarFallback>{(patient.name || 'U').charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-gray-600">{patient.breed ?? '—'} • {patient.species ?? '—'}</p>
                        <p className="text-xs text-gray-500">Age: {ageLabel} • Weight: {patient.weight ?? '—'} kg</p>
                        <p className="text-xs text-gray-500">Owner: {patient.owner_name ?? patient.owner_email ?? '—'}</p>
                        <p className="text-xs text-gray-500">Phone: {patient.owner_phone ?? '—'}</p>
                        <p className="text-xs text-gray-500">Microchip: {patient.microchip_id ?? '—'}</p>
                        <p className="text-xs text-gray-500">Registered: {patient.registrationDate ? new Date(patient.registrationDate).toLocaleString() : '—'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getPatientStatusColor(patient.status)}>
                        {patient.status ?? '—'}
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
                );
              })}
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
            {/* <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => setCurrentView('vet-reports')}
            >
              <Activity className="h-6 w-6" />
              <span>My Reports</span>
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}