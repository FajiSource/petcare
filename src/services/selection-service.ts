import apiService from "./api/apiService"

export const getPetSelections = async () => {
    try {
        const res = await apiService.get("/selections/pets");
        return res.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getVetsSelections = async () => {
    try {
        const res = await apiService.get("/selections/vets");
        return res.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getClinicsSelections = async () => {
    try {
        const res = await apiService.get("/selections/clinics");
        return res.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}
export const getOwnersSelections = async () => {
    try {
        const res = await apiService.get("/selections/owners");
        return res.data;
    } catch (error) {
        console.log(error)
        throw error
    }
}