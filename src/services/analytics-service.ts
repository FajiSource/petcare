import apiService from "./api/apiService";

// admin 
export const getAdminTotals = async () => {
    try {
        const res = await apiService.get('/admin/analytics/totals');
        return res.data?.data;
    } catch (error) {
        throw error;
    }
}

export const getUserActivitySummary = async () => {
    try {
        const res = await apiService.get('/admin/analytics/user-activities');
        return res?.data;
    } catch (error) {
        throw error;
    }
}

export const getTopPerformingClinics = async () => {
    try {
        const res = await apiService.get('/admin/analytics/top-clinics');
        return res?.data;
    } catch (error) {
        throw error;
    }
}


export const getMonthlyAppoinments = async () => {
    try {
        const res = await apiService.get('/admin/analytics/monthly-appointments');
        return res.data?.data;
    } catch (error) {
        throw error;
    }
}

export const getTopVets = async () => {
    try {
        const res = await apiService.get('/admin/analytics/vet-records');
        return res.data?.data;
    } catch (error) {
        throw error;
    }
}

export const getUserTrends = async () => {
    try {
        const res = await apiService.get('/admin/analytics/user-trends');
        return res.data?.data;
    } catch (error) {
        throw error;
    }
}

export const getRecentUserRegistration = async () => {
    try {
        const res = await apiService.get('/admin/analytics/recent-user-registrations');
        return res.data?.data;
    } catch (error) {
        throw error;
    }
}

// veterinarian

export const getVetTotals = async () => {
    try {
        const res = await apiService.get('/vet/analytics/totals');
        return res?.data;
    } catch (error) {
        throw error;
    }
}



