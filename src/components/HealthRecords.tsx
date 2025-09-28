import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { FormInput } from './FormInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import {
  FileText,
  Plus,
  Calendar,
  User,
  Heart,
  Activity,
  Thermometer,
  Weight,
  Eye,
  Download
} from 'lucide-react';
import { useAddRecord, useGetAllPets, usegetAllVetRecords } from '../lib/react-query/QueriesAndMutations';
import { INewHealthRecord } from '../lib/types';

export function HealthRecords() {
  const { data: pets, isPending: isGettingPets } = useGetAllPets()
  const { data: healthRecords, isPending: isGettingHealthRecords, refetch: loadRecords } = usegetAllVetRecords()
  const { mutateAsync: createNewRecord, isPending: isAddingNewRecord } = useAddRecord()
  const [selectedPet, setSelectedPet] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const [newRecord, setNewRecord] = useState<INewHealthRecord>({
    pet_id: 0,
    type: 'checkup',
    title: '',
    date: '',
    diagnosis: '',
    treatment: '',
    medications: '',
    notes: '',
    weight: 0,
    temperature: 0,
    heart_rate: 0,
    respiratory_rate: 0,
    follow_up_required: false,
    follow_up_date: null,
  });

  const recordTypes = [
    { value: 'checkup', label: 'Routine Checkup' },
    { value: 'diagnosis', label: 'Diagnosis' },
    { value: 'treatment', label: 'Treatment' },
    { value: 'test', label: 'Laboratory Test' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'emergency', label: 'Emergency Visit' }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'checkup':
        return 'bg-green-100 text-green-800';
      case 'diagnosis':
        return 'bg-blue-100 text-blue-800';
      case 'treatment':
        return 'bg-purple-100 text-purple-800';
      case 'test':
        return 'bg-yellow-100 text-yellow-800';
      case 'surgery':
        return 'bg-red-100 text-red-800';
      case 'emergency':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddRecord = async () => {
    try {
      await createNewRecord(newRecord);
      setNewRecord({
        pet_id: 0,
        type: 'checkup',
        title: '',
        date: '',
        diagnosis: '',
        treatment: '',
        medications: '',
        notes: '',
        weight: 0,
        temperature: 0,
        heart_rate: 0,
        respiratory_rate: 0,
        follow_up_required: false,
        follow_up_date: null,
      });
      setIsDialogOpen(false);
      toast.
      toast.success(`New Health record added`);
    } catch (error) {
      console.log(error)
    }

  };

  const filteredRecords = selectedPet === 'all'
    ? healthRecords
    : healthRecords.filter(record => record.pet_id === selectedPet);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Health Records</h1>
          <p className="text-gray-600 mt-1">Comprehensive medical history for your pets</p>
        </div>

        <div className="flex gap-2">
          <Select value={selectedPet} onValueChange={setSelectedPet}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pets</SelectItem>
              {pets?.map(pet => (
                <SelectItem key={pet.id} value={pet.id}>{pet.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Health Record</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="medical">Medical Details</TabsTrigger>
                  <TabsTrigger value="vitals">Vitals & Follow-up</TabsTrigger>
                </TabsList>

                {/* BASIC */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Select Pet</label>
                      <Select
                        value={String(newRecord.pet_id)}
                        onValueChange={(value) =>
                          setNewRecord((prev) => ({ ...prev, pet_id: Number(value) }))
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

                    <div>
                      <label className="text-sm font-medium">Record Type</label>
                      <Select
                        value={newRecord.type}
                        onValueChange={(value: string) =>
                          setNewRecord((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {recordTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <FormInput
                      id="title"
                      name="title"
                      label="Record Title"
                      value={newRecord.title}
                      onChange={(e) =>
                        setNewRecord((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="e.g., Annual Health Examination"
                      required
                    />

                    <FormInput
                      id="date"
                      name="date"
                      type="date"
                      label="Date"
                      value={newRecord.date}
                      onChange={(e) =>
                        setNewRecord((prev) => ({ ...prev, date: e.target.value }))
                      }
                      required
                    />
                  </div>
                </TabsContent>

                {/* MEDICAL */}
                <TabsContent value="medical" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Diagnosis</label>
                      <Textarea
                        placeholder="Enter diagnosis..."
                        value={newRecord.diagnosis}
                        onChange={(e) =>
                          setNewRecord((prev) => ({ ...prev, diagnosis: e.target.value }))
                        }
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Treatment</label>
                      <Textarea
                        placeholder="Describe treatment provided..."
                        value={newRecord.treatment}
                        onChange={(e) =>
                          setNewRecord((prev) => ({ ...prev, treatment: e.target.value }))
                        }
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Medications</label>
                      <Textarea
                        placeholder="List medications and dosages..."
                        value={newRecord.medications}
                        onChange={(e) =>
                          setNewRecord((prev) => ({ ...prev, medications: e.target.value }))
                        }
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Additional Notes</label>
                      <Textarea
                        placeholder="Any additional observations or notes..."
                        value={newRecord.notes}
                        onChange={(e) =>
                          setNewRecord((prev) => ({ ...prev, notes: e.target.value }))
                        }
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* VITALS */}
                <TabsContent value="vitals" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormInput
                      id="weight"
                      name="weight"
                      type="number"
                      label="Weight (lbs)"
                      value={newRecord.weight}
                      onChange={(e) =>
                        setNewRecord((prev) => ({ ...prev, weight: Number(e.target.value) }))
                      }
                      placeholder="0.0"
                    />

                    <FormInput
                      id="temperature"
                      name="temperature"
                      type="number"
                      label="Temperature (°F)"
                      value={newRecord.temperature}
                      onChange={(e) =>
                        setNewRecord((prev) => ({
                          ...prev,
                          temperature: Number(e.target.value),
                        }))
                      }
                      placeholder="101.0"
                    />

                    <FormInput
                      id="heart_rate"
                      name="heart_rate"
                      type="number"
                      label="Heart Rate (bpm)"
                      value={newRecord.heart_rate}
                      onChange={(e) =>
                        setNewRecord((prev) => ({
                          ...prev,
                          heart_rate: Number(e.target.value),
                        }))
                      }
                      placeholder="80"
                    />

                    <FormInput
                      id="respiratory_rate"
                      name="respiratory_rate"
                      type="number"
                      label="Respiratory Rate"
                      value={newRecord.respiratory_rate}
                      onChange={(e) =>
                        setNewRecord((prev) => ({
                          ...prev,
                          respiratory_rate: Number(e.target.value),
                        }))
                      }
                      placeholder="20"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="follow_up_required"
                        checked={!!newRecord.follow_up_required}
                        onChange={(e) =>
                          setNewRecord((prev) => ({
                            ...prev,
                            follow_up_required: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="follow_up_required" className="text-sm">
                        Follow-up required
                      </label>
                    </div>

                    {newRecord.follow_up_required && (
                      <FormInput
                        id="follow_up_date"
                        name="follow_up_date"
                        type="date"
                        label="Follow-up Date"
                        value={newRecord.follow_up_date ?? ""}
                        onChange={(e) =>
                          setNewRecord((prev) => ({
                            ...prev,
                            follow_up_date: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRecord}>Add Record</Button>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords?.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No health records found</h3>
              <p className="text-gray-500 mb-4">Start by adding your pet's first health record</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Record
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredRecords?.map(record => {
            const pet = record.pet;

            return (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={pet?.image} alt={pet?.name} />
                        <AvatarFallback>{pet?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{record.title}</h3>
                          <Badge className={getTypeColor(record.type)}>
                            {recordTypes.find(t => t.value === record.type)?.label || record.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {pet?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(record.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {record.user?.name || "Unknown Vet"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast.info(`Viewing detailed record for ${pet?.name}`);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast.success(`Downloading record: ${record.title}`);
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="vitals">Vitals</TabsTrigger>
                      <TabsTrigger value="treatment">Treatment</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>

                    {/* Summary */}
                    <TabsContent value="summary" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Diagnosis</h4>
                          <p className="text-sm text-gray-600">
                            {record.diagnosis || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Treatment</h4>
                          <p className="text-sm text-gray-600">
                            {record.treatment || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Vitals */}
                    <TabsContent value="vitals" className="mt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Weight className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">Weight</p>
                            <p className="text-sm text-gray-600">{record.weight} kg</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-red-500" />
                          <div>
                            <p className="text-sm font-medium">Temperature</p>
                            <p className="text-sm text-gray-600">{record.temperature} °C</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-pink-500" />
                          <div>
                            <p className="text-sm font-medium">Heart Rate</p>
                            <p className="text-sm text-gray-600">{record.heart_rate} bpm</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">Respiratory</p>
                            <p className="text-sm text-gray-600">{record.respiratory_rate}/min</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Treatment */}
                    <TabsContent value="treatment" className="mt-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-1">Medications</h4>
                          <p className="text-sm text-gray-600">
                            {record.medications || "None prescribed"}
                          </p>
                        </div>
                        {record.follow_up_required ? (
                          <div>
                            <h4 className="font-medium mb-1">Follow-up Required</h4>
                            <p className="text-sm text-gray-600">
                              {record.follow_up_date
                                ? `Scheduled for ${new Date(record.follow_up_date).toLocaleDateString()}`
                                : "Date to be determined"}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </TabsContent>

                    {/* Notes */}
                    <TabsContent value="notes" className="mt-4">
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {record.notes || "No additional notes"}
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            );
          })

        )}
      </div>
    </div>
  );
}