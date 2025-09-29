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
}

export interface IPet {
  age: number;
  allergies: string;
  birthdate: string;
  breed: string;
  created_at: string
  emergency_contact: string;
  id: string;
  imageUrl: string;
  medical_condition: string;
  name: string;
  notes: string;
  phone: string;
  species: string;
  updated_at: string;
  user: IUser[];
  user_id: number;
  weight: string;
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
