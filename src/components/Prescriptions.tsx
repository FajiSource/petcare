import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertCircle, Calendar, Clock, Pill, Plus, Search, RefreshCw, FileText } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { useAddNewPrescription, useGetAllPets, useGetOwnerPrescriptions, useGetVetPrescriptions, useUpdatePrescription, useUpdatePrescriptionReFill } from '../lib/react-query/QueriesAndMutations';
import { INewPrescription, IPrescription } from '../lib/types';

const INITIAL_PRESCRIPTION = {
  pet_id: 0,
  medication_name: "",
  dosage: "",
  frequency: "",
  duration: "",
  prescribed_date: "",
  start_date: "",
  end_date: "",
  instructions: "",
  side_effects: "",
  refills_remaining: 0,
  total_refills: 0,
  status: "active",
  category: "",
  manufacturer: "",
  cost: 0,
}
export function Prescriptions() {
  const { user, currentRole } = useApp();
  const vetQuery = useGetVetPrescriptions()
  const ownerQuery = useGetOwnerPrescriptions()
  const { mutateAsync: addNewPrescription } = useAddNewPrescription()
  const { mutateAsync: updateReFill } = useUpdatePrescriptionReFill()
  const { mutateAsync: editPrescription } = useUpdatePrescription()


  const prescriptions = currentRole['veterinarian'] ? vetQuery.data : ownerQuery.data;
  const isGettingPrescriptions = currentRole['veterinarian'] ? vetQuery.isPending : ownerQuery.isPending;

  const { data: pets } = useGetAllPets()
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPrescription, setNewPrescription] = useState<INewPrescription>(INITIAL_PRESCRIPTION);
  const [selectedPrescription, setSelectedPrescription] = useState<IPrescription | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editPrescriptionData, setEditPrescriptionData] = useState<IPrescription>(null as any);

  const medicationCategories = [
    'Antibiotic',
    'Anti-inflammatory',
    'Pain Relief',
    'Preventive',
    'Cardiac',
    'Ophthalmic',
    'Dermatological',
    'Gastrointestinal',
    'Behavioral',
    'Other'
  ];

  const frequencies = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 8 hours',
    'Every 12 hours',
    'Weekly',
    'Monthly',
    'As needed'
  ];
  const handleOpenEdit = (prescription: IPrescription) => {
    setSelectedPrescription(prescription);
    setEditPrescriptionData(prescription);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedPrescription) return;
    try {
      await editPrescription({prescriptionId:editPrescriptionData.id, data: editPrescriptionData}); 
      setIsEditDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const filteredPrescriptions = prescriptions?.filter((prescription) => {
    const matchesSearch =
      prescription.pet?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPet = selectedPet === "all" || prescription.pet_id === selectedPet;

    const matchesStatus = statusFilter === "all" || prescription.status === statusFilter;

    return matchesSearch && matchesPet && matchesStatus;
  });


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'refill_needed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Pill className="w-3 h-3 mr-1" />;
      case 'completed': return <Clock className="w-3 h-3 mr-1" />;
      case 'expired': return <AlertCircle className="w-3 h-3 mr-1" />;
      case 'refill_needed': return <RefreshCw className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  const calculateProgress = (prescription: IPrescription) => {
    const totalDays = Math.ceil(
      (new Date(prescription.end_date).getTime() - new Date(prescription.start_date).getTime()) /
      (1000 * 60 * 60 * 24)
    );

    const daysPassed = Math.ceil(
      (new Date().getTime() - new Date(prescription.start_date).getTime()) /
      (1000 * 60 * 60 * 24)
    );

    return Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
  };


  const handleAddPrescription = async () => {
    try {
      const startDate = new Date(newPrescription.start_date);
      const durationDays = parseInt(newPrescription.duration.split(' ')[0]) || 0;
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + durationDays);

      const prescription: INewPrescription = {
        ...newPrescription,
        prescribed_date: new Date().toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        refills_remaining: newPrescription.total_refills,
        status: 'active' as const
      };
      await addNewPrescription(prescription);
      setIsAddDialogOpen(false);
      setNewPrescription(INITIAL_PRESCRIPTION);
    } catch (error) {
      console.log(error);
    }
  };

  const refillNeededCount = prescriptions?.filter(p => p.status === 'refill_needed').length;
  const activeCount = prescriptions?.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescription Management</h1>
          <p className="text-gray-600 mt-1">Track medications and manage refills</p>
        </div>
        {(user?.role === 'veterinarian') && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Prescription</DialogTitle>
                <DialogDescription>
                  Enter the prescription details for the pet.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pet">Pet</Label>
                  <Select
                    value={String(newPrescription.pet_id)}
                    onValueChange={(value) =>
                      setNewPrescription((prev) => ({ ...prev, pet_id: Number(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pet" />
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

                <div className="space-y-2">
                  <Label htmlFor="medication_name">Medication Name</Label>
                  <Input
                    id="medication_name"
                    value={newPrescription.medication_name}
                    onChange={(e) =>
                      setNewPrescription((prev) => ({
                        ...prev,
                        medication_name: e.target.value,
                      }))
                    }
                    placeholder="e.g., Rimadyl, Amoxicillin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={newPrescription.dosage}
                    onChange={(e) =>
                      setNewPrescription((prev) => ({ ...prev, dosage: e.target.value }))
                    }
                    placeholder="e.g., 75mg, 2 drops"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={newPrescription.frequency}
                    onValueChange={(value) =>
                      setNewPrescription((prev) => ({ ...prev, frequency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={newPrescription.duration}
                    onChange={(e) =>
                      setNewPrescription((prev) => ({ ...prev, duration: e.target.value }))
                    }
                    placeholder="e.g., 14 days, Ongoing"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newPrescription.start_date}
                    onChange={(e) =>
                      setNewPrescription((prev) => ({
                        ...prev,
                        start_date: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newPrescription.category}
                    onValueChange={(value) =>
                      setNewPrescription((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicationCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total_refills">Total Refills</Label>
                  <Input
                    id="total_refills"
                    type="number"
                    min="0"
                    value={newPrescription.total_refills}
                    onChange={(e) =>
                      setNewPrescription((prev) => ({
                        ...prev,
                        total_refills: Number(e.target.value),
                      }))
                    }
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer (Optional)</Label>
                  <Input
                    id="manufacturer"
                    value={newPrescription.manufacturer}
                    onChange={(e) =>
                      setNewPrescription((prev) => ({
                        ...prev,
                        manufacturer: e.target.value,
                      }))
                    }
                    placeholder="e.g., Zoetis, Pfizer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (Optional)</Label>
                  <Input
                    id="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newPrescription.cost}
                    onChange={(e) =>
                      setNewPrescription((prev) => ({
                        ...prev,
                        cost: Number(e.target.value),
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={newPrescription.instructions}
                    onChange={(e) =>
                      setNewPrescription((prev) => ({
                        ...prev,
                        instructions: e.target.value,
                      }))
                    }
                    placeholder="Detailed instructions for administration"
                    rows={3}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="side_effects">Potential Side Effects</Label>
                  <Textarea
                    id="side_effects"
                    value={newPrescription.side_effects}
                    onChange={(e) =>
                      setNewPrescription((prev) => ({
                        ...prev,
                        side_effects: e.target.value,
                      }))
                    }
                    placeholder="List potential side effects to watch for"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPrescription}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Prescription
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Prescriptions</p>
                <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Pill className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Refills Needed</p>
                <p className="text-2xl font-bold text-yellow-600">{refillNeededCount}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Prescriptions</p>
                <p className="text-2xl font-bold text-blue-600">{prescriptions?.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts for refills needed */}
      {refillNeededCount > 0 && user?.role === 'veterinarian' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {refillNeededCount} prescription{refillNeededCount > 1 ? 's' : ''} need{refillNeededCount === 1 ? 's' : ''} refills.
            <Button variant="link" className="p-0 h-auto text-yellow-800 underline ml-1">
              Request refills
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
                placeholder="Search prescriptions..."
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
                {pets?.map(pet => (
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="refill_needed">Refill Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prescription Records */}
      <div className="grid gap-4">
        {
          isGettingPrescriptions && (
            <p>Loading...</p>
          )
        }
        {filteredPrescriptions?.map((prescription) => (
          <Card key={prescription.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Pill className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{prescription.medication_name}</CardTitle>
                    <CardDescription>
                      {prescription.pet?.name} • {prescription.dosage} • {prescription.frequency}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(prescription.status)}>
                    {getStatusIcon(prescription.status)}
                    {prescription.status.replace("_", " ").charAt(0).toUpperCase() +
                      prescription.status.replace("_", " ").slice(1)}
                  </Badge>
                  {prescription.cost && (
                    <Badge variant="outline">
                      ${prescription.cost}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescription.status === "active" && prescription.duration !== "Ongoing" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Treatment Progress</span>
                      <span className="text-gray-600">{Math.round(calculateProgress(prescription))}%</span>
                    </div>
                    <Progress value={calculateProgress(prescription)} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Prescription Details</p>
                    <p className="text-gray-600">Duration: {prescription.duration}</p>
                    <p className="text-gray-600">Category: {prescription.category}</p>
                    <p className="text-gray-600">
                      Prescribed: {new Date(prescription.prescribed_date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">Veterinarian: {prescription.veterinarian}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Treatment Period</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-600">
                        {new Date(prescription.start_date).toLocaleDateString()} -
                        {prescription.duration === "Ongoing"
                          ? "Ongoing"
                          : new Date(prescription.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-600 mt-1">
                      Refills: {prescription.refills_remaining}/{prescription.total_refills}
                    </p>
                    {prescription.manufacturer && (
                      <p className="text-gray-600">Manufacturer: {prescription.manufacturer}</p>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Instructions</p>
                    <p className="text-gray-600 text-xs mb-2">{prescription.instructions}</p>
                    {prescription.side_effects && (
                      <>
                        <p className="font-medium text-gray-900 text-xs">Side Effects:</p>
                        <p className="text-red-600 text-xs">{prescription.side_effects}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  {user?.role === "pet_owner" && (
                    <>
                      <Button variant="outline" size="sm"
                        onClick={async () => {
                          try {
                            await updateReFill({ prescriptionId: prescription.id, status: 'refill_needed' });
                          }
                          catch (error) {
                            console.log(error);
                          }
                        }}
                      >
                        Request Refill
                      </Button>
                      {/* <Button variant="outline" size="sm">
                        Set Reminder
                      </Button> */}
                    </>
                  )}
                  {(user?.role === "veterinarian" || user?.role === "admin") && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(prescription)}
                      >
                        Edit Prescription
                      </Button>
                      {
                        prescription.status === 'refill_needed' && (
                          <Button variant="outline" size="sm"
                            onClick={async () => {
                              try {
                                await updateReFill({ prescriptionId: prescription.id, status: 'refilled' });
                              }
                              catch (error) {
                                console.log(error);
                              }
                            }}
                          >
                            Approve Refill
                          </Button>
                        )
                      }
                      {/* <Button variant="outline" size="sm">
                        Print Label
                      </Button> */}
                    </>
                  )}
                  {/* <Button variant="outline" size="sm">
                    View Details
                  </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      {filteredPrescriptions?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedPet !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first prescription'}
            </p>
            {(user?.role === 'veterinarian' || user?.role === 'admin') && (
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create First Prescription
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Prescription</DialogTitle>
            <DialogDescription>Modify the prescription details</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {/* Pet */}
            <div className="space-y-2">
              <Label>Pet</Label>
              <Select
                value={String(editPrescriptionData?.id)}
                onValueChange={(val) => setEditPrescriptionData(prev => ({ ...prev, pet_id: Number(val) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets?.map(pet => (
                    <SelectItem key={pet.id} value={String(pet.id)}>{pet.name} ({pet.species})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Medication Name</Label>
              <Input
                value={editPrescriptionData?.medication_name}
                onChange={e => setEditPrescriptionData(prev => ({ ...prev, medication_name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Dosage</Label>
              <Input
                value={editPrescriptionData?.dosage}
                onChange={e => setEditPrescriptionData(prev => ({ ...prev, dosage: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={editPrescriptionData?.frequency}
                onValueChange={val => setEditPrescriptionData(prev => ({ ...prev, frequency: val }))}
              >
                <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                <SelectContent>
                  {frequencies.map(freq => <SelectItem key={freq} value={freq}>{freq}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                value={editPrescriptionData?.duration}
                onChange={e => setEditPrescriptionData(prev => ({ ...prev, duration: e.target.value }))}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Instructions</Label>
              <Textarea
                value={editPrescriptionData?.instructions}
                onChange={e => setEditPrescriptionData(prev => ({ ...prev, instructions: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Side Effects</Label>
              <Textarea
                value={editPrescriptionData?.side_effects}
                onChange={e => setEditPrescriptionData(prev => ({ ...prev, side_effects: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}