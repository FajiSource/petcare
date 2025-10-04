import { useApp } from '../contexts/AppContext';
import { PetCareLogo } from './PetCareLogo';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Syringe, 
  Pill, 
  MessageCircle, 
  PawPrint, 
  BarChart3,
  LogOut,
  Settings,
  Menu,
  X,
  Users,
  Building,
  UserCheck,
  Shield,
  Activity,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Navigation items for each role
const adminNavigationItems = [
  { id: 'admin-dashboard', icon: LayoutDashboard, label: 'Admin Dashboard' },
  { id: 'manage-users', icon: Users, label: 'Manage Users' },
  { id: 'manage-vets', icon: UserCheck, label: 'Veterinarians' },
  { id: 'manage-clinics', icon: Building, label: 'Clinics' },
  { id: 'all-pets', icon: PawPrint, label: 'All Pets' },
  { id: 'all-appointments', icon: Calendar, label: 'All Appointments' },
  { id: 'system-reports', icon: BarChart3, label: 'System Reports' },
  { id: 'system-settings', icon: Settings, label: 'System Settings' }
];

const veterinarianNavigationItems = [
  { id: 'vet-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'my-appointments', icon: Calendar, label: 'My Appointments' },
  { id: 'my-patients', icon: PawPrint, label: 'My Patients' },
  { id: 'vaccinations-management', icon: Syringe, label: 'Vaccinations' },
  { id: 'health-records', icon: FileText, label: 'Health Records' },
  { id: 'prescriptions', icon: Pill, label: 'Prescriptions' },
  { id: 'medical-notes', icon: ClipboardList, label: 'Medical Notes' },
  { id: 'chatbot', icon: MessageCircle, label: 'AI Assistant' },
  { id: 'vet-reports', icon: BarChart3, label: 'My Reports' }
];

const petOwnerNavigationItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'appointments', icon: Calendar, label: 'Appointments' },
  { id: 'health-records', icon: FileText, label: 'Health Records' },
  { id: 'vaccinations', icon: Syringe, label: 'Vaccinations' },
  { id: 'prescriptions', icon: Pill, label: 'Prescriptions' },
  { id: 'chatbot', icon: MessageCircle, label: 'AI Assistant' },
  { id: 'pet-history', icon: PawPrint, label: 'Pet History' },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800';
    case 'veterinarian':
      return 'bg-green-100 text-green-800';
    case 'pet_owner':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'veterinarian':
      return 'Veterinarian';
    case 'pet_owner':
      return 'Pet Owner';
    default:
      return role;
  }
};

export function RoleSidebar() {
  const { user, currentView, setCurrentView, logout } = useApp();

  useEffect(() => {
    console.log("user:: ",user)
  },[user]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  const getNavigationItems = () => {
    switch (user.role) {
      case 'admin':
        return adminNavigationItems;
      case 'veterinarian':
        return veterinarianNavigationItems;
      case 'pet_owner':
        return petOwnerNavigationItems;
      default:
        return petOwnerNavigationItems;
    }
  };

  const handleNavigation = (viewId: string) => {
    setCurrentView(viewId);
    setIsMobileMenuOpen(false);
  };

  const navigationItems = getNavigationItems();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg width="32" height="32" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="15" r="8" fill="#4A90E2"/>
              <circle cx="40" cy="15" r="8" fill="#4A90E2"/>
              <circle cx="15" cy="35" r="6" fill="#4A90E2"/>
              <circle cx="45" cy="35" r="6" fill="#4A90E2"/>
              <ellipse cx="30" cy="42" rx="12" ry="10" fill="#4A90E2"/>
              <path 
                d="M30 35c-3-6-12-6-12 0 0 6 12 12 12 12s12-6 12-12c0-6-9-6-12 0z" 
                fill="#FF6B6B"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-blue-600">PETCARE</h1>
            <h2 className="text-sm font-bold text-blue-600">CONNECT</h2>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive && "bg-blue-50 text-blue-700 border-blue-200"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className={cn(
              "text-white",
              user.role === 'admin' ? 'bg-red-500' :
              user.role === 'veterinarian' ? 'bg-green-500' :
              'bg-blue-500'
            )}>
              {user?.role === 'admin' ? <Shield className="h-5 w-5" /> :
               user?.role === 'veterinarian' ? <Stethoscope className="h-5 w-5" /> :
               user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium truncate text-sm">{user?.name}</p>
              <Badge className={cn("text-xs px-2 py-0", getRoleColor(user.role))}>
                {getRoleLabel(user.role)}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            {user.role === 'veterinarian' && (
              <p className="text-xs text-gray-500 truncate">
                License: {user?.veterinarian_info?.license_number}
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          variant="outline"
          size="icon"
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-40 transform transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <SidebarContent />
      </div>
    </>
  );
}