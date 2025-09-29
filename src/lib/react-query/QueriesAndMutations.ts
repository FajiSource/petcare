import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { IAdminTotals, INewHealthRecord, INewMedicalNote, INewPet, INewPrescription, INewUser, INewVetUser } from "../types"
import { addUser, addVetUser, deleteUser, getAllAdmins, getAllVets, getOwners, getUsers, updateStatus } from "../../services/user-service"
import { QUERY_KEYS } from "./queryKeys"
import { getAdminTotals } from "../../services/dashboard-service"
import { addRecord, getAllVetRecords } from "../../services/veterinarian-services"
import { addNewPet, getPets } from "../../services/pet-service"
import { addNewPrescription, getVetPrescriptionRecords } from "../../services/prescription-service"
import { addNewNote, getVetNoteRecords } from "../../services/note-service"


export const useAddNewUser = () => {
    return useMutation({
        mutationFn: async (data: INewUser) => addUser(data)
    })
}

export const useAddNewVetUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: INewVetUser) => addVetUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_VETS] });
        }
    })
}

export const useAdminDashboardTotals = () => {
    return useQuery<IAdminTotals>({
        queryKey: [QUERY_KEYS.ADMIN_DB_TOTALS],
        queryFn: getAdminTotals
    });
}

export const useGetAllAdmins = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_ADMINS],
        queryFn: getAllAdmins
    });
};
export const useGetAllUsers = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_USERS],
        queryFn: getUsers
    });
};
export const useGetAllVets = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_VETS],
        queryFn: getAllVets
    });
};

export const useGetOwners = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_OWNERS],
        queryFn: getOwners
    });
};


export const useAddRecord = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: INewHealthRecord) => addRecord(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_VET_RECORDS] })
        }
    })
}
export const usegetAllVetRecords = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_VET_RECORDS],
        queryFn: getAllVetRecords
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userID }: { userID: string }) => deleteUser({ userID }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_ADMINS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_VETS] });
        }
    });
};

export const useUpdateUserStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userID, status }: { userID: string, status: string }) => updateStatus({ userID, status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_ADMINS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_VETS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_USERS] });
        }
    });
};
export const useGetAllPets = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PETS],
        queryFn: getPets
    });
};
export const useAddNewPet = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: INewPet) => addNewPet(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PETS] });
        }
    })
}

export const useGetVetPrescriptions = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_VET_PRESCRIPTIONS],
        queryFn: getVetPrescriptionRecords
    });
};

export const useAddNewPrescription = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: INewPrescription) => addNewPrescription(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_VET_PRESCRIPTIONS] });
        }
    })
}

export const useGetVetNotes = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_VET_NOTES],
        queryFn: getVetNoteRecords
    });
};


export const useAddNewNote = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: INewMedicalNote) => addNewNote(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_VET_NOTES] });
        }
    })
}