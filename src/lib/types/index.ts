import { useState, forwardRef } from 'react';

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  type: string;
  date: string;
  time: string;
  veterinarian: string;
  clinic: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface FormInputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface IVeterinarian {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  veterinarian_info: {
    user_id: string;
    phone_number: string;
    license_number: string;
    specialization: string;
    clinic: string;
    years_of_experience: number;
    education: string;
    bio: string;
    imageUrl?: string;
  };
}


export interface HealthRecord {
  id: string;
  petId: string;
  petName: string;
  type: 'checkup' | 'diagnosis' | 'treatment' | 'test' | 'surgery' | 'emergency';
  title: string;
  date: string;
  veterinarian: string;
  clinic: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string;
  notes: string;
  followUpRequired: boolean;
  followUpDate?: string;
  attachments?: string[];
  vitals?: {
    weight: number;
    temperature: number;
    heartRate: number;
    respiratoryRate: number;
  };
}


export interface INewUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'veterinarian' | 'pet_owner';
  status: 'active' | 'inactive' | "suspended";
}
export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'veterinarian' | 'pet_owner';
  status: 'active' | 'inactive' | "suspended";
  created_at: string,
  updated_at: string
}
export interface INewVetUser {
  name: string;
  email: string;
  phone_number: string;
  license_number: string;
  specialization: string;
  clinic: string;
  years_of_experience: number;
  education: string;
  bio: string;

  password: string;
  imageUrl?: File | null;
}
export interface INewPet {
  name: string,
  species: string,
  breed: string,
  age: string,
  weight: string,
  birthdate: string,
  user_id: string,
  phone: string,
  emergency_contact: string,
  allergies: string,
  medical_condition: string,
  notes: string,
  image: File | null
}
export interface IAdminTotals {
  users: number;
  pets: number;
  vets: number;
  appointments: number;
  completed_appointments: number;
  totalAppointments: number;
  activeAppointments: number;
  completedAppointments: number;
}

export interface IEmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface IPet {
  id: number;
  owner_id: number;
  vet_id?: number;

  name: string;
  species: string;
  breed: string;
  gender: string;
  date_of_birth: string;
  age: number;
  weight: string;
  color: string;
  microchip_id?: string;

  imageUrl?: string;
  image?: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  owner_address?: string;

  emergency_contact?: IEmergencyContact;

  allergies?: string[];
  conditions?: string[];
  notes?: string;

  created_at: string;
  updated_at: string;

  user: IUser;
  status: string;
  nextAppointment: string;       
  registrationDate: string;     
}


export interface IHealthRecord {
  id: number;
  pet_id: number;
  vet_id: number;
  appointment_id?: number | null;

  title: string;
  type: string;
  date: string;

  diagnosis: string;
  treatment: string;
  medications: string;
  notes: string;

  weight: string;
  temperature: string;
  heart_rate: number;
  respiratory_rate: number;

  follow_up_required: boolean | number;
  follow_up_date?: string | null;

  created_at: string;
  updated_at: string;

  pet: IPet;
}

export interface INewHealthRecord {
  pet_id: number;
  title: string;
  date: string;
  type: string;
  diagnosis: string;
  treatment: string;
  medications: string;
  notes: string;
  weight: number;
  temperature: number;
  heart_rate: number;
  respiratory_rate: number;
  follow_up_required?: boolean | null;
  follow_up_date?: string | null;
}


export interface INewPrescription {
  pet_id: number;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribed_date: string;
  start_date: string;
  end_date: string;
  instructions: string;
  side_effects: string;
  refills_remaining: number;
  total_refills: number;
  status: string;
  category: string;
  manufacturer: string;
  cost: number;
}

export interface IPrescription {
  id: number;
  vet_id: number;
  pet_id: number;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribed_date: string;
  start_date: string;
  end_date: string;
  veterinarian: string;
  instructions: string;
  side_effects: string;
  refills_remaining: number;
  total_refills: number;
  status: string;
  category: string;
  manufacturer: string;
  cost: number;
  created_at: string;
  updated_at: string;
  pet: IPet;
}


export interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface IAttachment {
  file_name: string;
  url: string;
}

export interface IMedicalNote {
  id: number;
  vet_id: number;
  date: string;
  time: string;
  patient_id: number;
  patient_name: string;
  patient_species: string;
  patient_breed?: string | null;
  owner_name: string;
  type: string;
  priority: string;
  title: string;
  complaint?: string | null;
  findings?: string | null;
  diagnosis?: string | null;
  treatment?: string | null;
  recommendations?: string | null;
  follow_up?: string | null;
  medications: IMedication[];
  attachments: IAttachment[];
  status: string;
  tags: string[];
  patient_image_url?: string | null;
  created_at: string;
  updated_at: string;
  image: string;
}

export interface INewMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface INewAttachment {
  file_name: string;
  url: string;
}

export interface INewMedicalNote {
  patient_id: number;
  type: string;
  priority: string;
  status: string;
  title: string;
  complaint?: string | null;
  findings?: string | null;
  diagnosis?: string | null;
  treatment?: string | null;
  recommendations?: string | null;
  follow_up?: string | null;
  medications: INewMedication[];
  attachments: INewAttachment[];
  tags: string[];
  date: string;
  time: string;
}


export interface INewAppointment {
  veterinarianId?: number | null;

  petName: string;
  species: string;
  breed?: string | null;

  type: string;
  clinic: string;
  date: string;
  time: string;

  notes?: string | null;
  priority?: "high" | "medium" | "low";
  duration?: number | null;
  condition?: string | null;
  symptoms?: string[] | null;
  timeWaiting?: string | null;

  ownerPhone?: string;
  ownerAddress?: string;
}



export interface IAppointment {
  id?: number;

  pet_id: number;
  veterinarian_id: number;

  type: string;
  clinic: string;
  date: string;
  time: string;

  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "urgent";

  duration?: number | null;
  notes?: string | null;
  priority: string;
  condition?: string | null;
  symptoms?: string[] | null;
  time_waiting?: string | null;

  created_at: string;
  updated_at: string;

  pet: IPet;
  veterinarian: IUser;
}

export interface ICurrentRole {
  admin: boolean,
  veterinarian: boolean,
  pet_owner: boolean,
}

export interface IClinic {
  id?: number | string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;

  operatingHours: Record<string, string>;
  services: string[];
  city: string;
  state: string;
  zipCode: string;
  description: string;
  licenseNumber: string;
  website?: string | null;
  totalStaff: number;
  totalPatients: number;
  establishedDate: string;
  emergencyAvailable: boolean;

  created_at?: string;
  updated_at?: string;
}

export interface INewClinic {
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;

  operatingHours?: Record<string, string>;
  services?: string[];
  city: string;
  state: string;
  zipCode: string;
  description?: string;
  licenseNumber: string;
  website?: string | null;
  totalStaff?: number;
  totalPatients?: number;
  establishedDate: string;
  emergencyAvailable?: boolean;
  created_at?: string;
  updated_at?: string;
}


export interface ITopVet {
  id: number;
  name: string;
  total_appointments: number;
  specialization: string;
}

export interface IUserTrend {
  month: string;
  total: number;
  admins: string | number;
  veterinarians: string | number;
  petOwners: string | number;
}

export interface IRecentUser {
  name: string;
  id: number;
  email: string;
  role: string;
}


// patient
export interface INewPatient {
  owner_id?: number | null;
  vetId?: number | null;

  name: string;
  species: string;
  breed?: string | null;
  gender?: "male" | "female" | "unknown";
  date_of_birth?: Date;
  status: string;
  age?: number;
  weight?: number;
  color?: string;
  microchip_id?: string;

  ownerName?: string;
  owner_phone: string;
  ownerEmail?: string | null;
  owner_address: string;

  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  } | null;

  allergies?: string[] | null;
  conditions?: string[] | null;
  notes?: string | null;
  image: File | null;
  nextAppointment?: Date | string | null
}

export interface IEmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface IPatient {
  id: number;
  ownerId?: number | null;
  vetId?: number | null;

  name: string;
  species: string;
  breed?: string | null;
  gender: "male" | "female" | "unknown";
  dateOfBirth?: string | null;
  age?: number | null;
  weight?: number | null;
  color?: string | null;
  microchipId?: string | null;

  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string | null;
  ownerAddress: string;

  emergencyContact?: IEmergencyContact | null;
  allergies?: string[] | null;
  conditions?: string[] | null;
  notes?: string | null;

  createdAt: string;
  updatedAt: string;

  owner?: IUser;
  vet?: IUser;
}

export interface IOption {
  id: number | string;
  name: string;
}

export interface INewVaccination {
  patient_id: number | string;
  patient_species: string;

  vaccine_name: string;
  vaccine_type: "core" | "non-core" | "rabies";

  manufacturer?: string;
  batch_number?: string;
  administered_date: Date;
  next_due_date?: Date;

  administered_by?: string;
  site?: string;
  route?: string;
  dose?: string;
  notes?: string;
  reactions?: string;

  status: "completed" | "due-soon" | "overdue";
}

export interface IVaccination {
  id: number;
  patient_id: number;
  patient_name: string;
  patient_species: string;
  owner_name: string;
  vaccine_name: string;
  vaccine_type: 'core' | 'non-core' | 'rabies';
  manufacturer?: string;
  batch_number?: string;
  administered_date: string;
  next_due_date?: string;
  administered_by?: string;
  site?: string;
  route?: string;
  dose?: string;
  notes?: string;
  reactions?: string;
  status: 'completed' | 'due-soon' | 'overdue';
  created_at: string;
  updated_at: string;
}

