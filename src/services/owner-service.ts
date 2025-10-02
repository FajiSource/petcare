import apiService from "./api/apiService"

export const getOwnerRecords = async () => {
    try {
        const res = await apiService.get('/records/owner')
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

