import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { INewPatient, IOption, IPatient } from '../../lib/types';
import { useAddNewPet, useCreateNewPatient, useOwnerOptions } from '../../lib/react-query/QueriesAndMutations';
import { FormInput } from '../FormInput';
import { Plus } from 'lucide-react';

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientAdded?: (patient: IPatient) => void;
}

const INITIAL_PATIENT: INewPatient = {
  status: 'healthy',
  name: '',
  species: 'Dog',
  owner_id: null,
  breed: '',
  gender: 'male',
  date_of_birth: new Date(),
  age: 0,
  weight: 0,
  color: '',
  microchip_id: '',
  owner_phone: '',
  owner_address: '',
  emergency_contact: { name: '', phone: '', relationship: '' },
  allergies: [],
  conditions: [],
  notes: '',
  image: null
};

export function AddPatientDialog({ open, onOpenChange, onPatientAdded }: AddPatientDialogProps) {
  const { mutateAsync: addNewPet } = useAddNewPet();
  const { data: owners } = useOwnerOptions();

  const [selectedOwner, setSelectedOwner] = useState<IOption | null>(null);
  const [newPatient, setNewPatient] = useState<Partial<INewPatient>>(INITIAL_PATIENT);
  const [date_of_birth, setDateOfBirth] = useState<Date>(new Date());
  const [allergyInput, setAllergyInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleAddPatient = async () => {
    try {
      if (!selectedOwner?.id) {
        toast.error('Please select an owner.');
        return;
      }

      const age = calculateAge(date_of_birth);

      const patient: INewPatient = {
        owner_id: selectedOwner.id as number,
        status: newPatient.status,
        name: newPatient.name || '',
        species: newPatient.species || 'Dog',
        breed: newPatient.breed || '',
        gender: newPatient.gender || 'male',
        date_of_birth,
        age,
        weight: newPatient.weight || 0,
        color: newPatient.color || '',
        microchip_id: newPatient.microchip_id || '',
        owner_phone: newPatient.owner_phone || '',
        owner_address: newPatient.owner_address || '',
        emergency_contact: newPatient.emergency_contact || { name: '', phone: '', relationship: '' },
        allergies: newPatient.allergies || [],
        conditions: newPatient.conditions || [],
        notes: newPatient.notes || '',
        image: imageFile as File
      };

      await addNewPet(patient)

      // Reset form
      setNewPatient(INITIAL_PATIENT);
      setSelectedOwner(null);
      setDateOfBirth(new Date());
      setAllergyInput('');
      setConditionInput('');
      setImageFile(null);

      onOpenChange(false);
      toast.success('Patient added successfully!');
    } catch (error) {
      toast.error('Something went wrong.');
      console.error(error);
    }
  };

  const addAllergy = () => {
    if (allergyInput.trim()) {
      setNewPatient({
        ...newPatient,
        allergies: [...(newPatient.allergies || []), allergyInput.trim()]
      });
      setAllergyInput('');
    }
  };

  const removeAllergy = (index: number) => {
    setNewPatient({
      ...newPatient,
      allergies: newPatient.allergies?.filter((_, i) => i !== index) || []
    });
  };

  const addCondition = () => {
    if (conditionInput.trim()) {
      setNewPatient({
        ...newPatient,
        conditions: [...(newPatient.conditions || []), conditionInput.trim()]
      });
      setConditionInput('');
    }
  };

  const removeCondition = (index: number) => {
    setNewPatient({
      ...newPatient,
      conditions: newPatient.conditions?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pet Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Pet Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="petName">Pet Name *</Label>
                <Input
                  id="petName"
                  value={newPatient.name || ''}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  placeholder="Enter pet name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="species">Species *</Label>
                <Select
                  value={newPatient.species}
                  onValueChange={(value) => setNewPatient({ ...newPatient, species: value })}
                >
                  <SelectTrigger id="species">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  value={newPatient.breed || ''}
                  onChange={(e) => setNewPatient({ ...newPatient, breed: e.target.value })}
                  placeholder="Enter breed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={newPatient.gender}
                  onValueChange={(value) => setNewPatient({ ...newPatient, gender: value })}
                >
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <FormInput
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  label="Date of Birth"
                  value={newPatient.date_of_birth ? newPatient.date_of_birth.toISOString().substring(0, 10) : ''}
                  onChange={(e) => {
                    const d = new Date(e.target.value);
                    setDateOfBirth(d);
                    setNewPatient({ ...newPatient, date_of_birth: d });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={newPatient.age || 0}
                  onChange={(e) => setNewPatient({ ...newPatient, age: parseInt(e.target.value) || 0 })}
                  placeholder="Age in years"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={newPatient.weight || ''}
                  onChange={(e) => setNewPatient({ ...newPatient, weight: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter weight"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={newPatient.color || ''}
                  onChange={(e) => setNewPatient({ ...newPatient, color: e.target.value })}
                  placeholder="Enter color/markings"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="microchip_id">Microchip ID</Label>
                <Input
                  id="microchip_id"
                  value={newPatient.microchip_id || ''}
                  onChange={(e) => setNewPatient({ ...newPatient, microchip_id: e.target.value })}
                  placeholder="Enter microchip number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Pet Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                />
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Owner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner">Select Owner *</Label>
                <Select
                  value={selectedOwner?.id ? String(selectedOwner.id) : ''}
                  onValueChange={(value) => {
                    const owner = owners?.find((o) => o.id === Number(value));
                    setSelectedOwner(owner || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners?.map((owner) => (
                      <SelectItem key={owner.id} value={String(owner.id)}>{owner.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner_phone">Phone *</Label>
                <Input
                  id="owner_phone"
                  value={newPatient.owner_phone || ''}
                  onChange={(e) => setNewPatient({ ...newPatient, owner_phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner_address">Address *</Label>
                <Input
                  id="owner_address"
                  value={newPatient.owner_address || ''}
                  onChange={(e) => setNewPatient({ ...newPatient, owner_address: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['name', 'phone', 'relationship'].map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={`emergency_${field}`}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  <Input
                    id={`emergency_${field}`}
                    value={newPatient.emergency_contact?.[field as keyof typeof newPatient.emergency_contact] || ''}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        emergency_contact: {
                          ...newPatient.emergency_contact!,
                          [field]: e.target.value
                        }
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Medical Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Medical Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={newPatient.status}
                  onValueChange={(value) => setNewPatient({ ...newPatient, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {['healthy', 'treatment', 'critical', 'follow-up', 'chronic'].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Allergies */}
              <div className="space-y-2">
                <Label>Allergies</Label>
                <div className="flex gap-2">
                  <Input
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    placeholder="Add allergy"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                  />
                  <Button type="button" onClick={addAllergy} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newPatient.allergies?.map((a, i) => (
                    <div key={i} className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center gap-2">
                      {a}<button type="button" onClick={() => removeAllergy(i)}>×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditions */}
              <div className="space-y-2">
                <Label>Existing Conditions</Label>
                <div className="flex gap-2">
                  <Input
                    value={conditionInput}
                    onChange={(e) => setConditionInput(e.target.value)}
                    placeholder="Add condition"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                  />
                  <Button type="button" onClick={addCondition} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newPatient.conditions?.map((c, i) => (
                    <div key={i} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center gap-2">
                      {c}<button type="button" onClick={() => removeCondition(i)}>×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={newPatient.notes || ''}
                  onChange={(e) => setNewPatient({ ...newPatient, notes: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddPatient}>Add Patient</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
