import { createContext, useContext, useState, useEffect } from 'react';
import { useGetAllUsers } from '../lib/react-query/QueriesAndMutations';
import { IUser } from '../lib/types';

export type UserRole = 'admin' | 'veterinarian' | 'pet_owner';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  clinicId?: string; // For veterinarians
  licenseNumber?: string; // For veterinarians
  specialization?: string; // For veterinarians
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  imageUrl: string;
  ownerId: string;
  ownerName?: string; // For admin/vet views
}

interface Veterinarian {
  id: string;
  name: string;
  email: string;
  licenseNumber: string;
  specialization: string;
  clinicId: string;
  isActive: boolean;
}

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
}

interface AppContextType {
  user: User | null;
  pets: Pet[];
  veterinarians: Veterinarian[];
  clinics: Clinic[];
  currentView: string;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setCurrentView: (view: string) => void;
  addPet: (pet: Pet) => void;
  updatePet: (petId: string, updates: Partial<Pet>) => void;
  // Role-specific permissions
  canAccessAdminPanel: () => boolean;
  canViewAllPets: () => boolean;
  canManageAppointments: () => boolean;
  canViewHealthRecords: (petId?: string) => boolean;
  canEditHealthRecords: (petId?: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for saved auth state
    const savedUser = localStorage.getItem('petcare_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        loadRoleSpecificData(userData);
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('petcare_user');
      }
    }
  }, []);

  const loadRoleSpecificData = (userData: User) => {
    loadMockClinics();
    loadMockVeterinarians();

    switch (userData.role) {
      case 'admin':
        loadAllPetsForAdmin();
        break;
      case 'veterinarian':
        loadPetsForVeterinarian(userData.id);
        break;
      case 'pet_owner':
        loadMockPets(userData.id);
        break;
    }
  };

  const loadMockClinics = () => {
    const mockClinics: Clinic[] = [
      {
        id: '1',
        name: 'PetCare Veterinary Clinic',
        address: '123 Pet Street, City, State 12345',
        phone: '(555) 123-4567',
        email: 'info@petcareclinic.com',
        isActive: true
      },
      {
        id: '2',
        name: 'Animal Health Center',
        address: '456 Animal Ave, City, State 12345',
        phone: '(555) 987-6543',
        email: 'contact@animalhealthcenter.com',
        isActive: true
      },
      {
        id: '3',
        name: 'City Pet Hospital',
        address: '789 Veterinary Blvd, City, State 12345',
        phone: '(555) 456-7890',
        email: 'help@citypethospital.com',
        isActive: true
      }
    ];
    setClinics(mockClinics);
  };

  const loadMockVeterinarians = () => {
    const mockVeterinarians: Veterinarian[] = [
      {
        id: 'vet1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@petcare.com',
        licenseNumber: 'VET12345',
        specialization: 'Small Animal Medicine',
        clinicId: '1',
        isActive: true
      },
      {
        id: 'vet2',
        name: 'Dr. Michael Chen',
        email: 'michael.chen@animalhealthcenter.com',
        licenseNumber: 'VET67890',
        specialization: 'Emergency Medicine',
        clinicId: '2',
        isActive: true
      },
      {
        id: 'vet3',
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@citypethospital.com',
        licenseNumber: 'VET54321',
        specialization: 'Surgery',
        clinicId: '3',
        isActive: true
      }
    ];
    setVeterinarians(mockVeterinarians);
  };

  const loadMockPets = (userId: string) => {
    const mockPets: Pet[] = [
      {
        id: '1',
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 3,
        weight: 65,
        imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
        ownerId: userId
      },
      {
        id: '2',
        name: 'Whiskers',
        species: 'Cat',
        breed: 'Persian',
        age: 2,
        weight: 12,
        imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
        ownerId: userId
      }
    ];
    setPets(mockPets);
  };

  const loadAllPetsForAdmin = () => {
    const mockPets: Pet[] = [
      {
        id: '1',
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 3,
        weight: 65,
        imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
        ownerId: 'owner1',
        ownerName: 'John Smith'
      },
      {
        id: '2',
        name: 'Whiskers',
        species: 'Cat',
        breed: 'Persian',
        age: 2,
        weight: 12,
        imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
        ownerId: 'owner1',
        ownerName: 'John Smith'
      },
      {
        id: '3',
        name: 'Max',
        species: 'Dog',
        breed: 'German Shepherd',
        age: 5,
        weight: 75,
        imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop',
        ownerId: 'owner2',
        ownerName: 'Sarah Johnson'
      },
      {
        id: '4',
        name: 'Luna',
        species: 'Cat',
        breed: 'Siamese',
        age: 4,
        weight: 10,
        imageUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=400&fit=crop',
        ownerId: 'owner3',
        ownerName: 'Emily Davis'
      }
    ];
    setPets(mockPets);
  };

  const loadPetsForVeterinarian = (vetId: string) => {
    // Load pets that this veterinarian has treated or has appointments with
    const mockPets: Pet[] = [
      {
        id: '1',
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 3,
        weight: 65,
        imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
        ownerId: 'owner1',
        ownerName: 'John Smith'
      },
      {
        id: '3',
        name: 'Max',
        species: 'Dog',
        breed: 'German Shepherd',
        age: 5,
        weight: 75,
        imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop',
        ownerId: 'owner2',
        ownerName: 'Sarah Johnson'
      }
    ];
    setPets(mockPets);
  };

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('petcare_user', JSON.stringify(userData));
    loadRoleSpecificData(userData);

    // Set default view based on role
    const defaultView = getDefaultViewForRole(userData.role);
    setCurrentView(defaultView);
  };

  const getDefaultViewForRole = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return 'admin-dashboard';
      case 'veterinarian':
        return 'vet-dashboard';
      case 'pet_owner':
        return 'dashboard';
      default:
        return 'dashboard';
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setPets([]);
    setVeterinarians([]);
    setClinics([]);
    setCurrentView('dashboard');
    localStorage.removeItem('petcare_user');
    localStorage.removeItem('authToken');

  };

  const addPet = (pet: Pet) => {
    setPets(prev => [...prev, pet]);
  };

  const updatePet = (petId: string, updates: Partial<Pet>) => {
    setPets(prev =>
      prev.map(pet =>
        pet.id === petId ? { ...pet, ...updates } : pet
      )
    );
  };

  // Permission methods
  const canAccessAdminPanel = (): boolean => {
    return user?.role === 'admin';
  };

  const canViewAllPets = (): boolean => {
    return user?.role === 'admin' || user?.role === 'veterinarian';
  };

  const canManageAppointments = (): boolean => {
    return user?.role !== undefined; // All roles can manage appointments in their context
  };

  const canViewHealthRecords = (petId?: string): boolean => {
    if (!user) return false;

    switch (user.role) {
      case 'admin':
        return true;
      case 'veterinarian':
        return true; // Can view records of pets they treat
      case 'pet_owner':
        if (!petId) return true; // Can view own pets
        const pet = pets.find(p => p.id === petId);
        return pet?.ownerId === user.id;
      default:
        return false;
    }
  };

  const canEditHealthRecords = (petId?: string): boolean => {
    if (!user) return false;

    switch (user.role) {
      case 'admin':
        return true;
      case 'veterinarian':
        return true; // Vets can edit health records
      case 'pet_owner':
        return false; // Pet owners can only view, not edit health records
      default:
        return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        pets,
        veterinarians,
        clinics,
        currentView,
        isAuthenticated,
        login,
        logout,
        setCurrentView,
        addPet,
        updatePet,
        canAccessAdminPanel,
        canViewAllPets,
        canManageAppointments,
        canViewHealthRecords,
        canEditHealthRecords
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}