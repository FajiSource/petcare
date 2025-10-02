import { useApp } from '../contexts/AppContext';
import { RoleSidebar } from './RoleSidebar';
import { Dashboard } from './Dashboard';
import { AdminDashboard } from './AdminDashboard';
import { VeterinarianDashboard } from './VeterinarianDashboard';
import { Appointments } from './Appointments';
import { HealthRecords } from './HealthRecords';
import { AIChatbot } from './AIChatbot';
import { Vaccinations } from './Vaccinations';
import { Prescriptions } from './Prescriptions';
import { PetHistory } from './PetHistory';
import { UserManagement } from './admin/UserManagement';
import { VeterinarianManagement } from './admin/VeterinarianManagement';
import { SystemReports } from './admin/SystemReports';
import { AllPets } from './admin/AllPets';
import { AllAppointments } from './admin/AllAppointments';
import { SystemSettings } from './admin/SystemSettings';
import { MyAppointments } from './vet/MyAppointments';
import { MyPatients } from './vet/MyPatients';
import { MedicalNotes } from './vet/MedicalNotes';
import { MyReports } from './vet/MyReports';
import { PetOwnerReports } from './PetOwnerReports';

// Admin-specific components (placeholders for now implemented ones)
function ManageClinics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Manage Clinics</h1>
        <p className="text-gray-600 mt-1">Clinic and facility management</p>
      </div>
      <div className="text-center py-12 text-gray-500">
        <p>Clinic management interface coming soon!</p>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  const { currentView, user } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      // Pet Owner views
      case 'dashboard':
        return <Dashboard />;
      case 'appointments':
        return <Appointments />;
      case 'health-records':
        return <HealthRecords />;
      case 'vaccinations':
        return <Vaccinations />;
      case 'prescriptions':
        return <Prescriptions />;
      case 'chatbot':
        return <AIChatbot />;
      case 'pet-history':
        return <PetHistory />;
      case 'reports':
        return <PetOwnerReports />;
      
      // Admin views
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'manage-users':
        return <UserManagement />;
      case 'manage-vets':
        return <VeterinarianManagement />;
      case 'manage-clinics':
        return <ManageClinics />;
      case 'all-pets':
        return <AllPets />;
      case 'all-appointments':
        return <AllAppointments />;
      case 'system-reports':
        return <SystemReports />;
      case 'system-settings':
        return <SystemSettings />;
      
      // Veterinarian views
      case 'vet-dashboard':
        return <VeterinarianDashboard />;
      case 'my-appointments':
        return <MyAppointments />;
      case 'my-patients':
        return <MyPatients />;
      case 'medical-notes':
        return <MedicalNotes />;
      case 'vet-reports':
        return <MyReports />;
      
      // Default fallback based on role
      default:
        if (user?.role === 'admin') {
          return <AdminDashboard />;
        } else if (user?.role === 'veterinarian') {
          return <VeterinarianDashboard />;
        } else {
          return <Dashboard />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleSidebar />
      
      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}