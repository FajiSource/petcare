import { INewPatient, INewPet } from "../lib/types";
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

export const getPatients = async () => {
    try {
        const res = await apiService.get('/pets/vet-patients');
        console.log(res)
        return res.data;
    } catch (error) {
        console.error('Error fetching pets:', error);
        throw error;
    }
};
export const getOwnerPets = async () => {
    try {
        const res = await apiService.get('/pets/owner');
        return res.data;
    } catch (error) {
        console.error('Error fetching pets:', error);
        throw error;
    }
};

export const getHistory = async (id:string | number) => {
    try {
        const res = await apiService.get(`/pets/${id}/history`);
        console.log(res)
        return res.data.history;
    } catch (error) {
        console.error('Error fetching history:', error);
        throw error;
    }
};

export const addNewPet = async (data: INewPatient) => {
  try {
    const formData = new FormData();
    console.log("new pet: ", data);

    formData.append("owner_id", (data.owner_id ?? '').toString());
    formData.append("name", data.name ?? '');
    formData.append("species", data.species ?? '');
    formData.append("breed", data.breed ?? '');
    formData.append("gender", data.gender ?? '');
    formData.append(
      "date_of_birth",
      data.date_of_birth ? data.date_of_birth.toISOString().substring(0, 10) : ''
    );
    formData.append("age", (data.age ?? 0).toString());
    formData.append("weight", (data.weight ?? 0).toString());
    formData.append("color", data.color ?? '');
    formData.append("microchip_id", data.microchip_id ?? '');
    formData.append("owner_phone", data.owner_phone ?? '');
    formData.append("owner_address", data.owner_address ?? '');
    formData.append("notes", data.notes ?? '');
    formData.append("status", data.status ?? '');

    if (data.allergies) {
      formData.append("allergies", JSON.stringify(data.allergies));
    }
    if (data.conditions) {
      formData.append("conditions", JSON.stringify(data.conditions));
    }
    if (data.emergency_contact) {
      formData.append("emergency_contact", JSON.stringify(data.emergency_contact));
    }

    if (data.image) {
      formData.append("image", data.image);
    }

    const res = await apiService.post('/pets', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(res);
    if (res.data.status) {
      return res.data.pet;
    }
    return null;
  } catch (error) {
    console.error('Error adding pet:', error);
    throw error;
  }
};

export const updatePet = async (id: number, data: INewPatient) => {
  try {
    const formData = new FormData();
    console.log("update pet: ", data);

    if (data.owner_id) formData.append("owner_id", data.owner_id.toString());
    formData.append("name", data.name ?? "");
    formData.append("species", data.species ?? "");
    formData.append("breed", data.breed ?? "");
    formData.append("gender", data.gender ?? "");
    formData.append(
      "date_of_birth",
      data.date_of_birth
        ? data.date_of_birth.toISOString().substring(0, 10)
        : ""
    );
    formData.append("age", (data.age ?? 0).toString());
    formData.append("weight", (data.weight ?? 0).toString());
    formData.append("color", data.color ?? "");
    formData.append("microchip_id", data.microchip_id ?? "");
    formData.append("owner_phone", data.owner_phone ?? "");
    formData.append("owner_address", data.owner_address ?? "");
    formData.append("notes", data.notes ?? "");
    formData.append("status", data.status ?? "");

    if (data.allergies) {
      formData.append("allergies", JSON.stringify(data.allergies));
    }
    if (data.conditions) {
      formData.append("conditions", JSON.stringify(data.conditions));
    }
    if (data.emergency_contact) {
      formData.append(
        "emergency_contact",
        JSON.stringify(data.emergency_contact)
      );
    }

    if (data.image) {
      formData.append("image", data.image);
    }

    const res = await apiService.post(`/pets/${id}?_method=PUT`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(res);
    if (res.data.status) {
      return res.data.pet;
    }
    return null;
  } catch (error) {
    console.error("Error updating pet:", error);
    throw error;
  }
};
