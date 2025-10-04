import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { FormInput } from '../FormInput';
import { Textarea } from '../ui/textarea';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award,
  Users,
  Stethoscope,
  Building,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useAddNewVetUser, useClinicOptions, useDeleteUser, useGetAllVets, useUpdateUserStatus } from '../../lib/react-query/QueriesAndMutations';
import { INewVetUser, IVeterinarian } from '../../lib/types';


export function VeterinarianManagement() {
  const { mutateAsync: addNewVet, isPending: isAddingNewVet, error: AddVetError, isError: isAddVetError } = useAddNewVetUser()
  const { data: allVets, isPending: isGettingVetenarians, refetch } = useGetAllVets()
  const { data: clinics } = useClinicOptions()
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser()
  const { mutateAsync: updateUserStatus, isPending: isUpdatingStatus } = useUpdateUserStatus()

  const [searchTerm, setSearchTerm] = useState('');
  const [clinicFilter, setClinicFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [isAddVetOpen, setIsAddVetOpen] = useState(false);
  const [selectedVet, setSelectedVet] = useState<IVeterinarian | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [newVet, setNewVet] = useState<INewVetUser>({
    name: '',
    email: '',
    phone_number: '',
    license_number: '',
    specialization: '',
    clinic: '',
    years_of_experience: 0,
    education: '',
    bio: '',
    password: '',
    imageUrl: null,
  });

  const specializations = [
    'Small Animal Medicine',
    'Emergency Medicine',
    'Surgery',
    'Internal Medicine',
    'Dermatology',
    'Cardiology',
    'Oncology',
    'Dentistry',
    'Exotic Animals',
    'Radiology'
  ];

  const filteredVets = allVets?.filter(vet => {
    const matchesSearch =
      vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.veterinarian_info.license_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClinic =
      clinicFilter === 'all' || vet.veterinarian_info.clinic === clinicFilter;

    const matchesStatus =
      statusFilter === 'all' || vet.status === statusFilter;

    const matchesSpecialization =
      specializationFilter === 'all' || vet.veterinarian_info?.specialization === specializationFilter;

    return matchesSearch && matchesClinic && matchesStatus && matchesSpecialization;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-3 w-3" />;
      case 'inactive':
        return <XCircle className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'suspended':
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const handleAddVet = async () => {
    try {
      const newVetData = await addNewVet(newVet);
      setIsAddVetOpen(false);

    } catch (error) {
      alert('something went wrong.')
    }
  };

  const handleStatusChange = async (vetId: string, newStatus: IVeterinarian['status']) => {
    try {
      await updateUserStatus({
        userID: vetId,
        status: newStatus
      })
    } catch (error) {
      console.log(error)
      alert("something went wrong")
    }
  };

  const handleViewDetails = (vet: IVeterinarian) => {
    setSelectedVet(vet);
    setIsDetailsOpen(true);
  };

  const handleDeleteVet = async (vetId: string) => {
    await deleteUser({ userID: vetId });
    refetch();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Veterinarian Management</h1>
          <p className="text-gray-600 mt-1">Manage veterinary professionals and their credentials</p>
        </div>

        <Dialog open={isAddVetOpen} onOpenChange={setIsAddVetOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Veterinarian
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Veterinarian</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <FormInput
                id="name"
                name="name"
                label="Full Name"
                value={newVet.name}
                onChange={(e) => setNewVet(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Dr. John Smith"
                required
              />
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                value={newVet.email}
                onChange={(e) => setNewVet(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <FormInput
                id="phone_number"
                name="phone_number"
                label="Phone Number"
                value={newVet.phone_number}
                onChange={(e) => setNewVet(prev => ({ ...prev, phone_number: e.target.value }))}
                placeholder="(555) 123-4567"
              />
              <FormInput
                id="license_number"
                name="license_number"
                label="License Number"
                value={newVet.license_number}
                onChange={(e) => setNewVet(prev => ({ ...prev, license_number: e.target.value }))}
                required
              />

              <div>
                <label className="text-sm font-medium">Specialization</label>
                <Select
                  value={newVet?.specialization}
                  onValueChange={(value) =>
                    setNewVet(prev => ({ ...prev, specialization: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Clinic Assignment</label>
                <Select
                  value={newVet.clinic}
                  onValueChange={(value) =>
                    setNewVet(prev => ({ ...prev, clinic: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select clinic" />
                  </SelectTrigger>
                  <SelectContent>
                    {clinics?.map(clinic => (
                      <SelectItem key={clinic.id} value={clinic.name}>
                        {clinic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <FormInput
                id="years_of_experience"
                name="years_of_experience"
                type="number"
                label="Years of Experience"
                value={newVet.years_of_experience}
                onChange={(e) =>
                  setNewVet(prev => ({ ...prev, years_of_experience: Number(e.target.value) }))
                }
                placeholder="5"
              />

              <FormInput
                id="password"
                name="password"
                type="password"
                label="Password"
                value={newVet.password}
                onChange={(e) => setNewVet(prev => ({ ...prev, password: e.target.value }))}
                required
              />

              <div className="md:col-span-2">
                <FormInput
                  id="education"
                  name="education"
                  label="Education"
                  value={newVet.education}
                  onChange={(e) => setNewVet(prev => ({ ...prev, education: e.target.value }))}
                  placeholder="DVM, University Name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Biography</label>
                <Textarea
                  placeholder="Brief professional biography..."
                  value={newVet.bio}
                  onChange={(e) => setNewVet(prev => ({ ...prev, bio: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2 ">
                <label className="text-sm font-medium mr-3">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setNewVet(prev => ({ ...prev, imageUrl: file }));
                  }}
                  className="mt-1 ml-2 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddVetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddVet}>
                Add Veterinarian
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or license number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={clinicFilter} onValueChange={setClinicFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by clinic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clinics</SelectItem>
                  {clinics?.map(clinic => (
                    <SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Veterinarians List */}
      <Card>
        <CardHeader>
          <CardTitle>Veterinarians ({filteredVets?.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVets?.map((vet) => (
              <div key={vet.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={vet?.veterinarian_info?.image} alt={vet?.veterinarian_info?.imageUrl} />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      <Stethoscope className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{vet.name}</h3>
                      <Badge className={getStatusColor(vet.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(vet.status)}
                          {vet.status}
                        </div>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {vet?.veterinarian_info?.specialization}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {vet?.veterinarian_info?.clinic}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {vet?.patientCount} patients
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {vet?.veterinarian_info?.years_of_experience} years exp.
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span>License: {vet?.veterinarian_info?.license_number}</span>
                      <span>•</span>
                      <span>{vet.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={vet.status}
                    onValueChange={(value: Veterinarian['status']) => handleStatusChange(vet.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(vet)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVet(vet.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

          </div>

          {filteredVets?.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No veterinarians found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Veterinarian Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Veterinarian Details</DialogTitle>
          </DialogHeader>
          {selectedVet && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`${import.meta.env.VITE_STORAGE_URL}/${selectedVet?.veterinarian_info?.imageUrl}`} alt={selectedVet.name} />
                  <AvatarFallback className="bg-green-100 text-green-700">
                    <Stethoscope className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedVet.name}</h3>
                  <p className="text-gray-600">{selectedVet.veterinarian_info?.specialization}</p>

                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>Email: {selectedVet.email}</p>
                    <p>Phone: {selectedVet.veterinarian_info.phone_number}</p>
                    <p>License: {selectedVet.veterinarian_info.license_number}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Professional Details</h4>
                  <div className="space-y-1 text-sm">
                    <p>Experience: {selectedVet.veterinarian_info.years_of_experience} years</p>
                    <p>Appointments: {0}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Education</h4>
                <p className="text-sm text-gray-600">{selectedVet.veterinarian_info.education}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Biography</h4>
                <p className="text-sm text-gray-600">{selectedVet.veterinarian_info.bio}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Clinic Assignment</h4>
                <p className="text-sm text-gray-600">{selectedVet.veterinarian_info.clinic}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}