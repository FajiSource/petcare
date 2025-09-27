import { useApp } from '../contexts/AppContext';
import { PetCareLogo } from './PetCareLogo';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
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
  X
} from 'lucide-react';
import { cn } from './ui/utils';
import { useState } from 'react';

const navigationItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'appointments', icon: Calendar, label: 'Appointments' },
  { id: 'health-records', icon: FileText, label: 'Health Records' },
  { id: 'vaccinations', icon: Syringe, label: 'Vaccinations' },
  { id: 'prescriptions', icon: Pill, label: 'Prescriptions' },
  { id: 'chatbot', icon: MessageCircle, label: 'AI Assistant' },
  { id: 'pet-history', icon: PawPrint, label: 'Pet History' },
  { id: 'reports', icon: BarChart3, label: 'Reports & Analytics' }
];

export function Sidebar() {
  const { user, currentView, setCurrentView, logout } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (viewId: string) => {
    setCurrentView(viewId);
    setIsMobileMenuOpen(false);
  };

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
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
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