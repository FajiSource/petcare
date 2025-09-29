import { INewMedicalNote } from "../lib/types";
import apiService from "./api/apiService";

export const addNewNote = async (data: INewMedicalNote) => {
    try {
        const formData = new FormData();

        // Append scalar fields
        Object.entries(data).forEach(([key, value]) => {
            if (
                !Array.isArray(value) &&
                typeof value !== "object" &&
                value !== undefined &&
                value !== null
            ) {
                formData.append(key, String(value));
            }
        });

        data.medications.forEach((med, idx) => {
            formData.append(`medications[${idx}][name]`, med.name);
            formData.append(`medications[${idx}][dosage]`, med.dosage);
            formData.append(`medications[${idx}][frequency]`, med.frequency);
            formData.append(`medications[${idx}][duration]`, med.duration);
        });

        data.attachments.forEach((att, idx) => {
            if ((att as any).file instanceof File) {
                formData.append(`attachments[${idx}]`, (att as any).file);
            } else {
                formData.append(`attachments[${idx}][file_name]`, att.file_name);
                formData.append(`attachments[${idx}][url]`, att.url);
            }
        });

        data.tags.forEach((tag, idx) => {
            formData.append(`tags[${idx}]`, tag);
        });

        const res = await apiService.post("/medical-notes", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (res.data.success) {
            return res.data.note;
        }
        return null;
    } catch (error) {
        console.error("Error adding notes:", error);
        throw error;
    }
};


export const getNote = async () => {
    try {
        const res = await apiService.get('/medical-notes');
        if (res.data.success) {
            return res.data.notes;
        }
        return [];
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
};

export const getVetNoteRecords = async () => {
    try {
        const res = await apiService.get('/medical-notes/vet');
        if (res.data.success) {
            return res.data.notes;
        }
        return [];
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
};