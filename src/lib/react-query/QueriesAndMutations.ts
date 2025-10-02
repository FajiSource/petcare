import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { IAdminTotals, INewAppointment, INewClinic, INewHealthRecord, INewMedicalNote, INewPet, INewPrescription, INewUser, INewVetUser } from "../types"
import { addUser, addVetUser, deleteUser, getAllAdmins, getAllVets, getOwners, getUsers, updateStatus } from "../../services/user-service"
import { QUERY_KEYS } from "./queryKeys"
import { getAdminTotals } from "../../services/dashboard-service"
import { addRecord, getAllVetRecords } from "../../services/veterinarian-services"
import { addNewPet, getPets } from "../../services/pet-service"
import { addNewPrescription, getOwnerPrescriptionRecords, getVetPrescriptionRecords } from "../../services/prescription-service"
import { addNewNote, getVetNoteRecords } from "../../services/note-service"
import { updateAppointmentStatus, createNewAppointment, getOwnerAppointments, getVetAAppointments, getAllAppointments, updateAppointment } from "../../services/appointment-service"
import { getClinicsSelections, getOwnersSelections, getPetSelections, getVetsSelections } from "../../services/selection-service"
import { getOwnerRecords } from "../../services/owner-service"
import { createNewClinic, deleteClinic, getClinicById, getClinics, updateClinic } from "../../services/clinic-service"


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

export const useGetOwnerPrescriptions = () => {
    return useQuery({
        queryKey: ['owner-prescriptions'],
        queryFn: getOwnerPrescriptionRecords
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

export const useGetOwnerAppointments = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_OWNER_APPOINTMENTS],
        queryFn: getOwnerAppointments,
    });
};
export const useGetVetAppointments = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_VET_APPOINTMENTS],
        queryFn: getVetAAppointments,
    });
};
export const useGetAllAppointments = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_APPOINTMENTS],
        queryFn: getAllAppointments,
    });
};
export const useUpdateAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => updateAppointment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_APPOINTMENTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_OWNER_APPOINTMENTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_VET_APPOINTMENTS] });
        },
    });
};


export const useUpdateAppointmentStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id , status }: { id: number, status:string }) => updateAppointmentStatus({ id , status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_VET_APPOINTMENTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_OWNER_APPOINTMENTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_APPOINTMENTS] });
        }
    })
}

export const useCreateNewAppointment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: INewAppointment) => createNewAppointment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_OWNER_APPOINTMENTS] });
        }
    })
}
export const useGetOwnerRecords = () => {
    return useQuery({
        queryKey: ['owner-records'],
        queryFn: getOwnerRecords,
    });
};

export const usePetOptions = () => {
    return useQuery({
        queryKey: ['pets-options'],
        queryFn: getPetSelections,
    });
};

export const useVetOptions = () => {
    return useQuery({
        queryKey: ['vets-options'],
        queryFn: getVetsSelections,
    });
};

export const useOwnerOptions = () => {
    return useQuery({
        queryKey: ['owner-options'],
        queryFn: getOwnersSelections,
    });
};

export const useClinicOptions = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CLINICS_OPTIONS],
        queryFn: getClinicsSelections,
    });
};

// clinics

export const useGetClinics = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CLINICS],
        queryFn: getClinics,
    });
};

export const useCreateNewClinic = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: INewClinic) => createNewClinic(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CLINICS] });
        }
    })
}

export const useUpdateClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<INewClinic> }) =>
      updateClinic(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CLINICS] });
    },
  });
};

export const useDeleteClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClinic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CLINICS] });
    },
  });
};
