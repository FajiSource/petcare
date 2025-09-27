import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { FormInput } from './FormInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone, 
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface Appointment {
  id: string;
  petId: string;
  petName: string;
  type: string;
  date: string;
  time: string;
  veterinarian: string;
  clinic: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export function Appointments() {
  const { pets } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      petId: '1',
      petName: 'Buddy',
      type: 'Annual Checkup',
      date: '2025-08-15',
      time: '10:00',
      veterinarian: 'Dr. Sarah Johnson',
      clinic: 'PetCare Veterinary Clinic',
      status: 'scheduled',
      notes: 'Routine annual health examination'
    },
    {
      id: '2',
      petId: '2',
      petName: 'Whiskers',
      type: 'Vaccination',
      date: '2025-08-18',
      time: '14:30',
      veterinarian: 'Dr. Michael Chen',
      clinic: 'Animal Health Center',
      status: 'scheduled',
      notes: 'Rabies and FVRCP vaccines due'
    },
    {
      id: '3',
      petId: '1',
      petName: 'Buddy',
      type: 'Dental Cleaning',
      date: '2025-08-05',
      time: '09:00',
      veterinarian: 'Dr. Sarah Johnson',
      clinic: 'PetCare Veterinary Clinic',
      status: 'completed'
    }
  ]);

  const [newAppointment, setNewAppointment] = useState({
    petId: '',
    type: '',
    date: '',
    time: '',
    veterinarian: '',
    clinic: '',
    notes: ''
  });

  const appointmentTypes = [
    'Annual Checkup',
    'Vaccination',
    'Dental Cleaning',
    'Surgery',
    'Emergency Visit',
    'Follow-up',
    'Grooming',
    'Behavioral Consultation'
  ];

  const veterinarians = [
    'Dr. Sarah Johnson',
    'Dr. Michael Chen',
    'Dr. Emily Rodriguez',
    'Dr. David Kim',
    'Dr. Lisa Thompson'
  ];

  const clinics = [
    'PetCare Veterinary Clinic',
    'Animal Health Center',
    'City Pet Hospital',
    'Emergency Animal Care'
  ];

  const handleScheduleAppointment = () => {
    if (!newAppointment.petId || !newAppointment.type || !newAppointment.date || !newAppointment.time) {
      return;
    }

    const selectedPet = pets.find(pet => pet.id === newAppointment.petId);
    if (!selectedPet) return;

    const appointment: Appointment = {
      id: Date.now().toString(),
      petId: newAppointment.petId,
      petName: selectedPet.name,
      type: newAppointment.type,
      date: newAppointment.date,
      time: newAppointment.time,
      veterinarian: newAppointment.veterinarian,
      clinic: newAppointment.clinic,
      status: 'scheduled',
      notes: newAppointment.notes
    };

    setAppointments(prev => [...prev, appointment]);
    setNewAppointment({
      petId: '',
      type: '',
      date: '',
      time: '',
      veterinarian: '',
      clinic: '',
      notes: ''
    });
    setIsDialogOpen(false);
    toast.success(`Appointment scheduled for ${selectedPet.name} on ${new Date(newAppointment.date).toLocaleDateString()}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'scheduled' && new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = appointments
    .filter(apt => apt.status === 'completed' || new Date(apt.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your pet's appointments and schedules</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Pet</label>
                  <Select value={newAppointment.petId} onValueChange={(value) => 
                    setNewAppointment(prev => ({ ...prev, petId: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {pets.map(pet => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.name} ({pet.species})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Appointment Type</label>
                  <Select value={newAppointment.type} onValueChange={(value) => 
                    setNewAppointment(prev => ({ ...prev, type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FormInput
                    id="date"
                    name="date"
                    type="date"
                    label="Date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                  <FormInput
                    id="time"
                    name="time"
                    type="time"
                    label="Time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Veterinarian</label>
                  <Select value={newAppointment.veterinarian} onValueChange={(value) => 
                    setNewAppointment(prev => ({ ...prev, veterinarian: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select veterinarian" />
                    </SelectTrigger>
                    <SelectContent>
                      {veterinarians.map(vet => (
                        <SelectItem key={vet} value={vet}>{vet}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Clinic</label>
                  <Select value={newAppointment.clinic} onValueChange={(value) => 
                    setNewAppointment(prev => ({ ...prev, clinic: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select clinic" />
                    </SelectTrigger>
                    <SelectContent>
                      {clinics.map(clinic => (
                        <SelectItem key={clinic} value={clinic}>{clinic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    placeholder="Add any special notes..."
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleAppointment}>
                Schedule Appointment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Upcoming Appointments ({upcomingAppointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No upcoming appointments</p>
              <p className="text-sm">Schedule your pet's next visit</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map(appointment => {
                const pet = pets.find(p => p.id === appointment.petId);
                return (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={pet?.imageUrl} alt={appointment.petName} />
                        <AvatarFallback>{appointment.petName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{appointment.petName}</h3>
                          <Badge variant="outline">{appointment.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {new Date(appointment.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {appointment.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {appointment.clinic}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          with {appointment.veterinarian}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast.info(`Editing appointment for ${appointment.petName}`);
                          // In a real app, this would open edit dialog
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Past Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pastAppointments.slice(0, 5).map(appointment => {
              const pet = pets.find(p => p.id === appointment.petId);
              return (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={pet?.imageUrl} alt={appointment.petName} />
                      <AvatarFallback>{appointment.petName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{appointment.petName} - {appointment.type}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.date).toLocaleDateString()} with {appointment.veterinarian}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}