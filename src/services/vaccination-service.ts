import { INewVaccination, IVaccination } from "../lib/types";
import apiService from "./api/apiService";



export const getVaccinations = async () => {
  try {
    const res = await apiService.get("/vaccinations");
    return res.data;
  } catch (error) {
    console.error("Error fetching vaccinations:", error);
    throw error;
  }
};
export const getOwnerVaccinations = async () => {
  try {
    const res = await apiService.get("/vaccinations/owner");
    return res.data;
  } catch (error) {
    console.error("Error fetching vaccinations:", error);
    throw error;
  }
};

export const addNewVaccination = async (data: INewVaccination) => {
  try {
    const payload = {
      ...data,
      administered_date: data.administered_date
        ? data.administered_date.toISOString().substring(0, 10)
        : null,
      next_due_date: data.next_due_date
        ? data.next_due_date.toISOString().substring(0, 10)
        : null,
    };

    const res = await apiService.post("/vaccinations", payload);
    return res.data;
  } catch (error) {
    console.error("Error adding vaccination:", error);
    throw error;
  }
};

export const updateVaccination = async (id: number, data: IVaccination) => {
  try {
    const payload = {
      ...data,
      administered_date: data.administered_date
        ? data.administered_date.toString().substring(0, 10)
        : null,
      next_due_date: data.next_due_date
        ? data.next_due_date.toString().substring(0, 10)
        : null,
    };

    const res = await apiService.put(`/vaccinations/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("Error updating vaccination:", error);
    throw error;
  }
};

export const deleteVaccination = async (id: number) => {
  try {
    const res = await apiService.delete(`/vaccinations/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting vaccination:", error);
    throw error;
  }
};
