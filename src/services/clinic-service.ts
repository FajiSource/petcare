import { IClinic, INewClinic } from "../lib/types";
import apiService from "./api/apiService";


export const createNewClinic = async (data: INewClinic) => {
  try {
    const res = await apiService.post('/admin/clinics', data);
    if (res.data.success) {
      return res.data.clinic;
    }
    return null;
  } catch (error) {
    console.error('Error creating clinic:', error);
    throw error;
  }
};

export const getClinics = async () => {
  try {
    const res = await apiService.get('/admin/clinics');
    return res.data;
  } catch (error) {
    console.error('Error fetching clinics:', error);
    throw error;
  }
};

export const getClinicById = async (id: string) => {
  try {
    const res = await apiService.get(`/admin/clinics/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching clinic:', error);
    throw error;
  }
};

export const updateClinic = async (id: string, data:IClinic|any) => {
  try {
    const res = await apiService.put(`/admin/clinics/${id}`, data);
    if (res.data.success) {
      return res.data.clinic;
    }
    return null;
  } catch (error) {
    console.error('Error updating clinic:', error);
    throw error;
  }
};

export const deleteClinic = async (id: string) => {
  try {
    const res = await apiService.delete(`/admin/clinics/${id}`);
    return res.data.success;
  } catch (error) {
    console.error('Error deleting clinic:', error);
    throw error;
  }
};
