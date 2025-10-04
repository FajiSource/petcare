import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { INewPatient, IOption, IPatient, IPet } from "../../lib/types";
import { useOwnerOptions, useUpdatePet } from "../../lib/react-query/QueriesAndMutations";
import { FormInput } from "../FormInput";
import { Plus } from "lucide-react";

interface UpdatePatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: IPet | null;
  onPatientUpdated?: (patient: IPet) => void;
}

export function UpdatePatientDialog({
  open,
  onOpenChange,
  patient,
  onPatientUpdated,
}: UpdatePatientDialogProps) {
  const { mutateAsync:updatePet } = useUpdatePet();
  const { data: owners } = useOwnerOptions();

  const [selectedOwner, setSelectedOwner] = useState<IOption | null>(null);
  const [updatedPatient, setUpdatedPatient] = useState<Partial<INewPatient>>({});
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [nextAppointment, setNextAppointment] = useState<Date | null>(null);
  const [allergyInput, setAllergyInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Emergency Contact
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    phone: "",
    relationship: "",
  });

  useEffect(() => {
    if (patient) {
      setUpdatedPatient({ ...patient });
      setDateOfBirth(patient.date_of_birth ? new Date(patient.date_of_birth) : new Date());
      setNextAppointment(patient.nextAppointment ? new Date(patient.nextAppointment) : null);
      setSelectedOwner(
        patient.owner_id
          ? { id: patient.owner_id, name: patient.owner_name || "" }
          : null
      );
      setEmergencyContact(
        patient.emergency_contact
          ? typeof patient.emergency_contact === "string"
            ? JSON.parse(patient.emergency_contact)
            : patient.emergency_contact
          : { name: "", phone: "", relationship: "" }
      );
    }
  }, [patient]);

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleUpdatePatient = async () => {
    if (!patient) return;
    if (!selectedOwner?.id) {
      toast.error("Please select an owner.");
      return;
    }

    try {
      const age = calculateAge(dateOfBirth);

      const data: INewPatient = {
        owner_id: selectedOwner.id as number,
        status: updatedPatient.status || "healthy",
        name: updatedPatient.name || "",
        species: updatedPatient.species || "Dog",
        breed: updatedPatient.breed || "",
        gender: updatedPatient.gender || "male",
        date_of_birth: dateOfBirth,
        age,
        weight: updatedPatient.weight || 0,
        color: updatedPatient.color || "",
        microchip_id: updatedPatient.microchip_id || "",
        owner_phone: updatedPatient.owner_phone || "",
        owner_address: updatedPatient.owner_address || "",
        emergency_contact: emergencyContact,
        allergies: updatedPatient.allergies || [],
        conditions: updatedPatient.conditions || [],
        notes: updatedPatient.notes || "",
        nextAppointment: nextAppointment || null,
        image: imageFile as File,
      };

      const res = await updatePet({ id: patient.id, data });

      toast.success("Patient updated successfully!");
      onPatientUpdated?.(res);
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to update patient");
      console.error(err);
    }
  };

  // Allergy helpers
  const addAllergy = () => {
    if (allergyInput.trim()) {
      setUpdatedPatient({
        ...updatedPatient,
        allergies: [...(updatedPatient.allergies || []), allergyInput.trim()],
      });
      setAllergyInput("");
    }
  };
  const removeAllergy = (i: number) => {
    setUpdatedPatient({
      ...updatedPatient,
      allergies: updatedPatient.allergies?.filter((_, idx) => idx !== i) || [],
    });
  };

  // Condition helpers
  const addCondition = () => {
    if (conditionInput.trim()) {
      setUpdatedPatient({
        ...updatedPatient,
        conditions: [...(updatedPatient.conditions || []), conditionInput.trim()],
      });
      setConditionInput("");
    }
  };
  const removeCondition = (i: number) => {
    setUpdatedPatient({
      ...updatedPatient,
      conditions: updatedPatient.conditions?.filter((_, idx) => idx !== i) || [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Patient</DialogTitle>
        </DialogHeader>

        {/* Patient Info */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <FormInput label="Name" value={updatedPatient.name || ""} onChange={(e) => setUpdatedPatient({ ...updatedPatient, name: e.target.value })} />
          <FormInput label="Species" value={updatedPatient.species || ""} onChange={(e) => setUpdatedPatient({ ...updatedPatient, species: e.target.value })} />
          <FormInput label="Breed" value={updatedPatient.breed || ""} onChange={(e) => setUpdatedPatient({ ...updatedPatient, breed: e.target.value })} />
          <FormInput label="Weight" type="number" value={updatedPatient.weight || ""} onChange={(e) => setUpdatedPatient({ ...updatedPatient, weight: e.target.value })} />
          <FormInput label="Color" value={updatedPatient.color || ""} onChange={(e) => setUpdatedPatient({ ...updatedPatient, color: e.target.value })} />
          <FormInput label="Microchip ID" value={updatedPatient.microchip_id || ""} onChange={(e) => setUpdatedPatient({ ...updatedPatient, microchip_id: e.target.value })} />

          {/* Gender */}
          <div>
            <Label>Gender</Label>
            <Select
              value={updatedPatient.gender || ""}
              onValueChange={(val) => setUpdatedPatient({ ...updatedPatient, gender: val })}
            >
              <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select
              value={updatedPatient.status || "healthy"}
              onValueChange={(val) => setUpdatedPatient({ ...updatedPatient, status: val })}
            >
              <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="chronic">Chronic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date of Birth */}
          <div>
            <Label>Date of Birth</Label>
            <Input type="date" value={dateOfBirth.toISOString().split("T")[0]} onChange={(e) => setDateOfBirth(new Date(e.target.value))} />
          </div>

          {/* Next Appointment */}
          <div>
            <Label>Next Appointment</Label>
            <Input type="date" value={nextAppointment ? nextAppointment.toISOString().split("T")[0] : ""} onChange={(e) => setNextAppointment(e.target.value ? new Date(e.target.value) : null)} />
          </div>
        </div>

        {/* Owner */}
        <div className="mt-4">
          <Label>Owner</Label>
          <Select
            value={selectedOwner?.id?.toString() || ""}
            onValueChange={(val) => {
              const owner = owners?.find((o) => o.id.toString() === val) || null;
              setSelectedOwner(owner);
            }}
          >
            <SelectTrigger><SelectValue placeholder="Select Owner" /></SelectTrigger>
            <SelectContent>
              {owners?.map((o) => (
                <SelectItem key={o.id} value={o.id.toString()}>{o.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Emergency Contact */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <FormInput label="Emergency Contact Name" value={emergencyContact.name} onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })} />
          <FormInput label="Emergency Contact Phone" value={emergencyContact.phone} onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })} />
          <FormInput label="Relationship" value={emergencyContact.relationship} onChange={(e) => setEmergencyContact({ ...emergencyContact, relationship: e.target.value })} />
        </div>

        {/* Allergies */}
        <div className="mt-4">
          <Label>Allergies</Label>
          <div className="flex gap-2">
            <Input value={allergyInput} onChange={(e) => setAllergyInput(e.target.value)} />
            <Button type="button" onClick={addAllergy}><Plus size={16} /></Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {updatedPatient.allergies?.map((a, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded cursor-pointer" onClick={() => removeAllergy(i)}>{a} ✕</span>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div className="mt-4">
          <Label>Conditions</Label>
          <div className="flex gap-2">
            <Input value={conditionInput} onChange={(e) => setConditionInput(e.target.value)} />
            <Button type="button" onClick={addCondition}><Plus size={16} /></Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {updatedPatient.conditions?.map((c, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded cursor-pointer" onClick={() => removeCondition(i)}>{c} ✕</span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4">
          <Label>Notes</Label>
          <Textarea value={updatedPatient.notes || ""} onChange={(e) => setUpdatedPatient({ ...updatedPatient, notes: e.target.value })} />
        </div>

        {/* Image Upload */}
        <div className="mt-4">
          <Label>Upload Image</Label>
          <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleUpdatePatient}>Update Patient</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdatePatientDialog;
