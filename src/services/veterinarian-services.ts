import { INewRecord } from "../lib/types";
import apiService from "./api/apiService";

export const addRecord = async (data: INewRecord) => {
    try {
        const res = await apiService.post('/records', data)

        if (res.data.status === 'success') {
            return res.data.record
        }
        return []
    } catch (error) {
        console.log("add record erro: ", error)
        throw error;
    }
}

export const getAllRecords = async () => {
    try {
        const res = await apiService.get('/records')
        if (res.data.status === 'success') {
            return res.data.record
        }
        return []
    } catch (error) {
        console.log('fetch all records error: ', error)
        throw error
    }
}
