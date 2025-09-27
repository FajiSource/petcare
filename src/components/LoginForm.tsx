import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { FormInput } from './FormInput';
import { LoadingButton } from './LoadingButton';
import { useFormValidation } from './hooks/useFormValidation';
import { AuthService, ApiError } from '../services/auth';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertCircle, CheckCircle2, Info, Shield, Stethoscope, Heart } from 'lucide-react';
import { Button } from './ui/button';
import type { UserRole } from '../contexts/AppContext';

interface FormData {
  email: string;
  password: string;
}

const DEMO_ACCOUNTS = {
  admin: [
    { email: 'admin@petcare.com', password: 'admin123', name: 'System Administrator' },
    { email: 'admin.demo@petcare.com', password: 'demo123', name: 'Demo Admin' }
  ],
  veterinarian: [
    { email: 'vet@petcare.com', password: 'vet123', name: 'Dr. Sarah Johnson' },
    { email: 'dr.chen@animalhealthcenter.com', password: 'vetpass123', name: 'Dr. Michael Chen' },
    { email: 'emily.rodriguez@citypethospital.com', password: 'surgery123', name: 'Dr. Emily Rodriguez' }
  ],
  pet_owner: [
    { email: 'demo@petcare.com', password: 'demo123', name: 'Demo User' },
    { email: 'john@example.com', password: 'password123', name: 'John Smith' },
    { email: 'sarah@petlover.com', password: 'mypassword', name: 'Sarah Johnson' }
  ]
};

const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return <Shield className="h-4 w-4" />;
    case 'veterinarian':
      return <Stethoscope className="h-4 w-4" />;
    case 'pet_owner':
      return <Heart className="h-4 w-4" />;
  }
};

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return 'border-red-200 bg-red-50';
    case 'veterinarian':
      return 'border-green-200 bg-green-50';
    case 'pet_owner':
      return 'border-blue-200 bg-blue-50';
  }
};

const getRoleButtonColor = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return 'border-red-300 text-red-700 hover:bg-red-100';
    case 'veterinarian':
      return 'border-green-300 text-green-700 hover:bg-green-100';
    case 'pet_owner':
      return 'border-blue-300 text-blue-700 hover:bg-blue-100';
  }
};

export function LoginForm() {
  const { login } = useApp();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const validationConfig = {
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minLength: 6
    }
  };

  const {
    errors,
    touched,
    validateForm,
    validateSingleField,
    markFieldTouched,
    clearErrors
  } = useFormValidation(validationConfig);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear API errors when user starts typing
    if (apiError) {
      setApiError('');
    }

    // Real-time validation for touched fields
    if (touched[name]) {
      validateSingleField(name, value);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    markFieldTouched(name);
    validateSingleField(name, value);
  };

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({ email, password });
    // Clear any existing errors
    setApiError('');
    clearErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    // Mark all fields as touched for validation display
    Object.keys(validationConfig).forEach(field => {
      markFieldTouched(field);
    });

    // Validate form
    if (!validateForm(formData)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.login(formData);
      
      if (response.success && response.user) {
        setSuccessMessage('Login successful! Loading your dashboard...');
        
        // Use the login function from context
        setTimeout(() => {
          login(response.user!);
        }, 1000);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setApiError('Please enter your email address first.');
      markFieldTouched('email');
      validateSingleField('email', '');
      return;
    }

    if (!validateSingleField('email', formData.email)) {
      return;
    }

    setForgotPasswordLoading(true);
    setApiError('');

    try {
      const response = await AuthService.forgotPassword(formData.email);
      setSuccessMessage(response.message);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError('Failed to send reset email. Please try again.');
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleRegister = () => {
    console.log('Navigate to register page');
    // Here you would typically navigate to registration page
  };

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your PetCare Connect account</p>
      </div>


      {/* Success Message */}
      {successMessage && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {apiError && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {apiError}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          error={errors.email}
          touched={touched.email}
          placeholder="Enter your email"
          required
          disabled={isLoading}
        />

        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          error={errors.password}
          touched={touched.password}
          placeholder="Enter your password"
          required
          disabled={isLoading}
        />

        <div className="flex justify-between items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          
          <LoadingButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleForgotPassword}
            loading={forgotPasswordLoading}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
          >
            Forgot Password?
          </LoadingButton>
        </div>

        <LoadingButton
          type="submit"
          loading={isLoading}
          loadingText="Signing in..."
          disabled={isLoading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Sign In
        </LoadingButton>

        <div className="text-center pt-4">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            type="button"
            onClick={handleRegister}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:underline transition-colors"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}