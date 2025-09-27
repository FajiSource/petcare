import { chownSync } from "fs";
import { INewHealthRecord } from "../lib/types";
import apiService from "./api/apiService";

export const addRecord = async (data: INewHealthRecord) => {
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

export const getAllVetRecords = async () => {
    try {
        const res = await apiService.get('/records/vet')
        console.log(res)
        if (res.data.success) {
            console.log(res.data.records)
            return res.data.records
        }
        return []
    } catch (error) {
        console.log('fetch all records error: ', error)
        throw error
    }
}

