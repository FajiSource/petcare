import { IAppointment, INewAppointment } from "../lib/types";
import apiService from "./api/apiService";

export const createNewAppointment = async (data: INewAppointment) => {
    try {
        const res = await apiService.post('/appointments', data);
        if (res.data.success) {
            return res.data.appointment;
        }
        return null;
    } catch (error) {
        console.error('Error adding appointment:', error);
        throw error;
    } 1
};

export const updateAppointmentStatus = async (data: { id: number, status: string }) => {
    try {
        const res = await apiService.post(`/appointments/update-status`, data);
        if (res.data.success) {
            return res.data;
        }
        return null;
    } catch (error) {
        console.error('Error updating appointment:', error);
        throw error;
    } 1
};


export const getOwnerAppointments = async () => {
    try {
        const res = await apiService.get("/appointments/owner");
        console.log("appointments: ", res)
        return res.data.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getVetAAppointments = async () => {
    try {
        const res = await apiService.get("/appointments/vet");
        return res.data.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getAllAppointments = async () => {
    try {
        const res = await apiService.get("/appointments");
        return res.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const updateAppointment = async (id: number, data: Partial<IAppointment>) => {
    try {
        const res = await apiService.put(`/appointments/${id}`, data);
        if (res.data.success) {
            return res.data.appointment;
        }
        return null;
    } catch (error) {
        console.error('Error updating appointment:', error);
        throw error;
    }
};

export const rescheduleAppointment = async (id: number, data: { date: string; time: string }) => {
    try {
        const res = await apiService.post(`/appointments/${id}/reschedule`, data);
        if (res.data.status) {
            return res.data.data; // the updated appointment
        }
        return null;
    } catch (error) {
        console.error("Error rescheduling appointment:", error);
        throw error;
    }
};

export const cancelAppointment = async (id: number) => {
    try {
        const res = await apiService.post(`/appointments/${id}/cancel`);
        if (res.data.status) {
            return res.data.data;
        }
        return null;
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        throw error;
    }
};