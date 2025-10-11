import { INewPrescription, IPrescription } from "../lib/types";
import apiService from "./api/apiService";

export const addNewPrescription = async (data: INewPrescription) => {
    try {
        const res = await apiService.post('/prescriptions', data);
        if (res.data.success) {
            return res.data.prescription;
        }
        return null;
    } catch (error) {
        console.error('Error adding prescription:', error);
        throw error;
    } 1
};

export const getPrescription = async () => {
    try {
        const res = await apiService.get('/prescriptions');
        if (res.data.success) {
            return res.data.prescriptions;
        }
        return [];
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        throw error;
    }
};

export const getVetPrescriptionRecords = async () => {
    try {
        const res = await apiService.get('/prescriptions/vet');
        if (res.data.success) {
            return res.data.prescriptions;
        }
        return [];
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        throw error;
    }
};

export const getOwnerPrescriptionRecords = async () => {
    try {
        const res = await apiService.get('/prescriptions/owner');
        if (res.data.success) {
            return res.data.prescriptions;
        }
        return [];
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        throw error;
    }
};



export const updateReFill = async ({
    prescriptionId,
    status
}: { prescriptionId: number | string, status: 'refilled' | 'refill_needed' }) => {
    try {
        const res = await apiService.post(`/prescriptions/refill/${prescriptionId}`, {
            status: status
        });
        if (res.data.success) {
            return res.data.prescriptions;
        }
        return [];
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        throw error;
    }
};

export const updatePrescription = async ({ prescriptionId, data }:
    {
        prescriptionId: number | string,
        data: IPrescription
    }
) => {
    try {
        const res = await apiService.put(`/prescriptions/${prescriptionId}`, data);
        if (res.data.success) {
            return res.data.prescription;
        }
        return null;
    } catch (error) {
        console.error("Error updating prescription:", error);
        throw error;
    }
};