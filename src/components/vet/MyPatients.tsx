import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AddPatientDialog } from './PatientManagement';
import {
  PawPrint,
  Search,
  Filter,
  FileText,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  Heart,
  Activity,
  Pill,
  Syringe,
  Eye,
  Plus,
  Clock
} from 'lucide-react';
import { useGetPatients } from '../../lib/react-query/QueriesAndMutations';
import { IPatient, IPet } from '../../lib/types';
import UpdatePatientDialog from './UpdatePatient';

interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  age: number;
  weight: number;
  color: string;
  microchipId?: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerAddress: string;
  registrationDate: string;
  lastVisit: string;
  nextAppointment?: string;
  status: 'healthy' | 'treatment' | 'critical' | 'follow-up' | 'chronic';
  conditions: string[];
  allergies: string[];
  medications: string[];
  notes: string;
  imageUrl?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export function MyPatients() {
  const { data: patients } = useGetPatients()
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<IPet | null>(null);
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'treatment':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'follow-up':
        return 'bg-blue-100 text-blue-800';
      case 'chronic':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpeciesIcon = (species: string) => {
    switch (species.toLowerCase()) {
      case 'dog':
        return '🐕';
      case 'cat':
        return '🐱';
      case 'bird':
        return '🐦';
      case 'rabbit':
        return '🐰';
      default:
        return '🐾';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    return age;
  };

  const filteredPatients = Array.isArray(patients) ?  patients?.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = speciesFilter === 'all' || patient.species.toLowerCase() === speciesFilter;
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesSpecies && matchesStatus;
  }) : [];

  const criticalPatients = filteredPatients?.filter(patient => patient.status === 'critical');
  const activePatients = filteredPatients?.filter(patient =>
    patient.status === 'treatment' || patient.status === 'follow-up'
  );
  const healthyPatients = filteredPatients?.filter(patient => patient.status === 'healthy');
  const chronicPatients = filteredPatients?.filter(patient => patient.status === 'chronic');

  const PatientCard = ({ patient }: { patient: IPet }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="h-16 w-16">
              {patient.image ? (
                <AvatarImage src={patient.image} alt={patient.name} />
              ) : (
                <AvatarFallback className="bg-blue-100 text-2xl">
                  {getSpeciesIcon(patient.species)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{patient.name}</h3>
                <Badge className={getStatusColor(patient?.status)}>
                  {patient?.status?.toUpperCase()}
                </Badge>
                {patient?.status === "critical" && (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                <div>
                  <strong>Species:</strong> {patient.species}
                </div>
                <div>
                  <strong>Breed:</strong> {patient.breed}
                </div>
                <div>
                  <strong>Age:</strong> {patient.age} years
                </div>
                <div>
                  <strong>Weight:</strong> {patient.weight} kg
                </div>
                <div>
                  <strong>Gender:</strong> {patient.gender}
                </div>
                <div>
                  <strong>Color:</strong> {patient.color}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{patient.owner_name}</span>
                  </div>
                  {patient?.nextAppointment && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Next: {formatDate(patient?.nextAppointment)}</span>
                    </div>
                  )}
                </div>
              </div>

              {patient?.conditions?.length > 0 && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900 mb-1">
                    Active Conditions:
                  </p>
                  <p className="text-sm text-yellow-800">
                    {patient?.conditions.join(", ")}
                  </p>
                </div>
              )}

              {patient?.allergies?.length > 0 && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-red-900 mb-1">Allergies:</p>
                  <p className="text-sm text-red-800">
                    {patient?.allergies.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span className="text-2xl">
                      {getSpeciesIcon(patient.species)}
                    </span>
                    {patient.name} - Complete Profile
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold">
                        Pet Information
                      </Label>
                      <div className="space-y-2 mt-2 bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <strong>Name:</strong> {patient.name}
                          </div>
                          <div>
                            <strong>Species:</strong> {patient.species}
                          </div>
                          <div>
                            <strong>Breed:</strong> {patient.breed}
                          </div>
                          <div>
                            <strong>Gender:</strong> {patient.gender}
                          </div>
                          <div>
                            <strong>Age:</strong> {patient.age} years
                          </div>
                          <div>
                            <strong>Weight:</strong> {patient.weight} kg
                          </div>
                          <div>
                            <strong>Color:</strong> {patient.color}
                          </div>
                          {patient.microchip_id && (
                            <div className="col-span-2">
                              <strong>Microchip:</strong> {patient.microchip_id}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold">
                        Owner Information
                      </Label>
                      <div className="space-y-2 mt-2 bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-1 text-sm">
                          <div>
                            <strong>Name:</strong> {patient.owner_name}
                          </div>
                          <div>
                            <strong>Phone:</strong> {patient.owner_phone}
                          </div>
                          <div>
                            <strong>Email:</strong> {patient.owner_email}
                          </div>
                          <div>
                            <strong>Address:</strong> {patient.owner_address}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold">
                        Emergency Contact
                      </Label>
                      <div className="space-y-2 mt-2 bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-1 text-sm">
                          <div>
                            <strong>Name:</strong>{" "}
                            {patient.emergency_contact?.name}
                          </div>
                          <div>
                            <strong>Phone:</strong>{" "}
                            {patient.emergency_contact?.phone}
                          </div>
                          <div>
                            <strong>Relationship:</strong>{" "}
                            {patient.emergency_contact?.relationship}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold">
                        Medical Information
                      </Label>
                      <div className="space-y-3 mt-2">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">
                            Current Status
                          </h4>
                          <Badge className={getStatusColor(patient?.status)}>
                            {patient?.status?.toUpperCase()}
                          </Badge>
                        </div>

                        {patient?.conditions?.length > 0 && (
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-medium text-yellow-900 mb-2">
                              Active Conditions
                            </h4>
                            <ul className="text-sm text-yellow-800 space-y-1">
                              {patient?.conditions?.map((condition, index) => (
                                <li key={index}>• {condition}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {patient?.allergies?.length > 0 && (
                          <div className="bg-red-50 p-4 rounded-lg">
                            <h4 className="font-medium text-red-900 mb-2">
                              Allergies
                            </h4>
                            <ul className="text-sm text-red-800 space-y-1">
                              {patient?.allergies.map((allergy, index) => (
                                <li key={index}>• {allergy}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {patient?.medications?.length > 0 && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-2">
                              Current Medications
                            </h4>
                            <ul className="text-sm text-green-800 space-y-1">
                              {patient?.medications?.map((medication, index) => (
                                <li key={index}>• {medication}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold">
                        Clinical Notes
                      </Label>
                      <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">{patient.notes}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold">
                        Visit History
                      </Label>
                      <div className="space-y-2 mt-2 bg-gray-50 p-4 rounded-lg text-sm">
                        <div>
                          <strong>Registration:</strong>{" "}
                          {formatDate(patient.created_at)}
                        </div>
                        <div>
                          <strong>Last Visit:</strong>{" "}
                          {patient?.lastVisit ? formatDate(patient?.lastVisit) : "N/A"}
                        </div>
                        {patient?.nextAppointment && (
                          <div>
                            <strong>Next Appointment:</strong>{" "}
                            {formatDate(patient?.nextAppointment)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Medical Records
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button variant="outline">
                    <Pill className="h-4 w-4 mr-2" />
                    Prescriptions
                  </Button>
                  <Button>
                    <Heart className="h-4 w-4 mr-2" />
                    Update Status
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* <Button size="sm" variant="outline">
              <FileText className="h-4 w-4 mr-1" />
              Records
            </Button>

            <Button size="sm" variant="outline">
              <Calendar className="h-4 w-4 mr-1" />
              Schedule
            </Button> */}
            <Button
              onClick={() => {
                setSelectedPatient(patient);
                setUpdateDialogOpen(true);
              }}
            >
              <Heart className="h-4 w-4 mr-2" />
              Update Patient
            </Button>

          </div>
        </div>
      </CardContent>
    </Card>

  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-blue-600" />
            My Patients
          </h1>
          <p className="text-gray-600 mt-1">Manage your patients and their medical information</p>
        </div>
        <UpdatePatientDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          patient={selectedPatient}
          onPatientUpdated={(updated) => {
            console.log("Updated patient:", updated);
          }}
        />

        <Button onClick={() => setIsAddPatientDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold">{filteredPatients?.length}</p>
              </div>
              <PawPrint className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Cases</p>
                <p className="text-2xl font-bold text-red-600">{criticalPatients?.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Treatment</p>
                <p className="text-2xl font-bold text-yellow-600">{activePatients?.length}</p>
              </div>
              <Activity className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Healthy Patients</p>
                <p className="text-2xl font-bold text-green-600">{healthyPatients?.length}</p>
              </div>
              <Heart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient name, owner, or breed..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
              <SelectTrigger className="w-40">
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
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="chronic">Chronic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({filteredPatients?.length})
          </TabsTrigger>
          <TabsTrigger value="critical">
            Critical ({criticalPatients?.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activePatients?.length})
          </TabsTrigger>
          <TabsTrigger value="healthy">
            Healthy ({healthyPatients?.length})
          </TabsTrigger>
          <TabsTrigger value="chronic">
            Chronic ({chronicPatients?.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredPatients?.length > 0 ? (
            filteredPatients?.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <PawPrint className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No patients found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          {criticalPatients?.length > 0 ? (
            criticalPatients?.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No critical patients</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activePatients?.length > 0 ? (
            activePatients?.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No patients in active treatment</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="healthy" className="space-y-4">
          {healthyPatients?.length > 0 ? (
            healthyPatients?.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No healthy patients</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="chronic" className="space-y-4">
          {chronicPatients?.length > 0 ? (
            chronicPatients?.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <PawPrint className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No patients with chronic conditions</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <AddPatientDialog
        open={isAddPatientDialogOpen}
        onOpenChange={setIsAddPatientDialogOpen}
        onPatientAdded={(patient) => {
          console.log('New patient added:', patient);
        }}
      />
    </div>
  );
}