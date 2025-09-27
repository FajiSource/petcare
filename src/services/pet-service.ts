import { INewPet } from "../lib/types";
import apiService from "./api/apiService";

export const getPets = async () => {
    try {
        const res = await apiService.get('/pets');
        if (res.data.status) {
            return res.data.pets;
        }
        return [];
    } catch (error) {
        console.error('Error fetching pets:', error);
        throw error;
    }
};


export const addNewPet = async (data: INewPet) => {
    try {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("species", data.species);
        formData.append("breed", data.breed);
        formData.append("age", data.age);
        formData.append("weight", data.weight);
        formData.append("birthdate", data.birthdate);
        formData.append("phone", data.phone);
        formData.append("user_id", data.user_id);
        formData.append("emergency_contact", data.emergency_contact);
        formData.append("allergies", data.allergies);
        formData.append("medical_condition", data.medical_condition);
        formData.append("notes", data.notes);

        if (data.image) {
            formData.append("image", data.image);
        }
        const res = await apiService.post('/pets', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log(res)
        if (res.data.status) {
            return res.data.pet;
        }
        return null;
    } catch (error) {
        console.error('Error adding pet:', error);
        throw error;
    } 1
};