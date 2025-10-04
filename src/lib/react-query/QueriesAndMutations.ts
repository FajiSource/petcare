import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { IAdminTotals, INewAppointment, INewClinic, INewHealthRecord, INewMedicalNote, INewPatient, INewPet, INewPrescription, INewUser, INewVaccination, INewVetUser, IPet, IRecentUser, ITopVet, IUserTrend, IVaccination } from "../types"
import { addUser, addVetUser, deleteUser, getAllAdmins, getAllVets, getOwners, getUsers, updateStatus } from "../../services/user-service"
import { QUERY_KEYS } from "./queryKeys"
import { getAdminTotals, getMonthlyAppoinments, getRecentUserRegistration, getTopVets, getUserTrends, getVetTotals } from "../../services/analytics-service"
import { addRecord, getAllVetRecords } from "../../services/veterinarian-services"
import { addNewPet, getPets, getPatients, updatePet } from "../../services/pet-service"
import { addNewPrescription, getOwnerPrescriptionRecords, getVetPrescriptionRecords } from "../../services/prescription-service"
import { addNewNote, getVetNoteRecords } from "../../services/note-service"
import { updateAppointmentStatus, createNewAppointment, getOwnerAppointments, getVetAAppointments, getAllAppointments, updateAppointment, rescheduleAppointment, cancelAppointment, getVetTodaySchedules, getVetUrgents, getVetRecents } from "../../services/appointment-service"
import { getClinicsSelections, getOwnersSelections, getPetSelections, getVetsSelections } from "../../services/selection-service"
import { getOwnerRecords } from "../../services/owner-service"
import { createNewClinic, deleteClinic, getClinicById, getClinics, updateClinic } from "../../services/clinic-service"
import { createNewPatient, deletePatient, getVetPatients, updatePatient } from "../../services/patient-service"
import { addNewVaccination, deleteVaccination, getOwnerVaccinations, getVaccinations, updateVaccination } from "../../services/vaccination-service"
import { getOwnerLatestPets, getOwnerTotals, getOwnerUpcomingAppointments } from "../../services/owner-db-service"


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
// admin reports
export const useAdminDashboardTotals = () => {
    return useQuery<IAdminTotals>({
        queryKey: [QUERY_KEYS.ADMIN_DB_TOTALS],
        queryFn: getAdminTotals
    });
}
export const useGetMonthlyAppoinments = () => {
    return useQuery({
        queryKey: ['monthly-appointments'],
        queryFn: getMonthlyAppoinments
    });
}
export const useGetTopVets = () => {
    return useQuery<ITopVet[]>({
        queryKey: ['top-vets'],
        queryFn: getTopVets
    });
}
export const useGetUserTrends = () => {
    return useQuery<IUserTrend[]>({
        queryKey: ['user-trends'],
        queryFn: getUserTrends
    });
}
export const useGetRecentUserRegistrations = () => {
    return useQuery<IRecentUser[]>({
        queryKey: ['user-registrations'],
        queryFn: getRecentUserRegistration
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

export const useGetVetPatients = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_VET_PATIENTS],
        queryFn: getPatients
    });
};
export const useAddNewPet = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: INewPatient) => addNewPet(data),
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

export const useGetVetTodaySchedules = () => {
    return useQuery({
        queryKey: ['today-schedules'],
        queryFn: getVetTodaySchedules,
        select: (data) => data ?? [],
        initialData: []
    });
};
export const useGetVetUrgents = () => {
    return useQuery({
        queryKey: ['urgent-cases'],
        queryFn: getVetUrgents,
        select: (data) => data ?? [],
        initialData: []
    });
};

export const useGetVetRecents = () => {
    return useQuery({
        queryKey: ['recent-cases'],
        queryFn: getVetRecents,
        select: (data) => data ?? [],
        initialData: []
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
export const useRescheduleAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, date, time }: { id: number; date: string; time: string }) =>
            rescheduleAppointment(id, { date, time }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_APPOINTMENTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_OWNER_APPOINTMENTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_VET_APPOINTMENTS] });
        },
    });
};

export const useCancelAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => cancelAppointment(id),
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
        mutationFn: ({ id, status }: { id: number, status: string }) => updateAppointmentStatus({ id, status }),
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
        select: (data) => data? data : [],
        initialData: []
    });
};

export const useVetOptions = () => {
    return useQuery({
        queryKey: ['vets-options'],
        queryFn: getVetsSelections,
        select: (data) => data? data : [],
        initialData: []
    });
};

export const useOwnerOptions = () => {
    return useQuery({
        queryKey: ['owner-options'],
        queryFn: getOwnersSelections,
        select: (data) => data? data : [],
        initialData: []
    });
};

export const useClinicOptions = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CLINICS_OPTIONS],
        queryFn: getClinicsSelections,
        select: (data) => data? data : [],
        initialData: []
    });
};

// clinics

export const useGetClinics = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CLINICS],
        queryFn: getClinics,
        select: (data) => data? data : [],
        initialData: []
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


// patient

export const useGetPatients = () => {
    return useQuery<IPet[]>({
        queryKey: [QUERY_KEYS.GET_PATIENTS],
        queryFn: getPatients,
    });
};
// export const useGetVetPatients = () => {
//     return useQuery({
//         queryKey: [QUERY_KEYS.GET_VET_PATIENTS],
//         queryFn: getVetPatients,
//     });
// };
export const useCreateNewPatient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: INewPatient) => createNewPatient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PATIENTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_VET_PATIENTS] });
        },
    });
};

export const useUpdatePatient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<INewPatient> }) =>
            updatePatient(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_VET_PATIENTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PATIENTS] });
        },
    });
};

export const useDeletePatient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deletePatient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_VET_PATIENTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PATIENTS] });
        },
    });
};

export function useUpdatePet() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: INewPatient }) =>
            updatePet(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PATIENTS] });
        },
    });
}


// vaccinations
export function useGetVaccinations() {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_VACCINATIONS],
        queryFn: getVaccinations,
        select: (data) => data ?? [],
        initialData: [],
    });
}

export function useGetOwnerVaccinations() {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_OWNER_VACCINATIONS],
        queryFn: getOwnerVaccinations,
        select: (data) => data ?? [],
        initialData: [],
    });
}

export function useAddVaccination() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: INewVaccination) => addNewVaccination(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_VACCINATIONS] });
        },
    });
}

export function useUpdateVaccination() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: IVaccination }) =>
            updateVaccination(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_VACCINATIONS] });
        },
    });
}

export function useDeleteVaccination() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteVaccination(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_VACCINATIONS] });
        },
    });
}


// vet analytics

export function useGetVetTotals() {
    return useQuery({
        queryKey: ['vet-totals'],
        queryFn: getVetTotals,
        select: (data) => data ?? [],
        initialData: [],
    });
}


// owner db
export const useGetOwnerTotals = () => {
    return useQuery({
        queryKey: ['owner-totols'],
        queryFn: getOwnerTotals, 
        select: (data) => data ?? [],
        initialData: [],
    });
};

export const useGetOwnerLatestPets = () => {
    return useQuery({
        queryKey: ['owner-latest-pets'],
        queryFn: getOwnerLatestPets,
        select: (data) => data ?? [],
        initialData: [],
    });
};

export const useGetOwnerUpcomingAppointments = () => {
    return useQuery({
        queryKey: ['owner-upcoming'],
        queryFn: getOwnerUpcomingAppointments,
        select: (data) => data ?? [],
        initialData: [],
    });
};