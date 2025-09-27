import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  ClipboardList, 
  Search, 
  Filter,
  Plus,
  Edit,
  Save,
  X,
  Calendar,
  Clock,
  FileText,
  Stethoscope,
  AlertTriangle,
  Eye,
  PawPrint,
  User
} from 'lucide-react';

interface MedicalNote {
  id: string;
  date: string;
  time: string;
  patientId: string;
  patientName: string;
  patientSpecies: string;
  patientBreed: string;
  ownerName: string;
  type: 'examination' | 'diagnosis' | 'treatment' | 'follow-up' | 'surgery' | 'emergency' | 'vaccination' | 'behavioral';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  complaint: string;
  findings: string;
  diagnosis: string;
  treatment: string;
  recommendations: string;
  followUp: string;
  medications: string[];
  attachments: string[];
  status: 'draft' | 'finalized' | 'reviewed';
  tags: string[];
  patientImageUrl?: string;
}

export function MedicalNotes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedNote, setSelectedNote] = useState<MedicalNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState<Partial<MedicalNote>>({
    type: 'examination',
    priority: 'medium',
    status: 'draft',
    title: '',
    complaint: '',
    findings: '',
    diagnosis: '',
    treatment: '',
    recommendations: '',
    followUp: '',
    medications: [],
    tags: []
  });

  // Mock medical notes data
  const medicalNotes: MedicalNote[] = [
    {
      id: '1',
      date: '2025-01-20',
      time: '09:30',
      patientId: '1',
      patientName: 'Buddy',
      patientSpecies: 'Dog',
      patientBreed: 'Golden Retriever',
      ownerName: 'John Smith',
      type: 'examination',
      priority: 'medium',
      title: 'Annual Health Examination',
      complaint: 'Routine annual checkup',
      findings: 'Patient appears healthy and alert. Normal heart rate (95 bpm), normal respiration (25/min). Weight: 32.5kg (within normal range). Eyes clear, ears clean. Dental examination shows mild tartar buildup.',
      diagnosis: 'Healthy adult dog with mild dental tartar',
      treatment: 'No immediate treatment required',
      recommendations: 'Continue current diet and exercise routine. Schedule dental cleaning in 6 months. Maintain regular brushing.',
      followUp: 'Next annual examination in 12 months',
      medications: [],
      attachments: [],
      status: 'finalized',
      tags: ['annual', 'healthy', 'dental'],
      patientImageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      date: '2025-01-20',
      time: '10:45',
      patientId: '2',
      patientName: 'Max',
      patientSpecies: 'Dog',
      patientBreed: 'German Shepherd',
      ownerName: 'Sarah Johnson',
      type: 'treatment',
      priority: 'high',
      title: 'Hip Dysplasia Treatment Follow-up',
      complaint: 'Continued lameness and difficulty rising',
      findings: 'Patient shows improved mobility since starting Rimadyl. Still some stiffness in left hip. Pain response reduced from 7/10 to 4/10. Owner reports increased activity level.',
      diagnosis: 'Hip dysplasia - responding well to treatment',
      treatment: 'Continue Rimadyl 100mg daily. Added joint supplement (glucosamine/chondroitin). Physical therapy exercises demonstrated.',
      recommendations: 'Weight management crucial - maintain current weight. Swimming if possible. Soft bedding. Avoid hard surfaces for exercise.',
      followUp: 'Recheck in 4 weeks to assess progress',
      medications: ['Rimadyl 100mg daily', 'Joint supplement twice daily'],
      attachments: ['X-ray_hip_20250120.jpg'],
      status: 'finalized',
      tags: ['hip-dysplasia', 'pain-management', 'follow-up'],
      patientImageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop'
    },
    {
      id: '3',
      date: '2025-01-20',
      time: '11:30',
      patientId: '3',
      patientName: 'Luna',
      patientSpecies: 'Cat',
      patientBreed: 'Siamese',
      ownerName: 'Mike Davis',
      type: 'emergency',
      priority: 'urgent',
      title: 'Emergency - Possible Toxin Ingestion',
      complaint: 'Vomiting, lethargy, loss of appetite. Owner suspects chocolate ingestion.',
      findings: 'Patient lethargic but responsive. Temperature 102.8°F (slightly elevated). Mild dehydration. No obvious neurological signs. Heart rate 180 bpm (elevated). Abdominal palpation shows mild discomfort.',
      diagnosis: 'Possible chocolate toxicity - mild to moderate',
      treatment: 'Induced vomiting successfully. Activated charcoal administered. IV fluid therapy started. Anti-nausea medication given.',
      recommendations: 'Hospitalization for 24-hour monitoring. NPO for 6 hours, then bland diet. Monitor for cardiac arrhythmias.',
      followUp: 'Discharge when eating normally and vitals stable',
      medications: ['Activated charcoal', 'Maropitant (Cerenia)', 'IV Lactated Ringers'],
      attachments: ['bloodwork_20250120.pdf'],
      status: 'finalized',
      tags: ['emergency', 'toxicity', 'hospitalization'],
      patientImageUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=400&fit=crop'
    },
    {
      id: '4',
      date: '2025-01-19',
      time: '15:15',
      patientId: '4',
      patientName: 'Whiskers',
      patientSpecies: 'Cat',
      patientBreed: 'Persian',
      ownerName: 'Emily Chen',
      type: 'surgery',
      priority: 'medium',
      title: 'Spay Surgery - Post-Operative Check',
      complaint: 'Post-surgical follow-up examination',
      findings: 'Surgical site healing well. No signs of infection or dehiscence. Patient eating and drinking normally. Elimination normal. Activity level appropriate for post-op day 5.',
      diagnosis: 'Normal post-operative recovery',
      treatment: 'Continue current post-operative care',
      recommendations: 'Remove sutures in 5 days. Continue restricted activity for another week. Monitor incision site daily.',
      followUp: 'Suture removal appointment scheduled for 01/25/2025',
      medications: ['Meloxicam 0.5ml daily for 3 more days'],
      attachments: ['post_op_photos.jpg'],
      status: 'finalized',
      tags: ['surgery', 'spay', 'post-op'],
    },
    {
      id: '5',
      date: '2025-01-19',
      time: '16:30',
      patientId: '5',
      patientName: 'Rocky',
      patientSpecies: 'Dog',
      patientBreed: 'Bulldog',
      ownerName: 'Tom Wilson',
      type: 'follow-up',
      priority: 'medium',
      title: 'Chronic Kidney Disease Management',
      complaint: 'Routine recheck for chronic kidney disease',
      findings: 'Patient stable. BUN and creatinine levels improved slightly from last visit. Appetite good, drinking appropriately. Weight maintained at 25.3kg.',
      diagnosis: 'Chronic kidney disease - stable',
      treatment: 'Continue current management protocol',
      recommendations: 'Maintain renal diet. Fresh water always available. Monitor for changes in appetite or urination.',
      followUp: 'Bloodwork recheck in 3 months',
      medications: ['Kidney support supplement', 'Phosphorus binder with meals'],
      attachments: ['bloodwork_results_20250119.pdf'],
      status: 'draft',
      tags: ['chronic', 'kidney', 'monitoring'],
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'surgery':
        return 'bg-purple-100 text-purple-800';
      case 'examination':
        return 'bg-blue-100 text-blue-800';
      case 'treatment':
        return 'bg-yellow-100 text-yellow-800';
      case 'follow-up':
        return 'bg-green-100 text-green-800';
      case 'vaccination':
        return 'bg-indigo-100 text-indigo-800';
      case 'diagnosis':
        return 'bg-orange-100 text-orange-800';
      case 'behavioral':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'finalized':
        return 'bg-green-100 text-green-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredNotes = medicalNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || note.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || note.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const recentNotes = filteredNotes.slice(0, 10);
  const draftNotes = filteredNotes.filter(note => note.status === 'draft');
  const finalizedNotes = filteredNotes.filter(note => note.status === 'finalized');

  const handleSaveNote = () => {
    // In a real app, this would make an API call
    console.log('Saving note:', newNote);
    setIsCreating(false);
    setNewNote({
      type: 'examination',
      priority: 'medium',
      status: 'draft',
      title: '',
      complaint: '',
      findings: '',
      diagnosis: '',
      treatment: '',
      recommendations: '',
      followUp: '',
      medications: [],
      tags: []
    });
  };

  const NoteCard = ({ note }: { note: MedicalNote }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="h-12 w-12">
              {note.patientImageUrl ? (
                <AvatarImage src={note.patientImageUrl} alt={note.patientName} />
              ) : (
                <AvatarFallback className="bg-blue-100">
                  {note.patientName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{note.title}</h3>
                <Badge className={getTypeColor(note.type)}>
                  {note.type.toUpperCase()}
                </Badge>
                <Badge className={getPriorityColor(note.priority)}>
                  {note.priority.toUpperCase()}
                </Badge>
                <Badge className={getStatusColor(note.status)}>
                  {note.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <PawPrint className="h-4 w-4" />
                  <span>{note.patientName} ({note.patientSpecies})</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{note.ownerName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateTime(note.date, note.time)}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-1">Chief Complaint:</p>
                <p className="text-sm text-gray-700">{note.complaint}</p>
              </div>
              
              {note.diagnosis && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">Diagnosis:</p>
                  <p className="text-sm text-blue-800">{note.diagnosis}</p>
                </div>
              )}
              
              {note.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {note.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 ml-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedNote(note)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Medical Note - {note.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <Label className="font-semibold">Patient Information</Label>
                      <div className="space-y-1 mt-2 text-sm">
                        <p><strong>Name:</strong> {note.patientName}</p>
                        <p><strong>Species:</strong> {note.patientSpecies}</p>
                        <p><strong>Breed:</strong> {note.patientBreed}</p>
                        <p><strong>Owner:</strong> {note.ownerName}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="font-semibold">Note Information</Label>
                      <div className="space-y-1 mt-2 text-sm">
                        <p><strong>Date:</strong> {formatDateTime(note.date, note.time)}</p>
                        <p><strong>Type:</strong> {note.type}</p>
                        <p><strong>Priority:</strong> {note.priority}</p>
                        <p><strong>Status:</strong> {note.status}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="font-semibold">Chief Complaint</Label>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{note.complaint}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="font-semibold">Clinical Findings</Label>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{note.findings}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="font-semibold">Diagnosis</Label>
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm">{note.diagnosis}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="font-semibold">Treatment</Label>
                      <div className="mt-2 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm">{note.treatment}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="font-semibold">Recommendations</Label>
                      <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm">{note.recommendations}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="font-semibold">Follow-up Plan</Label>
                      <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm">{note.followUp}</p>
                      </div>
                    </div>
                    
                    {note.medications.length > 0 && (
                      <div>
                        <Label className="font-semibold">Medications</Label>
                        <div className="mt-2 p-3 bg-indigo-50 rounded-lg">
                          <ul className="text-sm space-y-1">
                            {note.medications.map((medication, index) => (
                              <li key={index}>• {medication}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {note.attachments.length > 0 && (
                      <div>
                        <Label className="font-semibold">Attachments</Label>
                        <div className="mt-2 space-y-2">
                          {note.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm">{attachment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end pt-4 border-t">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Note
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  {note.status === 'draft' && (
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Finalize
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            {note.status === 'draft' && (
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-blue-600" />
            Medical Notes
          </h1>
          <p className="text-gray-600 mt-1">Clinical notes and documentation for your patients</p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Medical Note</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Note Type</Label>
                  <Select value={newNote.type} onValueChange={(value) => setNewNote({...newNote, type: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="examination">Examination</SelectItem>
                      <SelectItem value="diagnosis">Diagnosis</SelectItem>
                      <SelectItem value="treatment">Treatment</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Priority</Label>
                  <Select value={newNote.priority} onValueChange={(value) => setNewNote({...newNote, priority: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Title</Label>
                <Input 
                  value={newNote.title} 
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  placeholder="Enter note title..."
                />
              </div>
              
              <div>
                <Label>Chief Complaint</Label>
                <Textarea 
                  value={newNote.complaint} 
                  onChange={(e) => setNewNote({...newNote, complaint: e.target.value})}
                  placeholder="Enter chief complaint..."
                  rows={2}
                />
              </div>
              
              <div>
                <Label>Clinical Findings</Label>
                <Textarea 
                  value={newNote.findings} 
                  onChange={(e) => setNewNote({...newNote, findings: e.target.value})}
                  placeholder="Enter clinical findings..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Diagnosis</Label>
                <Textarea 
                  value={newNote.diagnosis} 
                  onChange={(e) => setNewNote({...newNote, diagnosis: e.target.value})}
                  placeholder="Enter diagnosis..."
                  rows={2}
                />
              </div>
              
              <div>
                <Label>Treatment</Label>
                <Textarea 
                  value={newNote.treatment} 
                  onChange={(e) => setNewNote({...newNote, treatment: e.target.value})}
                  placeholder="Enter treatment plan..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Recommendations</Label>
                <Textarea 
                  value={newNote.recommendations} 
                  onChange={(e) => setNewNote({...newNote, recommendations: e.target.value})}
                  placeholder="Enter recommendations..."
                  rows={2}
                />
              </div>
              
              <div>
                <Label>Follow-up Plan</Label>
                <Textarea 
                  value={newNote.followUp} 
                  onChange={(e) => setNewNote({...newNote, followUp: e.target.value})}
                  placeholder="Enter follow-up plan..."
                  rows={2}
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button variant="outline" onClick={handleSaveNote}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={handleSaveNote}>
                <Save className="h-4 w-4 mr-2" />
                Save & Finalize
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notes</p>
                <p className="text-2xl font-bold">{filteredNotes.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft Notes</p>
                <p className="text-2xl font-bold text-orange-600">{draftNotes.length}</p>
              </div>
              <Edit className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Finalized Notes</p>
                <p className="text-2xl font-bold text-green-600">{finalizedNotes.length}</p>
              </div>
              <Save className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, patient, diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="examination">Examination</SelectItem>
                <SelectItem value="diagnosis">Diagnosis</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="surgery">Surgery</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="vaccination">Vaccination</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="finalized">Finalized</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notes Tabs */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">
            Recent ({recentNotes.length})
          </TabsTrigger>
          <TabsTrigger value="drafts">
            Drafts ({draftNotes.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Notes ({filteredNotes.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="space-y-4">
          {recentNotes.length > 0 ? (
            recentNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No recent notes found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="drafts" className="space-y-4">
          {draftNotes.length > 0 ? (
            draftNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Edit className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No draft notes</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No notes found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}