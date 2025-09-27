import { AppProvider, useApp } from './contexts/AppContext';
import { PetCareLogo } from './components/PetCareLogo';
import { LoginForm } from './components/LoginForm';
import { DashboardLayout } from './components/DashboardLayout';
import { Toaster } from './components/ui/sonner';
import QueryProvider from './lib/react-query/QueryProvider';

function AppContent() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        {/* Left Panel - Logo Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 items-center justify-center p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-white"></div>
            <div className="absolute top-1/2 right-10 w-16 h-16 rounded-full bg-white"></div>
            <div className="absolute bottom-10 left-1/3 w-20 h-20 rounded-full bg-white"></div>
          </div>

          <div className="relative z-10 text-center">
            <PetCareLogo />
            <div className="mt-8 max-w-md">
              <p className="text-white/90 text-lg leading-relaxed">
                Connect with trusted pet care professionals and give your furry friends the care they deserve.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="text-white/80">
                  <div className="font-medium">✓ Health Records</div>
                  <div className="font-medium">✓ Appointment Scheduling</div>
                </div>
                <div className="text-white/80">
                  <div className="font-medium">✓ AI Assistant</div>
                  <div className="font-medium">✓ Vaccination Tracking</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="15" r="8" fill="#4A90E2" />
                    <circle cx="40" cy="15" r="8" fill="#4A90E2" />
                    <circle cx="15" cy="35" r="6" fill="#4A90E2" />
                    <circle cx="45" cy="35" r="6" fill="#4A90E2" />
                    <ellipse cx="30" cy="42" rx="12" ry="10" fill="#4A90E2" />
                    <path
                      d="M30 35c-3-6-12-6-12 0 0 6 12 12 12 12s12-6 12-12c0-6-9-6-12 0z"
                      fill="#FF6B6B"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-blue-600">PETCARE</h1>
                  <h2 className="text-xl font-bold text-blue-600">CONNECT</h2>
                </div>
              </div>
            </div>

            <LoginForm />

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>© 2025 PetCare Connect. All rights reserved.</p>
              <div className="mt-2 space-x-4">
                <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <DashboardLayout />;
}

export default function App() {
  return (
    <AppProvider>
      <QueryProvider>
        <AppContent />
        <Toaster position="top-right" />
      </QueryProvider>
    </AppProvider>
  );
}