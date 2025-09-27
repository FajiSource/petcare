import type { UserRole } from '../contexts/AppContext';
import apiService from './api/apiService';

interface LoginRequest {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  clinicId?: string;
  licenseNumber?: string;
  specialization?: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export class AuthService {
  private static readonly API_BASE = '/api';

  // Demo accounts for different roles
  private static readonly DEMO_ACCOUNTS = [
    // Admin accounts
    {
      email: 'admin@petcare.com',
      password: 'admin123',
      user: {
        id: 'admin1',
        email: 'admin@petcare.com',
        name: 'System Administrator',
        role: 'admin' as UserRole
      }
    },
    {
      email: 'admin.demo@petcare.com',
      password: 'demo123',
      user: {
        id: 'admin2',
        email: 'admin.demo@petcare.com',
        name: 'Demo Admin',
        role: 'admin' as UserRole
      }
    },
    // Veterinarian accounts
    {
      email: 'vet@petcare.com',
      password: 'vet123',
      user: {
        id: 'vet1',
        email: 'vet@petcare.com',
        name: 'Dr. Sarah Johnson',
        role: 'veterinarian' as UserRole,
        clinicId: '1',
        licenseNumber: 'VET12345',
        specialization: 'Small Animal Medicine'
      }
    },
    {
      email: 'dr.chen@animalhealthcenter.com',
      password: 'vetpass123',
      user: {
        id: 'vet2',
        email: 'dr.chen@animalhealthcenter.com',
        name: 'Dr. Michael Chen',
        role: 'veterinarian' as UserRole,
        clinicId: '2',
        licenseNumber: 'VET67890',
        specialization: 'Emergency Medicine'
      }
    },
    {
      email: 'emily.rodriguez@citypethospital.com',
      password: 'surgery123',
      user: {
        id: 'vet3',
        email: 'emily.rodriguez@citypethospital.com',
        name: 'Dr. Emily Rodriguez',
        role: 'veterinarian' as UserRole,
        clinicId: '3',
        licenseNumber: 'VET54321',
        specialization: 'Surgery'
      }
    },
    // Pet owner accounts (existing)
    {
      email: 'demo@petcare.com',
      password: 'demo123',
      user: {
        id: 'owner1',
        email: 'demo@petcare.com',
        name: 'Demo User',
        role: 'pet_owner' as UserRole
      }
    },
    {
      email: 'john@example.com',
      password: 'password123',
      user: {
        id: 'owner2',
        email: 'john@example.com',
        name: 'John Smith',
        role: 'pet_owner' as UserRole
      }
    },
    {
      email: 'sarah@petlover.com',
      password: 'mypassword',
      user: {
        id: 'owner3',
        email: 'sarah@petlover.com',
        name: 'Sarah Johnson',
        role: 'pet_owner' as UserRole
      }
    }
  ];

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      // Check for demo accounts first
      const account = await apiService.post("/login", credentials);
      const data = account.data;
      if (account) {
        console.log(`Logged in as demo account: `, data);
        return {
          success: true,
          token: `demo-jwt-token-${data.user.role}-${Date.now()}`,
          user: data.user
        };
      }

      // If not a demo account, simulate different response scenarios
      const scenarios = this.getLoginScenarios(credentials);
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

      if (!scenario.success) {
        throw new ApiError(scenario.message, scenario.code, scenario.field);
      }

      return scenario;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error. Please check your connection and try again.');
    }
  }
  static async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (!email || !this.isValidEmail(email)) {
        throw new ApiError('Please enter a valid email address.');
      }

      return {
        success: true,
        message: 'Password reset instructions have been sent to your email address.'
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to send reset email. Please try again.');
    }
  }

  private static getLoginScenarios(credentials: LoginRequest): LoginResponse[] {
    const { email, password } = credentials;

    // Demo scenarios for different outcomes
    return [
      // Success scenario (70% chance)
      {
        success: true,
        token: 'mock-jwt-token-12345',
        user: {
          id: '1',
          email: email,
          name: 'Pet Owner',
          role: 'pet_owner' as UserRole
        }
      },
      {
        success: true,
        token: 'mock-jwt-token-12345',
        user: {
          id: '1',
          email: email,
          name: 'Pet Owner',
          role: 'pet_owner' as UserRole
        }
      },
      {
        success: true,
        token: 'mock-jwt-token-12345',
        user: {
          id: '1',
          email: email,
          name: 'Pet Owner',
          role: 'pet_owner' as UserRole
        }
      },
      // Error scenarios (30% chance)
      {
        success: false,
        message: 'Invalid email or password. Please check your credentials and try again.',
        code: 'INVALID_CREDENTIALS'
      }
    ];
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper method to get demo accounts by role
  static getDemoAccountsByRole(role?: UserRole) {
    if (!role) return this.DEMO_ACCOUNTS;
    return this.DEMO_ACCOUNTS.filter(account => account.user.role === role);
  }

  // Helper method to get all available roles
  static getAvailableRoles(): UserRole[] {
    return ['admin', 'veterinarian', 'pet_owner'];
  }
}

export class ApiError extends Error {
  public code?: string;
  public field?: string;

  constructor(message: string, code?: string, field?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.field = field;
  }
}