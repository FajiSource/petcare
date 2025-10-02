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
import { IAppointment, IClinic, INewAppointment } from '../lib/types';
import { useClinicOptions, useCreateNewAppointment, useGetAllPets, useGetOwnerAppointments, usePetOptions, useVetOptions } from '../lib/react-query/QueriesAndMutations';

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

const INITIAL_NEW_APPOINTMENT = {
  pet_id: 0,
  veterinarian_id: 0,
  type: "",
  clinic: "",
  date: "",
  time: "",

  notes: null,
  priority: null,
  duration: null,
  condition: null,
  symptoms: null,
  time_waiting: null,
}
export function Appointments() {
  const { mutateAsync: createAppointment, isPending: isCreatingNewAppointment } = useCreateNewAppointment()
  const { data: appointments, isPending: isGettingAppointments } = useGetOwnerAppointments()
  const { data:clinics } = useClinicOptions()
  const { data: pets, isPending: isGettingPets } = usePetOptions()
  const { data: vets, isPending: isGettingVets } = useVetOptions()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const [newAppointment, setNewAppointment] = useState<INewAppointment>(INITIAL_NEW_APPOINTMENT);

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
  const handleScheduleAppointment = async () => {
    try {
      // if (!newAppointment.pet_id || !newAppointment.type || !newAppointment.date || !newAppointment.time) {
      //   return;
      // }
      await createAppointment(newAppointment)
      setNewAppointment(INITIAL_NEW_APPOINTMENT);
      setIsDialogOpen(false);
      toast.success(`Appointment scheduled - ${new Date(newAppointment.date).toLocaleDateString()}`);
    } catch (error) {
      console.log(error)
    }
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

  const upcomingAppointments: IAppointment[] = appointments
    ? appointments
      ?.filter(
        (apt: IAppointment) =>
          apt.status === "scheduled" &&
          new Date(apt.date) >= new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    : [];

  const pastAppointments: IAppointment[] = appointments
    ? appointments
      ?.filter(
        (apt: IAppointment) =>
          apt.status === "completed" ||
          new Date(apt.date) < new Date()
      )
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : [];


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
              {/* Left Side */}
              <div className="space-y-4">
                {/* Pet */}
                <div>
                  <label className="text-sm font-medium">Select Pet</label>
                  <Select
                    value={String(newAppointment.pet_id)}
                    onValueChange={(value) =>
                      setNewAppointment((prev) => ({ ...prev, pet_id: Number(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {pets?.map((pet) => (
                        <SelectItem key={pet.id} value={String(pet.id)}>
                          {pet.name} ({pet.species})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Appointment Type */}
                <div>
                  <label className="text-sm font-medium">Appointment Type</label>
                  <Select
                    value={newAppointment.type}
                    onValueChange={(value) =>
                      setNewAppointment((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date / Time */}
                <div className="grid grid-cols-2 gap-2">
                  <FormInput
                    id="date"
                    name="date"
                    type="date"
                    label="Date"
                    value={newAppointment.date}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({ ...prev, date: e.target.value }))
                    }
                    required
                  />
                  <FormInput
                    id="time"
                    name="time"
                    type="time"
                    label="Time"
                    value={newAppointment.time}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({ ...prev, time: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              {/* Right Side */}
              <div className="space-y-4">
                {/* Veterinarian */}
                <div>
                  <label className="text-sm font-medium">Veterinarian</label>
                  <Select
                    value={String(newAppointment.veterinarian_id)}
                    onValueChange={(value) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        veterinarian_id: Number(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select veterinarian" />
                    </SelectTrigger>
                    <SelectContent>
                      {vets?.map((vet) => (
                        <SelectItem key={vet.id} value={String(vet.id)}>
                          {vet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clinic */}
                <div>
                  <label className="text-sm font-medium">Clinic</label>
                  <Select
                    value={newAppointment.clinic}
                    onValueChange={(value) =>
                      setNewAppointment((prev) => ({ ...prev, clinic: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select clinic" />
                    </SelectTrigger>
                    <SelectContent>
                      {clinics?.map((clinic:IClinic) => (
                        <SelectItem key={clinic} value={clinic.name}>
                          {clinic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    placeholder="Add any special notes..."
                    value={newAppointment.notes ?? ""}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
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
            Upcoming Appointments ({upcomingAppointments?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No upcoming appointments</p>
              <p className="text-sm">Schedule your pet's next visit</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments?.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={appointment.pet.image}
                        alt={appointment.pet.name}
                      />
                      <AvatarFallback>
                        {appointment.pet.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{appointment.pet.name}</h3>
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
                        with {appointment.veterinarian?.name}
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
                        toast.info(`Editing appointment for ${appointment.pet.name}`);
                        // open edit modal here
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
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
            {pastAppointments?.slice(0, 5).map(appointment => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={appointment.pet?.image}
                      alt={appointment.pet?.name}
                    />
                    <AvatarFallback>
                      {appointment.pet?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {appointment.pet?.name} – {appointment.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.date).toLocaleDateString()} at{" "}
                      {appointment.time} <br />
                      with {appointment.veterinarian?.name} <br />
                      <span className="italic text-gray-500">
                        {appointment.clinic}
                      </span>
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}