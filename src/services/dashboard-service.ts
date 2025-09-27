import apiService from "./api/apiService";

export const getAdminTotals = async () => {
    try {
        const res = await apiService.get('/dashboard/totals');
        return res.data?.data;
    } catch (error) {
        throw error;
    }
}