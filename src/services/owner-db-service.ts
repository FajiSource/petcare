import apiService from "./api/apiService";

export const getOwnerTotals = async () => {
    try {
        const res = await apiService.get('/owner/analytics/totals');
        return res?.data.data;
    } catch (error) {
        throw error;
    }
}

export const getOwnerLatestPets = async () => {
    try {
        const res = await apiService.get('/owner/analytics/latest-pets');
        console.log(res.data)

        return res?.data.data;
    } catch (error) {
        throw error;
    }
}

export const getOwnerUpcomingAppointments = async () => {
    try {
        const res = await apiService.get('/owner/analytics/upcoming-appointments');
        return res?.data.data;
    } catch (error) {
        throw error;
    }
}
