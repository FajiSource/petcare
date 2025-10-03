import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import {
  Building,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Activity,
  Edit,
  Trash2,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { IClinic, INewClinic } from '../../lib/types';
import { useCreateNewClinic, useDeleteClinic, useGetClinics, useUpdateClinic } from '../../lib/react-query/QueriesAndMutations';

export function ClinicManagement() {
  const { data: clinics } = useGetClinics()
  const { mutateAsync: createClinic } = useCreateNewClinic()
  const { mutateAsync: updateClinic } = useUpdateClinic()
  const { mutateAsync: deleteClinic } = useDeleteClinic()

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<IClinic | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clinicToDelete, setClinicToDelete] = useState<IClinic | null>(null);


  const [newClinic, setNewClinic] = useState<Partial<INewClinic>>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    operatingHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    services: [],
    isActive: true,
    emergencyAvailable: false,
    description: ''
  });

  const filteredClinics = clinics?.filter((clinic: IClinic) =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeClinics = clinics?.filter(c => c.isActive);
  const inactiveClinics = clinics?.filter(c => !c.isActive);

  const handleAddClinic = async () => {
    try {
      const clinic: INewClinic = {
        name: newClinic.name || '',
        address: newClinic.address || '',
        city: newClinic.city || '',
        state: newClinic.state || '',
        zipCode: newClinic.zipCode || '',
        phone: newClinic.phone || '',
        email: newClinic.email || '',
        website: newClinic.website,
        operatingHours: newClinic.operatingHours || {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 5:00 PM',
          saturday: 'Closed',
          sunday: 'Closed'
        },
        services: newClinic.services || [],
        totalStaff: 0,
        totalPatients: 0,
        isActive: newClinic.isActive ?? true,
        establishedDate: new Date().toISOString().split('T')[0],
        licenseNumber: `VET-CLINIC-${Date.now()}`,
        emergencyAvailable: newClinic.emergencyAvailable ?? false,
        description: newClinic.description
      };
      await createClinic(clinic);
      setIsAddDialogOpen(false);
      setNewClinic({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        operatingHours: {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 5:00 PM',
          saturday: 'Closed',
          sunday: 'Closed'
        },
        services: [],
        isActive: true,
        emergencyAvailable: false,
        description: ''
      });
      toast.success('Clinic added successfully!');
    } catch (error) {
      toast.error('something went wrong.');
    }
  };

  const handleEditClinic = async () => {

    try {
      if (!selectedClinic) return;
      await updateClinic({
        id: selectedClinic.id as string,
        data: selectedClinic
      })
      toast.success('Clinic updated successfully!');
      setIsEditDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClinic = async () => {
    try {
      if (!clinicToDelete) return;
      await deleteClinic(clinicToDelete?.id as string );
      setIsDeleteDialogOpen(false);
      setClinicToDelete(null);
      toast.success('Clinic deleted successfully!');
    } catch (error) {
      console.log(error);
    }
  };
  const ClinicCard = ({ clinic }: { clinic: IClinic }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">{clinic.name}</CardTitle>
            </div>
            <Badge className={clinic.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {clinic.isActive ? 'Active' : 'Inactive'}
            </Badge>
            {clinic.emergencyAvailable && (
              <Badge className="ml-2 bg-red-100 text-red-800">
                24/7 Emergency
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedClinic(clinic);
                setIsEditDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setClinicToDelete(clinic);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <div>{clinic.address}</div>
              <div className="text-gray-500">{clinic.city}, {clinic.state} {clinic.zipCode}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>{clinic.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span className="truncate">{clinic.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span>{clinic.totalStaff} Staff • {clinic.totalPatients} Patients</span>
          </div>
        </div>

        {clinic.description && (
          <p className="text-sm text-gray-600">{clinic.description}</p>
        )}

        <div>
          <p className="text-sm font-medium mb-2">Services:</p>
          <div className="flex flex-wrap gap-2">
            {clinic.services.map((service, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t flex justify-between items-center">
          <div className="text-xs text-gray-500">
            License: {clinic.licenseNumber}
          </div>
         
        </div>
      </CardContent>
    </Card>
  );

  const ClinicForm = ({ clinic, onChange }: { clinic: Partial<IClinic>, onChange: (updates: Partial<IClinic>) => void }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Clinic Name *</Label>
          <Input
            id="name"
            value={clinic.name || ''}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Enter clinic name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">License Number</Label>
          <Input
            id="licenseNumber"
            value={clinic.licenseNumber || ''}
            onChange={(e) => onChange({ licenseNumber: e.target.value })}
            placeholder="VET-CLINIC-XXX"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Street Address *</Label>
        <Input
          id="address"
          value={clinic.address || ''}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="123 Main Street"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={clinic.city || ''}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="Springfield"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={clinic.state || ''}
            onChange={(e) => onChange({ state: e.target.value })}
            placeholder="IL"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code *</Label>
          <Input
            id="zipCode"
            value={clinic.zipCode || ''}
            onChange={(e) => onChange({ zipCode: e.target.value })}
            placeholder="62701"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={clinic.phone || ''}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="(555) 123-4567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={clinic.email || ''}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="info@clinic.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={clinic.website || ''}
          onChange={(e) => onChange({ website: e.target.value })}
          placeholder="www.clinic.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={clinic.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Brief description of the clinic..."
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="space-y-1">
          <Label>Emergency Services Available</Label>
          <p className="text-xs text-gray-500">24/7 emergency care</p>
        </div>
        <Switch
          checked={clinic.emergencyAvailable ?? false}
          onCheckedChange={(checked) => onChange({ emergencyAvailable: checked })}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="space-y-1">
          <Label>Active Status</Label>
          <p className="text-xs text-gray-500">Clinic is currently operational</p>
        </div>
        <Switch
          checked={clinic.isActive ?? true}
          onCheckedChange={(checked) => onChange({ isActive: checked })}
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
            <Building className="h-6 w-6 text-blue-600" />
            Clinic Management
          </h1>
          <p className="text-gray-600 mt-1">Manage veterinary clinics? and facilities</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Clinic
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Clinic</DialogTitle>
            </DialogHeader>
            <ClinicForm
              clinic={newClinic}
              onChange={(updates) => setNewClinic({ ...newClinic, ...updates })}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddClinic}>
                Add Clinic
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
                <p className="text-sm font-medium text-gray-600">Total Clinics</p>
                <p className="text-2xl font-bold">{clinics?.length}</p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clinics</p>
                <p className="text-2xl font-bold text-green-600">{activeClinics?.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Clinics</p>
                <p className="text-2xl font-bold text-gray-600">{inactiveClinics?.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-blue-600">
                  {clinics?.reduce((sum, c) => sum + c.totalPatients, 0)}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clinics? by name, address, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clinics List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Clinics ({filteredClinics?.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeClinics?.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveClinics?.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredClinics?.map(clinic => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeClinics?.filter(clinic =>
              clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              clinic.address.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(clinic => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inactiveClinics?.filter(clinic =>
              clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              clinic.address.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(clinic => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Clinic</DialogTitle>
          </DialogHeader>
          {selectedClinic && (
            <ClinicForm
              clinic={selectedClinic}
              onChange={(updates) => setSelectedClinic({ ...selectedClinic, ...updates } as IClinic)}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditClinic}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{clinicToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setClinicToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClinic} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
