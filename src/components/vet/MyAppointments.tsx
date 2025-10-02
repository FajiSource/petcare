import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Calendar as CalendarIcon,
  Clock,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Plus
} from 'lucide-react';
import { useUpdateAppointmentStatus, useGetVetAppointments } from '../../lib/react-query/QueriesAndMutations';
import { IAppointment } from '../../lib/types';

interface Appointment {
  id: string;
  date: string;
  time: string;
  duration: number;
  petName: string;
  petSpecies: string;
  petBreed: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
  chiefComplaint: string;
  petImageUrl?: string;
}

export function MyAppointments() {
  const { data: appointments } = useGetVetAppointments()
  const { mutateAsync: updateStatus } = useUpdateAppointmentStatus()

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'no-show':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredAppointments = appointments?.filter((appointment: IAppointment) => {
    const matchesSearch = appointment.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.pet.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todayAppointments = filteredAppointments?.filter(
    (appointment: IAppointment) => appointment.date === new Date().toISOString().split('T')[0]
  );

  const upcomingAppointments = filteredAppointments?.filter(
    (appointment: IAppointment) => new Date(appointment.date) > new Date()
  );

  const pastAppointments = filteredAppointments?.filter(
    (appointment: IAppointment) => new Date(appointment.date) < new Date()
  );

  const updateAppointmentStatus = async (appointmentId: number, newStatus: Appointment['status']) => {
    try {
      await updateStatus({ id: appointmentId, status: newStatus });
      console.log(`Updating appointment ${appointmentId} to status: ${newStatus}`);
    } catch (error) {
      console.log(error)
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: IAppointment }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="h-16 w-16">
              {appointment.pet.image ? (
                <AvatarImage src={appointment.pet.image} alt={appointment.pet.name} />
              ) : (
                <AvatarFallback className="bg-blue-100">
                  {appointment.pet.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{appointment.pet.name}</h3>
                <Badge className={getPriorityColor(appointment.priority)}>
                  {appointment?.priority?.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {formatDate(appointment.date)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatTime(appointment.time)} ({appointment.duration} min)
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  {appointment.type}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {appointment.pet.user.name}
                </div>
              </div>

              {/* <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-1">Chief Complaint:</p>
                <p className="text-sm text-gray-700">{appointment.chiefComplaint}</p>
              </div> */}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status.replace('-', ' ').toUpperCase()}
            </Badge>

            <div className="flex gap-2">
              {appointment.status === 'scheduled' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateAppointmentStatus(appointment.id, 'in-progress')}
                  >
                    Start
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {appointment.status === 'in-progress' && (
                <Button
                  size="sm"
                  onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                >
                  Complete
                </Button>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Appointment Details - {appointment.pet.name}</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Pet Information</Label>
                        <div className="space-y-2 mt-2">
                          <p className="text-sm"><strong>Name:</strong> {appointment.pet.name}</p>
                          <p className="text-sm"><strong>Species:</strong> {appointment.pet.species}</p>
                          <p className="text-sm"><strong>Breed:</strong> {appointment.pet.breed}</p>
                        </div>
                      </div>

                      <div>
                        <Label>Owner Information</Label>
                        <div className="space-y-2 mt-2">
                          <p className="text-sm"><strong>Name:</strong> {appointment.pet.user.name}</p>
                          <p className="text-sm"><strong>Phone:</strong> {appointment.pet.phone}</p>
                          <p className="text-sm"><strong>Email:</strong> {appointment.pet.user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Appointment Notes</Label>
                      <Textarea
                        className="mt-2"
                        placeholder="Add your clinical notes here..."
                        value={appointmentNotes}
                        onChange={(e) => setAppointmentNotes(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button variant="outline">Save Notes</Button>
                      <Button>Complete Appointment</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
            My Appointments
          </h1>
          <p className="text-gray-600 mt-1">Manage your scheduled appointments and patient visits</p>
        </div>

        {/* <div className="flex gap-2">
          <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar View
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Calendar</DialogTitle>
              </DialogHeader>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </DialogContent>
          </Dialog>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div> */}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by pet name, owner, or appointment type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Tabs */}
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">
            Today ({todayAppointments?.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments?.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastAppointments?.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {todayAppointments?.length > 0 ? (
            todayAppointments?.map((appointment: IAppointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No appointments scheduled for today</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments?.length > 0 ? (
            upcomingAppointments?.map((appointment: IAppointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No upcoming appointments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments?.length > 0 ? (
            pastAppointments?.map((appointment: IAppointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No past appointments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}