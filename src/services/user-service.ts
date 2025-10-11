import { INewUser, INewVetUser } from "../lib/types";
import apiService from "./api/apiService";

export const getUser = async () => {
    try {
        const res = await apiService.get('/user');
        return res.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};


export const addUser = async (data: INewUser) => {
    try {
        const res = await apiService.post('/users', data);
        if (res.data.status === 'success') {
            return res.data.user;
        }
        return null;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    } 1
};

export const addVetUser = async (data: INewVetUser) => {
    try {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("phone_number", data.phone_number);
        formData.append("license_number", data.license_number);
        formData.append("specialization", data.specialization);
        formData.append("clinic", data.clinic);
        formData.append("years_of_experience", String(data.years_of_experience));
        formData.append("education", data.education);
        formData.append("bio", data.bio);
        formData.append("password", data.password);

        if (data.imageUrl) {
            formData.append("imageUrl", data.imageUrl);
        }
        const res = await apiService.post('/users/new-vet', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log(res)
        if (res.data.status === 'success') {
            return res.data.user;
        }
        return null;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    } 1
};

export const getAllAdmins = async () => {
    try {
        const res = await apiService.get('/users/admins');
        if (res.data.status === 'success') {
            return res.data.admins;
        }
        return [];
    } catch (error) {
        console.error('Error fetching admins:', error);
        throw error;
    }
};
export const getUsers = async () => {
    try {
        const res = await apiService.get('/users');
        if (res.data.status === 'success') {
            return res.data.users;
        }
        return [];
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};
export const getAllVets = async () => {
    try {
        const res = await apiService.get('/users/veterinarians');
        console.log(res)
        if (res.data.status === 'success') {
            return res.data.vets;
        }
        return [];
    } catch (error) {
        console.error('Error fetching veterinarians:', error);
        throw error;
    }
};
export const getOwners = async () => {
    try {
        const res = await apiService.get('/users/owners');
        if (res.data.status === 'success') {
            return res.data.owners;
        }
        return [];
    } catch (error) {
        console.error('Error fetching owners:', error);
        throw error;
    }
};

export const deleteUser = async ({ userID }: { userID: string }) => {
    try {
        const res = await apiService.delete(`/users/${userID}`);
        if (res.data.status === 'success') {
            return {
                success: true,
                message: res.data.message || 'User deleted successfully',
            };
        }
        return {
            success: false,
            message: res.data.message || 'Failed to delete user',
        };
    } catch (error: any) {
        console.error('Error deleting user:', error);
        return {
            success: false,
            message: error.message,
        };
    }
};
export const updateStatus = async ({ userID, status }: { userID: string, status: string }) => {
    try {
        const res = await apiService.post(`/users/${userID}/status`, {
            status: status
        });
        if (res.data.status === 'success') {
            return {
                success: true,
                message: res.data.message || 'User updated successfully',
            };
        }
        return {
            success: false,
            message: res.data.message || 'Failed to updated user',
        };
    } catch (error: any) {
        console.error('Error updating user:', error);
        return {
            success: false,
            message: error.message,
        };
    }
};

export const updateUser = async ({ userID, name, email ,password}: { userID: string, name: string, email: string ,password:string}) => {
    try {
        const res = await apiService.post(`/users/${userID}`, {
            name: name,
            email: email,
            password:password
        });
        if (res.data.status === 'success') {
            return {
                success: true,
                message: res.data.message || 'User updated successfully',
                user: res.data.user
            };
        }
        return {
            success: false,
            message: res.data.message || 'Failed to updated user',
            user: null
        };
    } catch (error: any) {
        console.error('Error updating user:', error);
        return {
            success: false,
            message: error.message,
            user: null
        };
    }
};
