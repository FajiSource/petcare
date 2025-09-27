import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Clock, 
  User,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Phone,
  Mail
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Textarea } from '../ui/textarea';

interface Appointment {
  id: string;
  petId: string;
  petName: string;
  petSpecies: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  veterinarianId: string;
  veterinarianName: string;
  clinicId: string;
  clinicName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  reason: string;
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  cost?: number;
  isPaid: boolean;
  createdDate: string;
  lastModified: string;
}

export function AllAppointments() {
  const { user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [veterinarianFilter, setVeterinarianFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    petId: '',
    veterinarianId: '',
    clinicId: '',
    date: '',
    time: '',
    duration: '30',
    type: '',
    priority: 'medium' as const,
    reason: '',
    notes: ''
  });

  // Mock data - in real app, this would come from API
  const appointments: Appointment[] = [
    {
      id: '1',
      petId: '1',
      petName: 'Buddy',
      petSpecies: 'Dog',
      ownerId: 'owner1',
      ownerName: 'John Smith',
      ownerEmail: 'john.smith@email.com',
      ownerPhone: '(555) 123-4567',
      veterinarianId: 'vet1',
      veterinarianName: 'Dr. Sarah Johnson',
      clinicId: '1',
      clinicName: 'PetCare Veterinary Clinic',
      date: '2024-11-20',
      time: '09:00',
      duration: 30,
      type: 'Routine Checkup',
      status: 'scheduled',
      priority: 'low',
      reason: 'Annual wellness examination',
      notes: 'Owner reports pet is eating well and active',
      followUpRequired: false,
      cost: 85.00,
      isPaid: false,
      createdDate: '2024-11-10',
      lastModified: '2024-11-10'
    },
    {
      id: '2',
      petId: '2',
      petName: 'Whiskers',
      petSpecies: 'Cat',
      ownerId: 'owner1',
      ownerName: 'John Smith',
      ownerEmail: 'john.smith@email.com',
      ownerPhone: '(555) 123-4567',
      veterinarianId: 'vet2',
      veterinarianName: 'Dr. Michael Chen',
      clinicId: '2',
      clinicName: 'Animal Health Center',
      date: '2024-11-18',
      time: '14:30',
      duration: 45,
      type: 'Vaccination',
      status: 'confirmed',
      priority: 'medium',
      reason: 'Annual FVRCP vaccination',
      followUpRequired: true,
      followUpDate: '2024-12-18',
      cost: 45.00,
      isPaid: true,
      createdDate: '2024-11-05',
      lastModified: '2024-11-15'
    },
    {
      id: '3',
      petId: '3',
      petName: 'Max',
      petSpecies: 'Dog',
      ownerId: 'owner2',
      ownerName: 'Sarah Johnson',
      ownerEmail: 'sarah.johnson@email.com',
      ownerPhone: '(555) 456-7890',
      veterinarianId: 'vet1',
      veterinarianName: 'Dr. Sarah Johnson',
      clinicId: '1',
      clinicName: 'PetCare Veterinary Clinic',
      date: '2024-11-15',
      time: '11:00',
      duration: 60,
      type: 'Surgery Consultation',
      status: 'completed',
      priority: 'high',
      reason: 'Pre-surgery evaluation for hip dysplasia',
      notes: 'Surgery scheduled for next week. Pre-op instructions given.',
      followUpRequired: true,
      followUpDate: '2024-11-22',
      cost: 125.00,
      isPaid: true,
      createdDate: '2024-11-01',
      lastModified: '2024-11-15'
    },
    {
      id: '4',
      petId: '4',
      petName: 'Luna',
      petSpecies: 'Cat',
      ownerId: 'owner3',
      ownerName: 'Emily Davis',
      ownerEmail: 'emily.davis@email.com',
      ownerPhone: '(555) 789-0123',
      veterinarianId: 'vet3',
      veterinarianName: 'Dr. Emily Rodriguez',
      clinicId: '3',
      clinicName: 'City Pet Hospital',
      date: '2024-11-22',
      time: '16:00',
      duration: 30,
      type: 'Emergency',
      status: 'scheduled',
      priority: 'emergency',
      reason: 'Difficulty breathing, lethargy',
      notes: 'Emergency appointment - possible respiratory infection',
      followUpRequired: false,
      cost: 200.00,
      isPaid: false,
      createdDate: '2024-11-22',
      lastModified: '2024-11-22'
    },
    {
      id: '5',
      petId: '1',
      petName: 'Buddy',
      petSpecies: 'Dog',
      ownerId: 'owner1',
      ownerName: 'John Smith',
      ownerEmail: 'john.smith@email.com',
      ownerPhone: '(555) 123-4567',
      veterinarianId: 'vet2',
      veterinarianName: 'Dr. Michael Chen',
      clinicId: '2',
      clinicName: 'Animal Health Center',
      date: '2024-11-12',
      time: '10:00',
      duration: 30,
      type: 'Dental Cleaning',
      status: 'no_show',
      priority: 'medium',
      reason: 'Routine dental cleaning and examination',
      cost: 150.00,
      isPaid: false,
      createdDate: '2024-10-28',
      lastModified: '2024-11-12'
    }
  ];

  const veterinarians = [
    { id: 'vet1', name: 'Dr. Sarah Johnson' },
    { id: 'vet2', name: 'Dr. Michael Chen' },
    { id: 'vet3', name: 'Dr. Emily Rodriguez' }
  ];

  const appointmentTypes = [
    'Routine Checkup',
    'Vaccination',
    'Surgery',
    'Surgery Consultation',
    'Dental Cleaning',
    'Emergency',
    'Follow-up',
    'Diagnostic',
    'Grooming',
    'Other'
  ];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.veterinarianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || appointment.priority === priorityFilter;
    const matchesVeterinarian = veterinarianFilter === 'all' || appointment.veterinarianId === veterinarianFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      switch (dateFilter) {
        case 'today':
          matchesDate = appointmentDate.toDateString() === today.toDateString();
          break;
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          matchesDate = appointmentDate.toDateString() === tomorrow.toDateString();
          break;
        case 'week':
          const weekFromNow = new Date(today);
          weekFromNow.setDate(today.getDate() + 7);
          matchesDate = appointmentDate >= today && appointmentDate <= weekFromNow;
          break;
        case 'past':
          matchesDate = appointmentDate < today;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesVeterinarian && matchesDate;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime();
      case 'pet':
        return a.petName.localeCompare(b.petName);
      case 'owner':
        return a.ownerName.localeCompare(b.ownerName);
      case 'veterinarian':
        return a.veterinarianName.localeCompare(b.veterinarianName);
      case 'priority':
        const priorityOrder = { emergency: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'no_show': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Calendar className="w-3 h-3 mr-1" />;
      case 'confirmed': return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'in_progress': return <Clock className="w-3 h-3 mr-1" />;
      case 'completed': return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'cancelled': return <XCircle className="w-3 h-3 mr-1" />;
      case 'no_show': return <AlertCircle className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  const handleAddAppointment = () => {
    // In real app, this would make an API call
    console.log('Adding appointment:', newAppointment);
    setIsAddDialogOpen(false);
    setNewAppointment({
      petId: '',
      veterinarianId: '',
      clinicId: '',
      date: '',
      time: '',
      duration: '30',
      type: '',
      priority: 'medium',
      reason: '',
      notes: ''
    });
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsViewDialogOpen(true);
  };

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    // In real app, this would make an API call
    console.log('Changing status for appointment', appointmentId, 'to', newStatus);
  };

  const totalAppointments = appointments.length;
  const todayAppointments = appointments.filter(a => {
    const today = new Date().toDateString();
    return new Date(a.date).toDateString() === today;
  }).length;
  const emergencyAppointments = appointments.filter(a => a.priority === 'emergency').length;
  const pendingPayments = appointments.filter(a => !a.isPaid && a.cost && a.cost > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Appointments Management</h1>
          <p className="text-gray-600 mt-1">System-wide appointment scheduling and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Schedule
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                  Create a new appointment in the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="petId">Pet ID</Label>
                  <Input
                    id="petId"
                    value={newAppointment.petId}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, petId: e.target.value }))}
                    placeholder="Pet identifier"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="veterinarianId">Veterinarian</Label>
                  <Select value={newAppointment.veterinarianId} onValueChange={(value) => setNewAppointment(prev => ({ ...prev, veterinarianId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select veterinarian" />
                    </SelectTrigger>
                    <SelectContent>
                      {veterinarians.map(vet => (
                        <SelectItem key={vet.id} value={vet.id}>
                          {vet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicId">Clinic ID</Label>
                  <Input
                    id="clinicId"
                    value={newAppointment.clinicId}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, clinicId: e.target.value }))}
                    placeholder="Clinic identifier"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select value={newAppointment.type} onValueChange={(value) => setNewAppointment(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    max="180"
                    value={newAppointment.duration}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, duration: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newAppointment.priority} onValueChange={(value: any) => setNewAppointment(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input
                    id="reason"
                    value={newAppointment.reason}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Brief description of the visit reason"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes or special instructions"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAppointment} className="bg-blue-600 hover:bg-blue-700">
                  Schedule Appointment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-blue-600">{totalAppointments}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-green-600">{todayAppointments}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emergency Cases</p>
                <p className="text-2xl font-bold text-red-600">{emergencyAppointments}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-orange-600">{pendingPayments}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {emergencyAppointments > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {emergencyAppointments} emergency appointment{emergencyAppointments > 1 ? 's' : ''} require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search appointments, pets, owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={veterinarianFilter} onValueChange={setVeterinarianFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Veterinarian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vets</SelectItem>
                {veterinarians.map(vet => (
                  <SelectItem key={vet.id} value={vet.id}>
                    {vet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date/Time</SelectItem>
                <SelectItem value="pet">Pet Name</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="veterinarian">Veterinarian</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointment List */}
      <div className="grid gap-4">
        {sortedAppointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(appointment.priority)} mb-2`}></div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.type}</h3>
                      <p className="text-sm text-gray-600">
                        {appointment.petName} ({appointment.petSpecies}) - {appointment.ownerName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusIcon(appointment.status)}
                        {appointment.status.replace('_', ' ').charAt(0).toUpperCase() + appointment.status.replace('_', ' ').slice(1)}
                      </Badge>
                      {appointment.priority === 'emergency' && (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          Emergency
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Date & Time</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {new Date(appointment.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {appointment.time} ({appointment.duration}min)
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Veterinarian</p>
                      <p className="text-gray-600">{appointment.veterinarianName}</p>
                      <p className="text-gray-600 text-xs">{appointment.clinicName}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Contact Info</p>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600 text-xs">{appointment.ownerPhone}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600 text-xs">{appointment.ownerEmail}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Details</p>
                      <p className="text-gray-600 text-xs">{appointment.reason}</p>
                      {appointment.cost && (
                        <p className="text-gray-600 text-xs">
                          Cost: ${appointment.cost} {appointment.isPaid ? '(Paid)' : '(Pending)'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => handleViewAppointment(appointment)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    {appointment.status === 'scheduled' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Confirm
                      </Button>
                    )}
                    {appointment.status === 'confirmed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(appointment.id, 'in_progress')}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {appointment.status === 'in_progress' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(appointment.id, 'completed')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedAppointments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || veterinarianFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'No appointments scheduled in the system'}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule First Appointment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Appointment Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Appointment Details - {selectedAppointment.type}
                </DialogTitle>
                <DialogDescription>
                  Complete information for appointment on {new Date(selectedAppointment.date).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="patient">Patient Info</TabsTrigger>
                  <TabsTrigger value="medical">Medical Notes</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date & Time</Label>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}
                      </p>
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <p className="text-sm text-gray-600">{selectedAppointment.duration} minutes</p>
                    </div>
                    <div>
                      <Label>Type</Label>
                      <p className="text-sm text-gray-600">{selectedAppointment.type}</p>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedAppointment.priority)}`}></div>
                        <span className="text-sm text-gray-600 capitalize">{selectedAppointment.priority}</span>
                      </div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={getStatusColor(selectedAppointment.status)}>
                        {getStatusIcon(selectedAppointment.status)}
                        {selectedAppointment.status.replace('_', ' ').charAt(0).toUpperCase() + selectedAppointment.status.replace('_', ' ').slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <Label>Veterinarian</Label>
                      <p className="text-sm text-gray-600">{selectedAppointment.veterinarianName}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Reason for Visit</Label>
                    <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                      {selectedAppointment.reason}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="patient" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Pet Name</Label>
                      <p className="text-sm text-gray-600">{selectedAppointment.petName}</p>
                    </div>
                    <div>
                      <Label>Species</Label>
                      <p className="text-sm text-gray-600">{selectedAppointment.petSpecies}</p>
                    </div>
                    <div>
                      <Label>Owner Name</Label>
                      <p className="text-sm text-gray-600">{selectedAppointment.ownerName}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-gray-600">{selectedAppointment.ownerEmail}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="text-sm text-gray-600">{selectedAppointment.ownerPhone}</p>
                    </div>
                    <div>
                      <Label>Clinic</Label>
                      <p className="text-sm text-gray-600">{selectedAppointment.clinicName}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="medical" className="space-y-4">
                  <div>
                    <Label>Appointment Notes</Label>
                    <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                      {selectedAppointment.notes || 'No notes available'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Follow-up Required</Label>
                      <p className="text-sm text-gray-600">
                        {selectedAppointment.followUpRequired ? 'Yes' : 'No'}
                      </p>
                    </div>
                    {selectedAppointment.followUpDate && (
                      <div>
                        <Label>Follow-up Date</Label>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedAppointment.followUpDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="billing" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Appointment Cost</Label>
                      <p className="text-sm text-gray-600">
                        {selectedAppointment.cost ? `$${selectedAppointment.cost}` : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <Label>Payment Status</Label>
                      <Badge variant={selectedAppointment.isPaid ? "default" : "outline"}>
                        {selectedAppointment.isPaid ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                    <div>
                      <Label>Created Date</Label>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedAppointment.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label>Last Modified</Label>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedAppointment.lastModified).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}