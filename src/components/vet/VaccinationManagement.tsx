import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Syringe,
  Plus,
  Search,
  Calendar as CalendarIcon,
  CheckCircle,
  AlertTriangle,
  Clock,
  Filter,
  Edit,
  Trash2,
  PawPrint,
  FileText
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';
import { cn } from '../ui/utils';
import { INewVaccination, IOption, IVaccination } from '../../lib/types';
import { useAddVaccination, useGetVaccinations, usePetOptions, useUpdateVaccination } from '../../lib/react-query/QueriesAndMutations';

interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  owner_name: string;
}
const INITIAL_VACCINATION: INewVaccination = {
  patient_id: 0,
  patient_species: '',

  vaccine_name: '',
  vaccine_type: 'core',

  manufacturer: '',
  batch_number: '',
  administered_date: new Date(),
  next_due_date: undefined,

  administered_by: 'Dr. Sarah Johnson',
  site: '',
  route: 'Subcutaneous',
  dose: '',
  notes: '',
  reactions: '',

  status: 'completed',
}
export function VaccinationManagement() {
  const { mutateAsync: createVaccination } = useAddVaccination()
  const { mutateAsync: updateVaccination } = useUpdateVaccination()
  const { data: vaccinations } = useGetVaccinations()
  const { data: patients } = usePetOptions()

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState<IVaccination | null>(null);
  const [vaccinationToDelete, setVaccinationToDelete] = useState<IVaccination | null>(null);


  const [newVaccination, setNewVaccination] = useState<Partial<INewVaccination>>(INITIAL_VACCINATION);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'due-soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVaccineTypeColor = (type: string) => {
    switch (type) {
      case 'core':
        return 'bg-blue-100 text-blue-800';
      case 'non-core':
        return 'bg-purple-100 text-purple-800';
      case 'rabies':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateNextDueDate = (administered_date: Date, vaccine_type: string): Date => {
    const nextDate = new Date(administered_date);
    switch (vaccine_type) {
      case 'rabies':
        nextDate.setFullYear(nextDate.getFullYear() + 3);
        break;
      case 'core':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      case 'non-core':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
    return nextDate;
  };

  const filteredVaccinations = vaccinations.filter((vacc: IVaccination) => {
    const matchesSearch =
      vacc.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacc.vaccine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacc.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vacc.status === statusFilter;
    const matchesSpecies = speciesFilter === 'all' || vacc.patient_species.toLowerCase() === speciesFilter;
    return matchesSearch && matchesStatus && matchesSpecies;
  });

  const completedVaccinations = vaccinations.filter((v:IVaccination) => v.status === 'completed');
  const dueSoonVaccinations = vaccinations.filter((v:IVaccination) => v.status === 'due-soon');
  const overdueVaccinations = vaccinations.filter((v:IVaccination) => v.status === 'overdue');

  const handleAddVaccination = async () => {
    try {
      const patient = patients.find((p: IOption) => p.id === newVaccination.patient_id);

      const nextDue = calculateNextDueDate(newVaccination?.administered_date, newVaccination.vaccine_type || 'core');

      const newRecord: INewVaccination = {
        patient_id: patient.id,
        patient_species: patient.species,

        vaccine_name: newVaccination.vaccine_name as string,
        vaccine_type: newVaccination.vaccine_type as 'core' | 'non-core' | 'rabies',

        manufacturer: newVaccination.manufacturer || '',
        batch_number: newVaccination.batch_number || '',
        administered_date: newVaccination.administered_date,
        next_due_date: nextDue || undefined,

        administered_by: newVaccination.administered_by || 'Dr. Sarah Johnson',
        site: newVaccination.site || '',
        route: newVaccination.route || 'Subcutaneous',
        dose: newVaccination.dose || '',
        notes: newVaccination.notes || '',
        reactions: newVaccination.reactions || '',

        status: newVaccination.status || 'completed',
      };

      await createVaccination(newRecord);
      setIsAddDialogOpen(false);
      setNewVaccination(INITIAL_VACCINATION);
      toast.success('Vaccination record added successfully!');
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.success(error?.response?.data?.message);
      }
      toast.success('something went wrong.');

    }
  };

  const handleEditVaccination = async () => {
    try {
      if (!selectedVaccination) return;

      await updateVaccination({
        id: selectedVaccination?.id as number,
        data: selectedVaccination as IVaccination
      });

      setIsEditDialogOpen(false);
      toast.success('Vaccination record updated successfully!');
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.success(error?.response?.data?.message);
      }
      toast.success('something went wrong.');

    }
  };

  const handleDeleteVaccination = () => {
    if (!vaccinationToDelete) return;

    setIsDeleteDialogOpen(false);
    setVaccinationToDelete(null);
    toast.success('Vaccination record deleted successfully!');
  };

  const VaccinationCard = ({ vaccination }: { vaccination: IVaccination }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{vaccination.vaccine_name}</h3>
              <Badge className={getVaccineTypeColor(vaccination.vaccine_type)}>
                {vaccination.vaccine_type.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <PawPrint className="h-4 w-4" />
              <span className="font-medium">{vaccination.patient_name}</span>
              <span>•</span>
              <span>{vaccination.patient_species}</span>
              <span>•</span>
              <span>{vaccination.owner_name}</span>
            </div>
          </div>
          <Badge className={getStatusColor(vaccination.status)}>
            {vaccination.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
            {vaccination.status === 'due-soon' && <Clock className="h-3 w-3 mr-1" />}
            {vaccination.status === 'overdue' && <AlertTriangle className="h-3 w-3 mr-1" />}
            {vaccination.status.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div>
            <span className="text-gray-500">Administered:</span>
            <div className="font-medium">{format(vaccination.administered_date, 'MMM dd, yyyy')}</div>
          </div>
          <div>
            <span className="text-gray-500">Next Due:</span>
            <div className="font-medium">{format(vaccination.next_due_date, 'MMM dd, yyyy')}</div>
          </div>
          <div>
            <span className="text-gray-500">Batch:</span>
            <div className="font-medium">{vaccination.batch_number}</div>
          </div>
          <div>
            <span className="text-gray-500">Dose:</span>
            <div className="font-medium">{vaccination.dose}</div>
          </div>
        </div>

        {vaccination.notes && (
          <div className="text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded">
            {vaccination.notes}
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedVaccination(vaccination);
              setIsEditDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setVaccinationToDelete(vaccination);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
          {/* <Button size="sm" variant="outline" className="ml-auto">
            <FileText className="h-4 w-4 mr-1" />
            Certificate
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );

  const VaccinationForm = ({
    vaccination,
    onChange,
    isNew = false
  }: {
    vaccination: Partial<IVaccination>,
    onChange: (updates: Partial<IVaccination>) => void,
    isNew?: boolean
  }) => (
    <div className="space-y-4">
      {isNew && (
        <div className="space-y-2">
          <Label>Select Patient *</Label>
          <Select
            value={vaccination.patient_id}
            onValueChange={(value) => {
              const patient = patients.find(p => p.id === value);
              if (patient) {
                onChange({
                  patient_id: value,
                  patient_name: patient.name,
                  patient_species: patient.species,
                  owner_name: patient.owner_name
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map(patient => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name} ({patient.species}) - {patient.owner_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Vaccine Name *</Label>
          <Input
            value={vaccination.vaccine_name || ''}
            onChange={(e) => onChange({ vaccine_name: e.target.value })}
            placeholder="e.g., Rabies Vaccine"
          />
        </div>
        <div className="space-y-2">
          <Label>Vaccine Type *</Label>
          <Select
            value={vaccination.vaccine_type}
            onValueChange={(value) => onChange({ vaccine_type: value as 'core' | 'non-core' | 'rabies' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="core">Core</SelectItem>
              <SelectItem value="non-core">Non-Core</SelectItem>
              <SelectItem value="rabies">Rabies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Manufacturer</Label>
          <Input
            value={vaccination.manufacturer || ''}
            onChange={(e) => onChange({ manufacturer: e.target.value })}
            placeholder="e.g., Merck Animal Health"
          />
        </div>
        <div className="space-y-2">
          <Label>Batch Number</Label>
          <Input
            value={vaccination.batch_number || ''}
            onChange={(e) => onChange({ batch_number: e.target.value })}
            placeholder="e.g., RAB-2024-001"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Administered Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left",
                  !vaccination.administered_date && "text-gray-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {vaccination.administered_date ?
                  format(vaccination.administered_date, "PPP") :
                  "Select date"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={vaccination.administered_date}
                onSelect={(date) => date && onChange({ administered_date: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>Administered By</Label>
          <Input
            value={vaccination.administered_by || ''}
            onChange={(e) => onChange({ administered_by: e.target.value })}
            placeholder="Veterinarian name"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Administration Site</Label>
          <Input
            value={vaccination.site || ''}
            onChange={(e) => onChange({ site: e.target.value })}
            placeholder="e.g., Right shoulder"
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={(vaccination.status as string) || 'completed'}
            onValueChange={(value) => onChange({ status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="due-soon">Due Soon</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Route</Label>
          <Select
            value={vaccination.route}
            onValueChange={(value) => onChange({ route: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Subcutaneous">Subcutaneous</SelectItem>
              <SelectItem value="Intramuscular">Intramuscular</SelectItem>
              <SelectItem value="Intranasal">Intranasal</SelectItem>
              <SelectItem value="Oral">Oral</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Dose</Label>
          <Input
            value={vaccination.dose || ''}
            onChange={(e) => onChange({ dose: e.target.value })}
            placeholder="e.g., 1 ml"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          value={vaccination.notes || ''}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Additional notes about the vaccination..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Reactions (if any)</Label>
        <Textarea
          value={vaccination.reactions || ''}
          onChange={(e) => onChange({ reactions: e.target.value })}
          placeholder="Any adverse reactions observed..."
          rows={2}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Syringe className="h-6 w-6 text-blue-600" />
            Vaccination Management
          </h1>
          <p className="text-gray-600 mt-1">Track and manage patient vaccinations</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vaccination Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Vaccination Record</DialogTitle>
            </DialogHeader>
            <VaccinationForm
              vaccination={newVaccination}
              onChange={(updates) => setNewVaccination({ ...newVaccination, ...updates })}
              isNew={true}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddVaccination}>
                Add Record
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">{vaccinations.length}</p>
              </div>
              <Syringe className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedVaccinations.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due Soon</p>
                <p className="text-2xl font-bold text-yellow-600">{dueSoonVaccinations.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueVaccinations.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient, vaccine name, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Species</SelectItem>
                <SelectItem value="dog">Dogs</SelectItem>
                <SelectItem value="cat">Cats</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="due-soon">Due Soon</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vaccinations List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({filteredVaccinations.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedVaccinations.length})</TabsTrigger>
          <TabsTrigger value="due-soon">Due Soon ({dueSoonVaccinations.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueVaccinations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredVaccinations.map(vacc => (
              <VaccinationCard key={vacc.id} vaccination={vacc} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completedVaccinations.filter(v =>
              v.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              v.vaccine_name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(vacc => (
              <VaccinationCard key={vacc.id} vaccination={vacc} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="due-soon" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dueSoonVaccinations.filter(v =>
              v.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              v.vaccine_name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(vacc => (
              <VaccinationCard key={vacc.id} vaccination={vacc} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {overdueVaccinations.filter(v =>
              v.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              v.vaccine_name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(vacc => (
              <VaccinationCard key={vacc.id} vaccination={vacc} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vaccination Record</DialogTitle>
          </DialogHeader>
          {selectedVaccination && (
            <VaccinationForm
              vaccination={selectedVaccination}
              onChange={(updates) => setSelectedVaccination({ ...selectedVaccination, ...updates } as IVaccination)}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditVaccination}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this vaccination record for {vaccinationToDelete?.patient_name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setVaccinationToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVaccination} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
