import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Heart, 
  Activity, 
  Pill, 
  Syringe, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter,
  User,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { useGetPetHistory, useGetOwnerPets } from '../lib/react-query/QueriesAndMutations';

interface HistoryEntry {
  id: string;
  petId: string;
  petName: string;
  date: string;
  type: 'appointment' | 'vaccination' | 'prescription' | 'health_record' | 'emergency' | 'note';
  title: string;
  description: string;
  veterinarian: string;
  status: 'completed' | 'scheduled' | 'cancelled' | 'active';
  category: string;
  attachments?: string[];
  cost?: number;
  followUpDate?: string;
  priority: 'low' | 'medium' | 'high';
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  birthDate: string;
  microchipId?: string;
  owner: string;
  emergencyContact: string;
}

export function PetHistory() {
  const { user } = useApp();
  const [selectedPet, setSelectedPet] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as const
  });

  const { data: petsData } = useGetOwnerPets();

  const { data: historyData, isLoading: isHistoryLoading } = useGetPetHistory(selectedPet ? Number(selectedPet) : undefined as any);

  const transformHistoryToEntries = (history: any): HistoryEntry[] => {
    if (!history) return [];
    const entries: HistoryEntry[] = [];

    const petName = history.pet?.name ?? '';

    // appointments
    (history.appointments ?? []).forEach((a: any) => {
      entries.push({
        id: `appointment-${a.id}`,
        petId: String(a.pet_id || history.pet?.id || ''),
        petName,
        date: a.date,
        type: 'appointment',
        title: a.type || 'Appointment',
        description: a.notes || '',
        veterinarian: a.veterinarian || '',
        status: a.status || 'completed',
        category: a.condition || '',
        attachments: [],
        cost: a.cost ?? undefined,
        followUpDate: a.follow_up_date ?? undefined,
        priority: a.priority ?? 'medium'
      });
    });

    // vaccinations
    (history.vaccinations ?? []).forEach((v: any) => {
      entries.push({
        id: `vaccination-${v.id}`,
        petId: String(v.patient_id || history.pet?.id || ''),
        petName,
        date: v.administered_date ? v.administered_date.split('T')[0] : v.administered_date,
        type: 'vaccination',
        title: v.vaccine_name || 'Vaccination',
        description: v.notes || '',
        veterinarian: v.administered_by || '',
        status: v.status || 'completed',
        category: v.vaccine_type || '',
        attachments: [],
        priority: 'low'
      });
    });

    // prescriptions
    (history.prescriptions ?? []).forEach((p: any) => {
      entries.push({
        id: `prescription-${p.id}`,
        petId: String(p.pet_id || history.pet?.id || ''),
        petName,
        date: p.prescribed_date || p.start_date || '',
        type: 'prescription',
        title: p.medication_name || 'Prescription',
        description: p.instructions || '',
        veterinarian: p.veterinarian || '',
        status: p.status || 'active',
        category: p.category || '',
        attachments: [],
        cost: p.cost ? Number(p.cost) : undefined,
        priority: 'medium'
      });
    });

    // records (medical records)
    (history.records ?? []).forEach((r: any) => {
      entries.push({
        id: `record-${r.id}`,
        petId: String(r.pet_id || history.pet?.id || ''),
        petName,
        date: r.date || '',
        type: 'health_record',
        title: r.title || r.type || 'Medical Record',
        description: r.notes || r.treatment || '',
        veterinarian: r.veterinarian || '',
        status: 'completed',
        category: r.type || '',
        attachments: [],
        priority: r.priority ?? 'medium'
      });
    });

    // medical_notes (string)
    if (history.medical_notes) {
      entries.push({
        id: `medical-notes-1`,
        petId: String(history.pet?.id || ''),
        petName,
        date: history.pet?.updated_at?.split('T')[0] || '',
        type: 'note',
        title: 'Medical Notes',
        description: String(history.medical_notes),
        veterinarian: '',
        status: 'completed',
        category: 'Notes',
        attachments: [],
        priority: 'low'
      });
    }

    return entries;
  };

  const pets = (petsData ?? []).map((p: any) => ({
    id: String(p.id),
    name: p.name,
    species: p.species,
    breed: p.breed,
    age: p.age !== undefined ? String(p.age) : '',
    weight: p.weight ?? '',
    birthDate: p.date_of_birth ?? '',
    microchipId: p.microchip_id ?? '',
    owner: p.owner_name ?? '',
    emergencyContact: p.emergency_contact?.phone ?? ''
  } as Pet));

  // derive entries from API response
  const historyEntries: HistoryEntry[] = transformHistoryToEntries(historyData);

  const selectedPetData = pets.find((pet: Pet) => pet.id === selectedPet) || (historyData?.pet ? {
    id: String(historyData.pet.id),
    name: historyData.pet.name,
    species: historyData.pet.species,
    breed: historyData.pet.breed,
    age: String(historyData.pet.age ?? ''),
    weight: historyData.pet.weight ?? '',
    birthDate: historyData.pet.date_of_birth ?? '',
    microchipId: historyData.pet.microchip_id ?? '',
    owner: historyData.pet.owner_name ?? '',
    emergencyContact: historyData.pet.emergency_contact?.phone ?? ''
  } as Pet : undefined);

  useEffect(() => {
    if ((!selectedPet || selectedPet === '') && pets.length > 0) {
      setSelectedPet(pets[0].id);
    }
  }, [pets]);
  const filteredEntries = historyEntries
    .filter(entry => entry.petId === selectedPet)
    .filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || entry.type === typeFilter;
      
      let matchesDate = true;
      if (dateRange !== 'all') {
        const entryDate = new Date(entry.date);
        const now = new Date();
        switch (dateRange) {
          case 'week':
            matchesDate = (now.getTime() - entryDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
            break;
          case 'month':
            matchesDate = (now.getTime() - entryDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
            break;
          case 'year':
            matchesDate = (now.getTime() - entryDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
            break;
        }
      }
      
      return matchesSearch && matchesType && matchesDate;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Stethoscope className="w-4 h-4" />;
      case 'vaccination': return <Syringe className="w-4 h-4" />;
      case 'prescription': return <Pill className="w-4 h-4" />;
      case 'health_record': return <Heart className="w-4 h-4" />;
      case 'emergency': return <AlertCircle className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <ClipboardList className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'vaccination': return 'bg-green-100 text-green-800 border-green-200';
      case 'prescription': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'health_record': return 'bg-red-100 text-red-800 border-red-200';
      case 'emergency': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'note': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAddNote = () => {
    const note: HistoryEntry = {
      id: Date.now().toString(),
      petId: selectedPet,
      petName: selectedPetData?.name || '',
      date: new Date().toISOString().split('T')[0],
      type: 'note',
      title: newNote.title,
      description: newNote.description,
      veterinarian: user?.name || 'Current User',
      status: 'completed',
      category: newNote.category,
      priority: newNote.priority
    };

    console.log('Adding note:', note);
    setIsAddNoteOpen(false);
    setNewNote({
      title: '',
      description: '',
      category: '',
      priority: 'medium'
    });
  };

  const getHealthScore = () => {
    const recentEntries = historyEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return entryDate >= sixMonthsAgo && entry.petId === selectedPet;
    });

    const emergencyCount = recentEntries.filter(e => e.type === 'emergency').length;
    const vaccinationCount = recentEntries.filter(e => e.type === 'vaccination').length;
    const checkupCount = recentEntries.filter(e => e.type === 'appointment' && e.category === 'Wellness').length;

    let score = 85;
    score -= emergencyCount * 10;
    score += vaccinationCount * 5;
    score += checkupCount * 3;

    return Math.max(Math.min(score, 100), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pet History</h1>
          <p className="text-gray-600 mt-1">Comprehensive medical and care history</p>
        </div>
       
      </div>

      {/* Pet Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Label htmlFor="petSelect">Select Pet</Label>
              <Select value={selectedPet} onValueChange={setSelectedPet}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet: Pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} - {pet.species} ({pet.breed})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pet Overview */}
      {selectedPetData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Pet Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Name</p>
                  <p className="text-sm text-gray-600">{selectedPetData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Species</p>
                  <p className="text-sm text-gray-600">{selectedPetData.species}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Breed</p>
                  <p className="text-sm text-gray-600">{selectedPetData.breed}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Age</p>
                  <p className="text-sm text-gray-600">{selectedPetData.age}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Weight</p>
                  <p className="text-sm text-gray-600">{selectedPetData.weight}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Birth Date</p>
                  <p className="text-sm text-gray-600">{new Date(selectedPetData.birthDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Owner</p>
                  <p className="text-sm text-gray-600">{selectedPetData.owner}</p>
                </div>
                {selectedPetData.microchipId && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Microchip</p>
                    <p className="text-sm text-gray-600">{selectedPetData.microchipId}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{getHealthScore()}</div>
                <Progress value={getHealthScore()} className="mb-4" />
                <p className="text-sm text-gray-600">
                  Based on recent medical history and preventive care
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="appointment">Appointments</SelectItem>
                <SelectItem value="vaccination">Vaccinations</SelectItem>
                <SelectItem value="prescription">Prescriptions</SelectItem>
                <SelectItem value="health_record">Health Records</SelectItem>
                <SelectItem value="emergency">Emergencies</SelectItem>
                <SelectItem value="note">Notes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="week">Last week</SelectItem>
                <SelectItem value="month">Last month</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History Timeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Medical History Timeline ({filteredEntries.length} entries)
        </h2>
        
        {filteredEntries.map((entry, index) => (
          <Card key={entry.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(entry.type)}`}>
                    {getTypeIcon(entry.type)}
                  </div>
                  {index < filteredEntries.length - 1 && (
                    <div className="w-px h-8 bg-gray-200 mt-4"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{entry.title}</h3>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(entry.priority)}`}></div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getTypeColor(entry.type)}>
                      {entry.type.replace('_', ' ').charAt(0).toUpperCase() + entry.type.replace('_', ' ').slice(1)}
                    </Badge>
                    <Badge variant="outline">{entry.category}</Badge>
                    {entry.cost && (
                      <Badge variant="outline">${entry.cost}</Badge>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{entry.description}</p>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>Dr. {entry.veterinarian}</span>
                      {entry.followUpDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Follow-up: {new Date(entry.followUpDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                      {(user?.role === 'veterinarian' || user?.role === 'admin') && (
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredEntries.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No history entries found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || typeFilter !== 'all' || dateRange !== 'all'
                  ? 'Try adjusting your search criteria'
                  : `No history entries found for ${selectedPetData?.name}`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}