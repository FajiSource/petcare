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
import { ClinicManagement } from './admin/ClinicManagement';
import { VaccinationManagement } from './vet/VaccinationManagement';

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
      // Admin views
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'manage-users':
        return <UserManagement />;
      case 'manage-vets':
        return <VeterinarianManagement />;
      case 'manage-clinics':
        return <ClinicManagement />;
      // case 'all-pets':
      //   return <AllPets />;
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
      // case 'vet-reports':
      //   return <MyReports />;
      case 'vaccinations-management':
        return <VaccinationManagement />;

      // Default fallback based on role
      default:
        if (user?.role === 'admin') {
          return <AdminDashboard />;
        } else if (user?.role === 'veterinarian') {
          return <VeterinarianDashboard />;
        } else if (user?.role === 'pet_owner')  {
          return <Dashboard />;
        }else{
          return 
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