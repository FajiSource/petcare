import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertCircle, Calendar, Clock, Plus, Search, Shield, Syringe } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Textarea } from './ui/textarea';

interface Vaccination {
  id: string;
  petName: string;
  petId: string;
  vaccineName: string;
  vaccineType: string;
  dateAdministered: string;
  nextDueDate: string;
  veterinarian: string;
  batchNumber: string;
  manufacturer: string;
  notes: string;
  status: 'current' | 'overdue' | 'upcoming';
  sideEffects?: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
}

export function Vaccinations() {
  const { user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVaccination, setNewVaccination] = useState({
    petId: '',
    vaccineName: '',
    vaccineType: '',
    dateAdministered: '',
    nextDueDate: '',
    batchNumber: '',
    manufacturer: '',
    notes: '',
    sideEffects: ''
  });

  // Mock data - in real app, this would come from API
  const pets: Pet[] = [
    { id: '1', name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', age: '3 years' },
    { id: '2', name: 'Whiskers', species: 'Cat', breed: 'Persian', age: '2 years' },
    { id: '3', name: 'Max', species: 'Dog', breed: 'German Shepherd', age: '5 years' },
  ];

  const vaccinations: Vaccination[] = [
    {
      id: '1',
      petName: 'Buddy',
      petId: '1',
      vaccineName: 'DHPP',
      vaccineType: 'Core Vaccine',
      dateAdministered: '2024-06-15',
      nextDueDate: '2025-06-15',
      veterinarian: 'Dr. Smith',
      batchNumber: 'VAC123456',
      manufacturer: 'Merck Animal Health',
      notes: 'Annual booster administered successfully',
      status: 'current'
    },
    {
      id: '2',
      petName: 'Whiskers',
      petId: '2',
      vaccineName: 'FVRCP',
      vaccineType: 'Core Vaccine',
      dateAdministered: '2024-05-20',
      nextDueDate: '2025-05-20',
      veterinarian: 'Dr. Johnson',
      batchNumber: 'VAC789012',
      manufacturer: 'Zoetis',
      notes: 'First annual booster for adult cat',
      status: 'current'
    },
    {
      id: '3',
      petName: 'Max',
      petId: '3',
      vaccineName: 'Rabies',
      vaccineType: 'Core Vaccine',
      dateAdministered: '2023-12-10',
      nextDueDate: '2024-12-10',
      veterinarian: 'Dr. Wilson',
      batchNumber: 'RAB345678',
      manufacturer: 'Boehringer Ingelheim',
      notes: 'Rabies vaccination - 3 year duration',
      status: 'overdue'
    },
    {
      id: '4',
      petName: 'Buddy',
      petId: '1',
      vaccineName: 'Bordetella',
      vaccineType: 'Non-Core Vaccine',
      dateAdministered: '2024-09-01',
      nextDueDate: '2025-03-01',
      veterinarian: 'Dr. Smith',
      batchNumber: 'BOR567890',
      manufacturer: 'Merck Animal Health',
      notes: 'Kennel cough prevention',
      status: 'upcoming'
    }
  ];

  const vaccineTypes = [
    'Core Vaccine',
    'Non-Core Vaccine',
    'Rabies',
    'DHPP',
    'FVRCP',
    'Bordetella',
    'Lyme Disease',
    'Other'
  ];

  const filteredVaccinations = vaccinations.filter(vaccination => {
    const matchesSearch = vaccination.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vaccination.vaccineName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPet = selectedPet === 'all' || vaccination.petId === selectedPet;
    const matchesStatus = statusFilter === 'all' || vaccination.status === statusFilter;
    
    return matchesSearch && matchesPet && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddVaccination = () => {
    // In real app, this would make an API call
    console.log('Adding vaccination:', newVaccination);
    setIsAddDialogOpen(false);
    setNewVaccination({
      petId: '',
      vaccineName: '',
      vaccineType: '',
      dateAdministered: '',
      nextDueDate: '',
      batchNumber: '',
      manufacturer: '',
      notes: '',
      sideEffects: ''
    });
  };

  const upcomingVaccinations = vaccinations.filter(v => v.status === 'upcoming' || v.status === 'overdue');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vaccination Records</h1>
          <p className="text-gray-600 mt-1">Manage and track pet vaccination schedules</p>
        </div>
        {(user?.role === 'veterinarian' || user?.role === 'admin') && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Vaccination
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Vaccination Record</DialogTitle>
                <DialogDescription>
                  Enter the vaccination details for the pet.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pet">Pet</Label>
                  <Select value={newVaccination.petId} onValueChange={(value) => setNewVaccination(prev => ({ ...prev, petId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pet" />
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
                <div className="space-y-2">
                  <Label htmlFor="vaccineName">Vaccine Name</Label>
                  <Input
                    id="vaccineName"
                    value={newVaccination.vaccineName}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, vaccineName: e.target.value }))}
                    placeholder="e.g., DHPP, Rabies"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vaccineType">Vaccine Type</Label>
                  <Select value={newVaccination.vaccineType} onValueChange={(value) => setNewVaccination(prev => ({ ...prev, vaccineType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vaccineTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateAdministered">Date Administered</Label>
                  <Input
                    id="dateAdministered"
                    type="date"
                    value={newVaccination.dateAdministered}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, dateAdministered: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextDueDate">Next Due Date</Label>
                  <Input
                    id="nextDueDate"
                    type="date"
                    value={newVaccination.nextDueDate}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, nextDueDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    value={newVaccination.batchNumber}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, batchNumber: e.target.value }))}
                    placeholder="Vaccine batch number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={newVaccination.manufacturer}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, manufacturer: e.target.value }))}
                    placeholder="Vaccine manufacturer"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newVaccination.notes}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about the vaccination"
                    rows={3}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="sideEffects">Side Effects (if any)</Label>
                  <Textarea
                    id="sideEffects"
                    value={newVaccination.sideEffects}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, sideEffects: e.target.value }))}
                    placeholder="Any observed side effects"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddVaccination} className="bg-blue-600 hover:bg-blue-700">
                  Add Vaccination
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Alerts for upcoming/overdue vaccinations */}
      {upcomingVaccinations.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            You have {upcomingVaccinations.filter(v => v.status === 'overdue').length} overdue and{' '}
            {upcomingVaccinations.filter(v => v.status === 'upcoming').length} upcoming vaccinations.
            <Button variant="link" className="p-0 h-auto text-yellow-800 underline ml-1">
              View details
            </Button>
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
                placeholder="Search vaccinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <Select value={selectedPet} onValueChange={setSelectedPet}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All pets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All pets</SelectItem>
                {pets.map(pet => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vaccination Records */}
      <div className="grid gap-4">
        {filteredVaccinations.map((vaccination) => (
          <Card key={vaccination.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Syringe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{vaccination.vaccineName}</CardTitle>
                    <CardDescription>
                      {vaccination.petName} • {vaccination.vaccineType}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(vaccination.status)}>
                  {vaccination.status === 'current' && <Shield className="w-3 h-3 mr-1" />}
                  {vaccination.status === 'upcoming' && <Clock className="w-3 h-3 mr-1" />}
                  {vaccination.status === 'overdue' && <AlertCircle className="w-3 h-3 mr-1" />}
                  {vaccination.status.charAt(0).toUpperCase() + vaccination.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900 mb-1">Administration Details</p>
                  <p className="text-gray-600">Date: {new Date(vaccination.dateAdministered).toLocaleDateString()}</p>
                  <p className="text-gray-600">Veterinarian: {vaccination.veterinarian}</p>
                  <p className="text-gray-600">Batch: {vaccination.batchNumber}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Next Due</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600">{new Date(vaccination.nextDueDate).toLocaleDateString()}</p>
                  </div>
                  <p className="text-gray-600 mt-1">Manufacturer: {vaccination.manufacturer}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Notes</p>
                  <p className="text-gray-600 text-xs">{vaccination.notes}</p>
                  {vaccination.sideEffects && (
                    <p className="text-red-600 text-xs mt-1">Side effects: {vaccination.sideEffects}</p>
                  )}
                </div>
              </div>
              {(user?.role === 'veterinarian' || user?.role === 'admin') && (
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    Edit Record
                  </Button>
                  <Button variant="outline" size="sm">
                    Schedule Next
                  </Button>
                  <Button variant="outline" size="sm">
                    Print Certificate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVaccinations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Syringe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vaccination records found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedPet !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first vaccination record'}
            </p>
            {(user?.role === 'veterinarian' || user?.role === 'admin') && (
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add First Vaccination
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}