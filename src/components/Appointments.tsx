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
import { useCancelAppointment, useClinicOptions, useCreateNewAppointment, useGetAllPets, useGetOwnerAppointments, usePetOptions, useUpdateAppointment, useVetOptions } from '../lib/react-query/QueriesAndMutations';

export const INITIAL_NEW_APPOINTMENT: INewAppointment = {
  veterinarianId: 0,

  petName: "",
  species: "",
  breed: null,

  type: "",
  clinic: "",
  date: "",
  time: "",

  notes: null,
  priority: "medium",
  duration: null,
  condition: null,
  symptoms: [],
  timeWaiting: null,

  ownerPhone: "",
  ownerAddress: "",
};
export function Appointments() {
  const { mutateAsync: createAppointment, isPending: isCreatingNewAppointment } = useCreateNewAppointment()
  const { data: appointments, isPending: isGettingAppointments, refetch: refreshAppointments } = useGetOwnerAppointments()
  const { data: clinics } = useClinicOptions()
  const { data: pets, isPending: isGettingPets } = usePetOptions()
  const { data: vets, isPending: isGettingVets } = useVetOptions()
  const { mutate: updateAppointment } = useUpdateAppointment();
  const { mutate: cancelAppointment } = useCancelAppointment();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any | null>(null);


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
      if(error?.response?.data?.message){
        toast.error(error?.response?.data?.message)
      }
    }
  };


  const handleUpdateAppointment = (appointment: any) => {
    updateAppointment(
      { id: appointment.id, data: appointment },
      {
        onSuccess: () => {
          toast.success("Appointment updated successfully!");
          setEditingAppointment(null);
        },
        onError: () => {
          toast.error("Failed to update appointment");
        },
      }
    );
  };

  const handleCancelAppointment = (id: number | string) => {
    cancelAppointment(id, {
      onSuccess: () => {
        toast.success("Appointment cancelled");
      },
      onError: () => {
        toast.error("Failed to cancel appointment");
      },
    });
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
        <Dialog open={!!editingAppointment} onOpenChange={() => setEditingAppointment(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit / Reschedule Appointment</DialogTitle>
            </DialogHeader>

            {editingAppointment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                {/* Example: update date and time only, but you can reuse full form */}
                <FormInput
                  id="editDate"
                  name="editDate"
                  type="date"
                  label="Date"
                  value={editingAppointment.date}
                  onChange={(e) =>
                    setEditingAppointment((prev: any) => ({ ...prev, date: e.target.value }))
                  }
                />
                <FormInput
                  id="editTime"
                  name="editTime"
                  type="time"
                  label="Time"
                  value={editingAppointment.time}
                  onChange={(e) =>
                    setEditingAppointment((prev: any) => ({ ...prev, time: e.target.value }))
                  }
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingAppointment(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleUpdateAppointment(editingAppointment)}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {/* Left Side - Pet Info */}
              <div className="space-y-4">
                <FormInput
                  id="petName"
                  name="petName"
                  type="text"
                  label="Pet Name"
                  value={newAppointment.petName}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, petName: e.target.value }))
                  }
                  required
                />

                <FormInput
                  id="species"
                  name="species"
                  type="text"
                  label="Species"
                  value={newAppointment.species}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, species: e.target.value }))
                  }
                  required
                />

                <FormInput
                  id="breed"
                  name="breed"
                  type="text"
                  label="Breed"
                  value={newAppointment.breed ?? ""}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, breed: e.target.value }))
                  }
                />

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

              {/* Right Side - Owner & Clinic Info */}
              <div className="space-y-4">
                {/* Veterinarian */}
                <div>
                  <label className="text-sm font-medium">Veterinarian</label>
                  <Select
                    value={String(newAppointment.veterinarianId ?? "")}
                    onValueChange={(value) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        veterinarianId: Number(value),
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
                      {clinics?.map((clinic: IClinic) => (
                        <SelectItem key={clinic.id} value={clinic.name}>
                          {clinic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>


                <FormInput
                  id="ownerPhone"
                  name="ownerPhone"
                  type="text"
                  label="Owner Phone"
                  value={newAppointment.ownerPhone ?? ""}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, ownerPhone: e.target.value }))
                  }
                />

                <FormInput
                  id="ownerAddress"
                  name="ownerAddress"
                  type="text"
                  label="Owner Address"
                  value={newAppointment.ownerAddress ?? ""}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, ownerAddress: e.target.value }))
                  }
                />

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
                      onClick={() => setEditingAppointment(appointment)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel
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