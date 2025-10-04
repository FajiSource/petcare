import { IPatient, INewPatient } from "../lib/types";
import apiService from "./api/apiService";

export const createNewPatient = async (data: INewPatient) => {
  try {
    const res = await apiService.post('/patients', data);
    return res.data; 
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};


export const getPatients = async () => {
  try {
    const res = await apiService.get('/patients');
    return res.data; 
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};


export const getVetPatients = async () => {
  try {
    const res = await apiService.get('/patients/vet');
    return res.data.patients; 
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};


export const getPatientById = async (id: string) => {
  try {
    const res = await apiService.get(`/patients/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
};

export const updatePatient = async (id: string, data: Partial<IPatient>) => {
  try {
    const res = await apiService.put(`/patients/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};


export const deletePatient = async (id: string) => {
  try {
    const res = await apiService.delete(`/patients/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};
