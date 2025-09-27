import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  Download,
  FileText,
  PawPrint,
  Heart,
  Activity,
  DollarSign,
  Clock,
  Stethoscope,
  AlertTriangle,
  Shield,
  Pill,
  Syringe,
  Eye,
  Filter,
  Star,
  Target,
  Award,
  CheckCircle,
  Printer,
  Mail,
  Share2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart, RadialBarChart, RadialBar } from 'recharts';
import { useApp } from '../contexts/AppContext';

export function PetOwnerReports() {
  const { pets, setCurrentView } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('last6months');
  const [selectedPet, setSelectedPet] = useState('all');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isSchedulingDialogOpen, setIsSchedulingDialogOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);

  // Mock data for pet owner reports
  const healthTrendData = [
    { month: 'Jan', weight: 25.2, wellness: 85, visits: 1 },
    { month: 'Feb', weight: 25.5, wellness: 88, visits: 0 },
    { month: 'Mar', weight: 25.8, wellness: 82, visits: 2 },
    { month: 'Apr', weight: 26.1, wellness: 90, visits: 1 },
    { month: 'May', weight: 25.9, wellness: 92, visits: 1 },
    { month: 'Jun', weight: 25.7, wellness: 89, visits: 0 },
  ];

  const vaccinationData = [
    { name: 'Up to Date', value: 8, color: '#10B981' },
    { name: 'Due Soon', value: 2, color: '#F59E0B' },
    { name: 'Overdue', value: 1, color: '#EF4444' },
  ];

  const appointmentTypeData = [
    { type: 'Routine Checkup', count: 4, percentage: 40 },
    { type: 'Vaccination', count: 3, percentage: 30 },
    { type: 'Dental Care', count: 2, percentage: 20 },
    { type: 'Emergency', count: 1, percentage: 10 },
  ];

  const expenseData = [
    { month: 'Jan', routine: 150, emergency: 0, medication: 45, total: 195 },
    { month: 'Feb', routine: 0, emergency: 0, medication: 45, total: 45 },
    { month: 'Mar', routine: 180, emergency: 320, medication: 65, total: 565 },
    { month: 'Apr', routine: 75, emergency: 0, medication: 45, total: 120 },
    { month: 'May', routine: 150, emergency: 0, medication: 45, total: 195 },
    { month: 'Jun', routine: 0, emergency: 0, medication: 45, total: 45 },
  ];

  const wellnessMetrics = {
    overallWellness: 89,
    weightTrend: 'stable',
    vaccinationCompliance: 85,
    appointmentAttendance: 95,
    medicationCompliance: 92,
    exerciseScore: 78,
    nutritionScore: 85,
    preventiveCareScore: 88
  };

  const petProfiles = [
    {
      id: '1',
      name: 'Buddy',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 5,
      wellness: 92,
      lastVisit: '2025-01-15',
      nextDue: '2025-07-15',
      imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      name: 'Whiskers',
      species: 'Cat',
      breed: 'Persian',
      age: 3,
      wellness: 86,
      lastVisit: '2025-01-10',
      nextDue: '2025-04-10',
      imageUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=400&fit=crop'
    }
  ];

  const upcomingReminders = [
    {
      id: '1',
      type: 'vaccination',
      title: 'Rabies Vaccination Due',
      petName: 'Buddy',
      dueDate: '2025-02-15',
      priority: 'high',
      description: 'Annual rabies vaccination is due'
    },
    {
      id: '2',
      type: 'checkup',
      title: 'Annual Checkup',
      petName: 'Whiskers',
      dueDate: '2025-02-20',
      priority: 'medium',
      description: 'Routine annual health examination'
    },
    {
      id: '3',
      type: 'medication',
      title: 'Flea Prevention',
      petName: 'Buddy',
      dueDate: '2025-01-25',
      priority: 'low',
      description: 'Monthly flea and tick prevention'
    }
  ];

  const achievements = [
    {
      id: '1',
      title: 'Perfect Attendance',
      description: 'Attended all scheduled appointments this year',
      icon: Award,
      earned: true,
      date: '2025-01-01'
    },
    {
      id: '2',
      title: 'Wellness Champion',
      description: 'Maintained wellness score above 90% for 3 months',
      icon: Star,
      earned: true,
      date: '2025-01-10'
    },
    {
      id: '3',
      title: 'Vaccination Hero',
      description: 'All vaccinations up to date',
      icon: Shield,
      earned: false,
      date: null
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccination':
        return Syringe;
      case 'checkup':
        return Stethoscope;
      case 'medication':
        return Pill;
      default:
        return AlertTriangle;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Filter data based on selected pet and period
  const getFilteredData = () => {
    // In a real app, this would filter based on the selectedPet and selectedPeriod
    // For now, we'll simulate different data based on filters
    let filteredHealthData = [...healthTrendData];
    let filteredExpenseData = [...expenseData];
    
    if (selectedPeriod === 'last30days') {
      filteredHealthData = healthTrendData.slice(-1);
      filteredExpenseData = expenseData.slice(-1);
    } else if (selectedPeriod === 'last3months') {
      filteredHealthData = healthTrendData.slice(-3);
      filteredExpenseData = expenseData.slice(-3);
    }
    
    return { filteredHealthData, filteredExpenseData };
  };

  // Export functions
  const exportToPDF = () => {
    toast.success('PDF export started! Check your downloads folder.');
    setIsExportDialogOpen(false);
    // In a real app, you would generate and download a PDF here
  };

  const exportToCSV = () => {
    toast.success('CSV export started! Check your downloads folder.');
    setIsExportDialogOpen(false);
    // In a real app, you would generate and download a CSV here
  };

  const printReport = () => {
    window.print();
    setIsExportDialogOpen(false);
    toast.success('Print dialog opened');
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pet Health Report',
        text: 'Check out my pet\'s health report from PetCare Connect',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Report link copied to clipboard!');
    }
    setIsExportDialogOpen(false);
  };

  // Schedule appointment function
  const scheduleAppointment = (reminder: any) => {
    setSelectedReminder(reminder);
    setIsSchedulingDialogOpen(true);
  };

  const confirmScheduling = () => {
    toast.success(`Appointment scheduled for ${selectedReminder?.title}`);
    setIsSchedulingDialogOpen(false);
    setSelectedReminder(null);
    // In a real app, this would create a new appointment
  };

  // View pet details
  const viewPetDetails = (petId: string) => {
    toast.info(`Navigating to ${petProfiles.find(p => p.id === petId)?.name}'s detailed health records`);
    // In a real app, this would navigate to pet details page
  };

  // Quick actions
  const updateWellnessGoals = () => {
    toast.success('Wellness goals updated successfully!');
  };

  const requestVetConsultation = () => {
    toast.success('Veterinarian consultation request sent!');
  };

  const { filteredHealthData, filteredExpenseData } = getFilteredData();

  const OverviewReport = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button onClick={updateWellnessGoals} className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Set Wellness Goals
        </Button>
        <Button onClick={requestVetConsultation} variant="outline" className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4" />
          Request Vet Consultation
        </Button>
        <Button onClick={() => setCurrentView('appointments')} variant="outline" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>

      {/* Wellness Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Overall Wellness</p>
                <p className="text-3xl font-bold">{wellnessMetrics.overallWellness}%</p>
              </div>
              <Heart className="h-10 w-10 text-blue-200" />
            </div>
            <div className="mt-4">
              <Progress value={wellnessMetrics.overallWellness} className="h-2 bg-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Vaccination Status</p>
                <p className="text-3xl font-bold">{wellnessMetrics.vaccinationCompliance}%</p>
              </div>
              <Shield className="h-10 w-10 text-green-200" />
            </div>
            <div className="mt-4">
              <Progress value={wellnessMetrics.vaccinationCompliance} className="h-2 bg-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Attendance Rate</p>
                <p className="text-3xl font-bold">{wellnessMetrics.appointmentAttendance}%</p>
              </div>
              <CheckCircle className="h-10 w-10 text-purple-200" />
            </div>
            <div className="mt-4">
              <Progress value={wellnessMetrics.appointmentAttendance} className="h-2 bg-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Care Score</p>
                <p className="text-3xl font-bold">{wellnessMetrics.preventiveCareScore}%</p>
              </div>
              <Star className="h-10 w-10 text-yellow-200" />
            </div>
            <div className="mt-4">
              <Progress value={wellnessMetrics.preventiveCareScore} className="h-2 bg-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Health Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredHealthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="wellness" stroke="#10B981" strokeWidth={2} name="Wellness Score %" />
                <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} name="Weight (lbs)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vaccination Status */}
        <Card>
          <CardHeader>
            <CardTitle>Vaccination Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vaccinationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vaccinationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pet Profiles Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Pet Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {petProfiles.map((pet) => (
              <div key={pet.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={pet.imageUrl} alt={pet.name} />
                    <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{pet.name}</h3>
                    <p className="text-sm text-gray-600">{pet.breed} • {pet.age} years old</p>
                    <p className="text-xs text-gray-500">Last visit: {new Date(pet.lastVisit).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">Wellness Score:</span>
                    <Badge className={pet.wellness >= 90 ? 'bg-green-100 text-green-800' : 
                                    pet.wellness >= 80 ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'}>
                      {pet.wellness}%
                    </Badge>
                  </div>
                  <div className="w-32">
                    <Progress value={pet.wellness} className="h-2" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Next due: {new Date(pet.nextDue).toLocaleDateString()}</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => viewPetDetails(pet.id)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const HealthInsights = () => (
    <div className="space-y-6">
      {/* Wellness Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Exercise Score</p>
            <p className="text-xl font-bold">{wellnessMetrics.exerciseScore}%</p>
            <Progress value={wellnessMetrics.exerciseScore} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <PawPrint className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Nutrition Score</p>
            <p className="text-xl font-bold">{wellnessMetrics.nutritionScore}%</p>
            <Progress value={wellnessMetrics.nutritionScore} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Pill className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Medication Compliance</p>
            <p className="text-xl font-bold">{wellnessMetrics.medicationCompliance}%</p>
            <Progress value={wellnessMetrics.medicationCompliance} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Preventive Care</p>
            <p className="text-xl font-bold">{wellnessMetrics.preventiveCareScore}%</p>
            <Progress value={wellnessMetrics.preventiveCareScore} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Appointment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointmentTypeData.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="font-medium">{appointment.type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{appointment.count} appointments</span>
                  <Badge variant="outline">{appointment.percentage}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Reminders */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Care Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingReminders.map((reminder) => {
              const Icon = getTypeIcon(reminder.type);
              return (
                <div key={reminder.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-500 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{reminder.title}</h4>
                      <Badge className={getPriorityColor(reminder.priority)}>
                        {reminder.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{reminder.petName}</p>
                    <p className="text-xs text-gray-500">{reminder.description}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                    <Button size="sm" className="mt-2" onClick={() => scheduleAppointment(reminder)}>
                      Schedule
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Care Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className={`p-4 rounded-lg border ${achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`h-6 w-6 ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`} />
                    <h4 className={`font-medium ${achievement.earned ? 'text-green-900' : 'text-gray-600'}`}>
                      {achievement.title}
                    </h4>
                  </div>
                  <p className={`text-sm ${achievement.earned ? 'text-green-700' : 'text-gray-500'}`}>
                    {achievement.description}
                  </p>
                  {achievement.earned && achievement.date && (
                    <p className="text-xs text-green-600 mt-2">
                      Earned: {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ExpenseReport = () => (
    <div className="space-y-6">
      {/* Expense Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total This Year</p>
                <p className="text-2xl font-bold">{formatCurrency(1165)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Average</p>
                <p className="text-2xl font-bold">{formatCurrency(194)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Routine Care</p>
                <p className="text-2xl font-bold">{formatCurrency(555)}</p>
              </div>
              <Stethoscope className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emergency Care</p>
                <p className="text-2xl font-bold">{formatCurrency(320)}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Expense Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={filteredExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value as number), 'Amount']} />
              <Area type="monotone" dataKey="routine" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="emergency" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="medication" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span className="font-medium">Routine Care</span>
                <span className="font-bold">{formatCurrency(555)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                <span className="font-medium">Emergency Care</span>
                <span className="font-bold">{formatCurrency(320)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                <span className="font-medium">Medications</span>
                <span className="font-bold">{formatCurrency(290)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Annual Budget</span>
                  <span className="text-sm">{formatCurrency(1200)}</span>
                </div>
                <Progress value={97} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">97% of budget used</p>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Emergency Fund</span>
                  <span className="text-sm">{formatCurrency(500)}</span>
                </div>
                <Progress value={64} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">64% of emergency fund used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">Health trends and insights for your pets</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedPet} onValueChange={setSelectedPet}>
            <SelectTrigger className="w-40">
              <PawPrint className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pets</SelectItem>
              <SelectItem value="1">Buddy</SelectItem>
              <SelectItem value="2">Whiskers</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last3months">Last 3 months</SelectItem>
              <SelectItem value="last6months">Last 6 months</SelectItem>
              <SelectItem value="lastyear">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Report</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <Button onClick={exportToPDF} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Export as PDF
                </Button>
                <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Export as CSV
                </Button>
                <Button onClick={printReport} variant="outline" className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Print Report
                </Button>
                <Button onClick={shareReport} variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="health">
            <Heart className="h-4 w-4 mr-2" />
            Health Insights
          </TabsTrigger>
          <TabsTrigger value="expenses">
            <DollarSign className="h-4 w-4 mr-2" />
            Expenses
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewReport />
        </TabsContent>
        
        <TabsContent value="health">
          <HealthInsights />
        </TabsContent>
        
        <TabsContent value="expenses">
          <ExpenseReport />
        </TabsContent>
      </Tabs>

      {/* Scheduling Dialog */}
      <Dialog open={isSchedulingDialogOpen} onOpenChange={setIsSchedulingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
          </DialogHeader>
          {selectedReminder && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{selectedReminder.title}</h4>
                <p className="text-sm text-gray-600">{selectedReminder.petName}</p>
                <p className="text-xs text-gray-500">{selectedReminder.description}</p>
                <p className="text-xs text-gray-500">Due: {new Date(selectedReminder.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsSchedulingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmScheduling}>
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Confirm Appointment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}