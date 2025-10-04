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
import { getOwnerVaccinations } from '../services/vaccination-service';
import { useGetOwnerVaccinations, usePetOptions } from '../lib/react-query/QueriesAndMutations';
import { IVaccination } from '../lib/types';


export function Vaccinations() {
  const { user } = useApp();
  const { data: pets } = usePetOptions()
  const { data: vaccinations } = useGetOwnerVaccinations()

  const vaccinationsData = vaccinations as unknown as IVaccination[] | undefined;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  interface NewVaccinationForm {
    patient_id?: string;
    vaccine_name?: string;
    vaccine_type?: string;
    administered_date?: string;
    next_due_date?: string;
    batch_number?: string;
    manufacturer?: string;
    notes?: string;
    reactions?: string;
  }

  const [newVaccination, setNewVaccination] = useState<NewVaccinationForm>({
    patient_id: '',
    vaccine_name: '',
    vaccine_type: '',
    administered_date: '',
    next_due_date: '',
    batch_number: '',
    manufacturer: '',
    notes: '',
    reactions: ''
  });

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

  const filteredVaccinations = vaccinationsData?.filter((vaccination: IVaccination) => {
    const matchesSearch = (vaccination.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vaccination.vaccine_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPet = selectedPet === 'all' || String(vaccination.patient_id) === selectedPet;
    // Map UI status filter (current/upcoming/overdue) to API status values
    const matchesStatus = statusFilter === 'all'
      || (statusFilter === 'current' && vaccination.status === 'completed')
      || (statusFilter === 'upcoming' && vaccination.status === 'due-soon')
      || (statusFilter === 'overdue' && vaccination.status === 'overdue');

    return matchesSearch && matchesPet && matchesStatus;
  }) ?? [];

  // Map backend status values to UI colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'due-soon': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddVaccination = () => {
    // In real app, this would make an API call
    console.log('Adding vaccination:', newVaccination);
    setIsAddDialogOpen(false);
    setNewVaccination({
      patient_id: '',
      vaccine_name: '',
      vaccine_type: '',
      administered_date: '',
      next_due_date: '',
      batch_number: '',
      manufacturer: '',
      notes: '',
      reactions: ''
    });
  };

  const upcomingVaccinations = vaccinationsData?.filter((v: IVaccination) => v.status === 'due-soon' || v.status === 'overdue') || [];

  const displayStatusLabel = (status: string) => {
    if (!status) return '';
    return status.replace('-', ' ').replace(/(^|\s)\w/g, c => c.toUpperCase());
  };

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
                  <Select value={newVaccination.patient_id} onValueChange={(value: string) => setNewVaccination(prev => ({ ...prev, patient_id: value }))}>
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
                    value={newVaccination.vaccine_name}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, vaccine_name: e.target.value }))}
                    placeholder="e.g., DHPP, Rabies"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vaccineType">Vaccine Type</Label>
                  <Select value={newVaccination.vaccine_type} onValueChange={(value: string) => setNewVaccination(prev => ({ ...prev, vaccine_type: value }))}>
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
                    value={newVaccination.administered_date}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, administered_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextDueDate">Next Due Date</Label>
                  <Input
                    id="nextDueDate"
                    type="date"
                    value={newVaccination.next_due_date}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, next_due_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    value={newVaccination.batch_number}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, batch_number: e.target.value }))}
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
                    value={newVaccination.reactions}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, reactions: e.target.value }))}
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
            {upcomingVaccinations.filter(v => v.status === 'due-soon').length} upcoming vaccinations.
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="due-soon">Due soon</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vaccination Records */}
      <div className="grid gap-4">
        {filteredVaccinations.map((vaccination: IVaccination) => (
          <Card key={vaccination.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Syringe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{vaccination.vaccine_name}</CardTitle>
                    <CardDescription>
                      {vaccination.patient_name} • {vaccination.vaccine_type}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(vaccination.status)}>
                  {vaccination.status === 'completed' && <Shield className="w-3 h-3 mr-1" />}
                  {vaccination.status === 'due-soon' && <Clock className="w-3 h-3 mr-1" />}
                  {vaccination.status === 'overdue' && <AlertCircle className="w-3 h-3 mr-1" />}
                  {displayStatusLabel(vaccination.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900 mb-1">Administration Details</p>
                  <p className="text-gray-600">Date: {vaccination.administered_date ? new Date(vaccination.administered_date).toLocaleDateString() : 'N/A'}</p>
                  <p className="text-gray-600">Veterinarian: {vaccination.administered_by || 'N/A'}</p>
                  <p className="text-gray-600">Batch: {vaccination.batch_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Next Due</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600">{vaccination.next_due_date ? new Date(vaccination.next_due_date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <p className="text-gray-600 mt-1">Manufacturer: {vaccination.manufacturer || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Notes</p>
                  <p className="text-gray-600 text-xs">{vaccination.notes}</p>
                  {vaccination.reactions && (
                    <p className="text-red-600 text-xs mt-1">Side effects: {vaccination.reactions}</p>
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