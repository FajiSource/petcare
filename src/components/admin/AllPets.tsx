import React, { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  FileText,
  User,
  PawPrint,
  Heart,
  Stethoscope,
  AlertCircle,
  Download,
  Mail
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAddNewPet, useGetAllPets, useGetOwners } from '../../lib/react-query/QueriesAndMutations';
import { INewPet, IUser } from '../../lib/types';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  birthdate: string;
  microchipId?: string;
  user_id: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  imageUrl: string;
  registrationDate: string;
  lastVisit?: string;
  nextAppointment?: string;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  vaccinationStatus: 'current' | 'due' | 'overdue';
  isActive: boolean;
  emergency_contact: string;
  allergies?: string;
  medical_condition?: string;
  notes?: string;
}

export function AllPets() {
  const { user } = useApp();

  // queries
  const { data: owners, isPending: isGettingOwners } = useGetOwners();
  const { data: pets, isPending: isGettingPets } = useGetAllPets();
  const { mutateAsync: addNewPet, isPending: isAddingNewPet } = useAddNewPet();
  useEffect(() => {
    console.log("pets: ", pets)
  }, [pets])
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [healthFilter, setHealthFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newPet, setNewPet] = useState<INewPet>({
    name: '',
    species: '',
    breed: '',
    age: '',
    weight: '',
    birthdate: '',
    user_id: '',
    phone: '',
    emergency_contact: '',
    allergies: '',
    medical_condition: '',
    notes: '',
    image: null
  });

  const filteredPets = (pets ?? []).filter(pet => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.user?.some(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesSpecies =
      speciesFilter === 'all' ||
      pet.species.toLowerCase() === speciesFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      pet.user?.some(u => u.status === statusFilter);

    const matchesHealth =
      healthFilter === 'all' ||
      pet.medical_condition.toLowerCase() === healthFilter.toLowerCase();

    return matchesSearch && matchesSpecies && matchesStatus && matchesHealth;
  });

  const sortedPets = filteredPets.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'owner':
        return (a.user?.[0]?.name || '').localeCompare(b.user?.[0]?.name || '');
      case 'created':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'updated':
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      default:
        return 0;
    }
  });



  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVaccinationStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800 border-green-200';
      case 'due': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddPet = async () => {
    console.log('Adding pet:', newPet);
    try {
      await addNewPet(newPet)
      setIsAddDialogOpen(false);
      setNewPet({
        name: '',
        species: '',
        breed: '',
        age: '',
        weight: '',
        birthdate: '',
        user_id: '',
        phone: '',
        emergency_contact: '',
        allergies: '',
        medical_condition: '',
        notes: '',
        image: null
      });
    } catch (error) {
      console.log(error)
      alert('something went wrong.')
    }

  };

  const handleViewPet = (pet: Pet) => {
    setSelectedPet(pet);
    setIsViewDialogOpen(true);
  };

  const totalPets = pets?.length ?? 0;
  const activePets = pets?.filter(p => p.isActive).length ?? 0;
  const criticalHealthPets = pets?.filter(p =>
    p.healthStatus === 'critical' || p.healthStatus === 'poor'
  ).length ?? 0;
  const overdueVaccinations = pets?.filter(p =>
    p.vaccinationStatus === 'overdue'
  ).length ?? 0;


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Pets Management</h1>
          <p className="text-gray-600 mt-1">System-wide pet management and oversight</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Pet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Pet to System</DialogTitle>
                <DialogDescription>
                  Register a new pet in the system with owner information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="md:col-span-2 ">
                  <Label className="text-sm font-medium mr-3">Pet Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setNewPet(prev => ({ ...prev, image: file }));
                    }}
                    className="mt-1 ml-2 cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="petName">Pet Name</Label>
                  <Input
                    id="petName"
                    value={newPet.name}
                    onChange={(e) => setNewPet(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Pet's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="species">Species</Label>
                  <Select value={newPet.species} onValueChange={(value) => setNewPet(prev => ({ ...prev, species: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dog">Dog</SelectItem>
                      <SelectItem value="Cat">Cat</SelectItem>
                      <SelectItem value="Bird">Bird</SelectItem>
                      <SelectItem value="Rabbit">Rabbit</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    value={newPet.breed}
                    onChange={(e) => setNewPet(prev => ({ ...prev, breed: e.target.value }))}
                    placeholder="Pet's breed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={newPet.age}
                    onChange={(e) => setNewPet(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="e.g., 3 years"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={newPet.weight}
                    onChange={(e) => setNewPet(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="e.g., 65 lbs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Birth Date</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    value={newPet.birthdate}
                    onChange={(e) => setNewPet(prev => ({ ...prev, birthdate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_id">Owner</Label>
                  <Select value={newPet.user_id} onValueChange={(value) => setNewPet(prev => ({ ...prev, user_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        owners?.map((owner: IUser) => (
                          <SelectItem key={owner.id} value={owner.id}>{owner.name}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Owner Phone</Label>
                  <Input
                    id="phone"
                    value={newPet.phone}
                    onChange={(e) => setNewPet(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Emergency Contact</Label>
                  <Input
                    id="emergency_contact"
                    value={newPet.emergency_contact}
                    onChange={(e) => setNewPet(prev => ({ ...prev, emergency_contact: e.target.value }))}
                    placeholder="(555) 987-6543"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input
                    id="allergies"
                    value={newPet.allergies}
                    onChange={(e) => setNewPet(prev => ({ ...prev, allergies: e.target.value }))}
                    placeholder="Known allergies"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="medical_condition">Medical Conditions</Label>
                  <Textarea
                    id="medical_condition"
                    value={newPet.medical_condition}
                    onChange={(e) => setNewPet(prev => ({ ...prev, medical_condition: e.target.value }))}
                    placeholder="Existing medical conditions"
                    rows={3}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newPet.notes}
                    onChange={(e) => setNewPet(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about the pet"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPet} className="bg-blue-600 hover:bg-blue-700">
                  Add Pet
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pets</p>
                <p className="text-2xl font-bold text-blue-600">{totalPets}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Pets</p>
                <p className="text-2xl font-bold text-green-600">{activePets}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Health Concerns</p>
                <p className="text-2xl font-bold text-orange-600">{criticalHealthPets}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue Vaccines</p>
                <p className="text-2xl font-bold text-red-600">{overdueVaccinations}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(criticalHealthPets > 0 || overdueVaccinations > 0) && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            System alerts: {criticalHealthPets} pets need health attention, {overdueVaccinations} pets have overdue vaccinations.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search pets, owners, breeds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Species</SelectItem>
                <SelectItem value="dog">Dogs</SelectItem>
                <SelectItem value="cat">Cats</SelectItem>
                <SelectItem value="bird">Birds</SelectItem>
                <SelectItem value="rabbit">Rabbits</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={healthFilter} onValueChange={setHealthFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Health" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Health</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="lastVisit">Last Visit</SelectItem>
                <SelectItem value="nextAppointment">Next Appt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pet List */}
      <div className="grid gap-4">
        {sortedPets?.map((pet) => (
          <Card key={pet.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <ImageWithFallback
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{pet.name}</h3>
                      <p className="text-sm text-gray-600">
                        {pet.species} • {pet.breed} • {pet.age}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getHealthStatusColor(pet.medical_condition)}>
                        {pet.medical_condition || "Healthy"}
                      </Badge>
                      <Badge
                        variant={
                          pet.user?.[0]?.status === "active" ? "default" : "outline"
                        }
                      >
                        {pet.user?.[0]?.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Owner</p>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{pet.user?.[0]?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 text-xs">
                          {pet.user?.[0]?.email}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Physical Info</p>
                      <p className="text-gray-600">Weight: {pet.weight}</p>
                      <p className="text-gray-600">
                        Born: {new Date(pet.birthdate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Medical History</p>
                      <p className="text-gray-600">Notes: {pet.notes || "None"}</p>
                      <p className="text-gray-600">
                        Emergency: {pet.emergency_contact || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Registration</p>
                      <p className="text-gray-600">
                        Created: {new Date(pet.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 text-xs">
                        Updated: {new Date(pet.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPet(pet)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      Schedule
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      Records
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

      </div>

      {sortedPets?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <PawPrint className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pets found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || speciesFilter !== 'all' || statusFilter !== 'all' || healthFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'No pets registered in the system'}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add First Pet
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pet Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPet && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <PawPrint className="w-5 h-5" />
                  {selectedPet.name} - Detailed Information
                </DialogTitle>
                <DialogDescription>
                  Complete profile and medical information for {selectedPet.name}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="medical">Medical</TabsTrigger>
                  <TabsTrigger value="owner">Owner Info</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={selectedPet.image} 
                        alt={selectedPet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{selectedPet.name}</h3>
                      <p className="text-gray-600">
                        {selectedPet.species} • {selectedPet.breed}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Age</Label>
                      <p className="text-sm text-gray-600">{selectedPet.age} years</p>
                    </div>
                    <div>
                      <Label>Weight</Label>
                      <p className="text-sm text-gray-600">{selectedPet.weight} kg</p>
                    </div>
                    <div>
                      <Label>Birth Date</Label>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedPet.birthdate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Medical Tab */}
                <TabsContent value="medical" className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label>Allergies</Label>
                      <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                        {selectedPet.allergies || 'None known'}
                      </p>
                    </div>
                    <div>
                      <Label>Medical Conditions</Label>
                      <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                        {selectedPet.medical_condition || 'None known'}
                      </p>
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                        {selectedPet.notes || 'No notes available'}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Owner Tab */}
                <TabsContent value="owner" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Owner Name</Label>
                      <p className="text-sm text-gray-600">{selectedPet.user?.name}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-gray-600">{selectedPet.user?.email}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="text-sm text-gray-600">{selectedPet.phone}</p>
                    </div>
                    <div>
                      <Label>Emergency Contact</Label>
                      <p className="text-sm text-gray-600">{selectedPet.emergency_contact}</p>
                    </div>
                  </div>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Registration Date:</span>
                      <span className="text-gray-600">
                        {new Date(selectedPet.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Last Update:</span>
                      <span className="text-gray-600">
                        {new Date(selectedPet.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}