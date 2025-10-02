import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
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
  FileText,
  Eye,
  PawPrint,
  User
} from 'lucide-react';
import { useAddNewNote, useGetAllPets, useGetVetNotes } from '../../lib/react-query/QueriesAndMutations';
import { IMedicalNote, INewMedicalNote, IPet } from '../../lib/types';

const INITIAL_NEW_NOTE = {
  patient_id: 0,
  type: 'examination',
  priority: 'medium',
  status: 'draft',
  title: '',
  complaint: '',
  findings: '',
  diagnosis: '',
  treatment: '',
  recommendations: '',
  follow_up: '',
  medications: [],
  attachments: [],
  tags: [],
  date: '',
  time: ''
}
export function MedicalNotes() {
  const { data: pets, isPending: isGettingPets } = useGetAllPets()
  const { data: notes, isPending: isGettingNotes } = useGetVetNotes()
  const { mutateAsync: addNewNote, isPending: isAddingNewNote } = useAddNewNote()

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedNote, setSelectedNote] = useState<IMedicalNote>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState<INewMedicalNote>(INITIAL_NEW_NOTE);

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

  const filteredNotes = notes?.filter((note: IMedicalNote) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.diagnosis ?? '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || note.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || note.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const recentNotes = filteredNotes?.slice(0, 10);
  const draftNotes = filteredNotes?.filter((note: IMedicalNote) => note.status === 'draft');
  const finalizedNotes = filteredNotes?.filter((note: IMedicalNote) => note.status === 'finalized');


  const handleSaveNote = async () => {
    try {
      await addNewNote(newNote);
      setIsCreating(false);
      setNewNote(INITIAL_NEW_NOTE);
    } catch (error) {
      console.log("Save failed:", error);
    }
  };




  const NoteCard = ({ note }: { note: IMedicalNote }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="h-12 w-12">
              {note.patient_image_url ? (
                <AvatarImage src={note.image} alt={note.patient_name} />
              ) : (
                <AvatarFallback className="bg-blue-100">
                  {note.patient_name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{note.title}</h3>
                <Badge className={getTypeColor(note.type)}>{note.type.toUpperCase()}</Badge>
                <Badge className={getPriorityColor(note.priority)}>{note.priority.toUpperCase()}</Badge>
                <Badge className={getStatusColor(note.status)}>{note.status.toUpperCase()}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <PawPrint className="h-4 w-4" />
                  <span>
                    {note.patient_name} ({note.patient_species})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{note.owner_name}</span>
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
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedNote(note)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
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
      <Dialog open={selectedNote != null} onOpenChange={(open) => {
        if (!open) setSelectedNote(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Medical Note - {selectedNote?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <Label className="font-semibold">Patient Information</Label>
                <div className="space-y-1 mt-2 text-sm">
                  <p><strong>Name:</strong> {selectedNote?.patient_name}</p>
                  <p><strong>Species:</strong> {selectedNote?.patient_species}</p>
                  <p><strong>Breed:</strong> {selectedNote?.patient_breed}</p>
                  <p><strong>Owner:</strong> {selectedNote?.owner_name}</p>
                </div>
              </div>
              <div>
                <Label className="font-semibold">Note Information</Label>
                <div className="space-y-1 mt-2 text-sm">
                  <p><strong>Date:</strong> {formatDateTime(selectedNote?.date, selectedNote?.time)}</p>
                  <p><strong>Type:</strong> {selectedNote?.type}</p>
                  <p><strong>Priority:</strong> {selectedNote?.priority}</p>
                  <p><strong>Status:</strong> {selectedNote?.status}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Chief Complaint</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{selectedNote?.complaint}</p>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Clinical Findings</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{selectedNote?.findings}</p>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Diagnosis</Label>
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm">{selectedNote?.diagnosis}</p>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Treatment</Label>
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm">{selectedNote?.treatment}</p>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Recommendations</Label>
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm">{selectedNote?.recommendations}</p>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Follow-up Plan</Label>
                <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm">{selectedNote?.follow_up}</p>
                </div>
              </div>

              {selectedNote?.medications.length > 0 && (
                <div>
                  <Label className="font-semibold">Medications</Label>
                  <div className="mt-2 p-3 bg-indigo-50 rounded-lg">
                    <ul className="text-sm space-y-1">
                      {selectedNote?.medications.map((med, index) => (
                        <li key={index}>
                          • {med.name} – {med.dosage}, {med.frequency}, {med.duration}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {selectedNote?.attachments.length > 0 && (
                <div>
                  <Label className="font-semibold">Attachments</Label>
                  <div className="mt-2 space-y-2">
                    {selectedNote?.attachments.map((att, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        <FileText className="h-4 w-4" />
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {att.file_name}
                        </a>
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
            {selectedNote?.status === 'draft' && (
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Finalize
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
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
                <div className="space-y-2">
                  <Label htmlFor="pet">Pet</Label>
                  <Select
                    value={String(newNote.patient_id)}
                    onValueChange={(value) =>
                      setNewNote((prev) => ({ ...prev, patient_id: Number(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {pets?.map((pet: IPet) => (
                        <SelectItem key={pet.id} value={String(pet.id)}>
                          {pet.name} ({pet.species})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Note Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Note Type</Label>
                  <Select
                    value={newNote.type}
                    onValueChange={(value) => setNewNote({ ...newNote, type: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <Select
                    value={newNote.priority}
                    onValueChange={(value) => setNewNote({ ...newNote, priority: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Enter note title..."
                />
              </div>

              <div>
                <Label>Chief Complaint</Label>
                <Textarea
                  value={newNote.complaint ?? ''}
                  onChange={(e) => setNewNote({ ...newNote, complaint: e.target.value })}
                  placeholder="Enter chief complaint..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Clinical Findings</Label>
                <Textarea
                  value={newNote.findings ?? ''}
                  onChange={(e) => setNewNote({ ...newNote, findings: e.target.value })}
                  placeholder="Enter clinical findings..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Diagnosis</Label>
                <Textarea
                  value={newNote.diagnosis ?? ''}
                  onChange={(e) => setNewNote({ ...newNote, diagnosis: e.target.value })}
                  placeholder="Enter diagnosis..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Treatment</Label>
                <Textarea
                  value={newNote.treatment ?? ''}
                  onChange={(e) => setNewNote({ ...newNote, treatment: e.target.value })}
                  placeholder="Enter treatment plan..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Recommendations</Label>
                <Textarea
                  value={newNote.recommendations ?? ''}
                  onChange={(e) => setNewNote({ ...newNote, recommendations: e.target.value })}
                  placeholder="Enter recommendations..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Follow-up Plan</Label>
                <Textarea
                  value={newNote.follow_up ?? ''}
                  onChange={(e) => setNewNote({ ...newNote, follow_up: e.target.value })}
                  placeholder="Enter follow-up plan..."
                  rows={2}
                />
              </div>

              {/* Medications */}
              <div>
                <Label>Medications</Label>
                {newNote.medications.map((med, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                    <Input
                      placeholder="Name"
                      value={med.name}
                      onChange={(e) => {
                        const meds = [...newNote.medications];
                        meds[idx].name = e.target.value;
                        setNewNote({ ...newNote, medications: meds });
                      }}
                    />
                    <Input
                      placeholder="Dosage"
                      value={med.dosage}
                      onChange={(e) => {
                        const meds = [...newNote.medications];
                        meds[idx].dosage = e.target.value;
                        setNewNote({ ...newNote, medications: meds });
                      }}
                    />
                    <Input
                      placeholder="Frequency"
                      value={med.frequency}
                      onChange={(e) => {
                        const meds = [...newNote.medications];
                        meds[idx].frequency = e.target.value;
                        setNewNote({ ...newNote, medications: meds });
                      }}
                    />
                    <Input
                      placeholder="Duration"
                      value={med.duration}
                      onChange={(e) => {
                        const meds = [...newNote.medications];
                        meds[idx].duration = e.target.value;
                        setNewNote({ ...newNote, medications: meds });
                      }}
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setNewNote({
                      ...newNote,
                      medications: [...newNote.medications, { name: '', dosage: '', frequency: '', duration: '' }]
                    })
                  }
                >
                  + Add Medication
                </Button>
              </div>

              {/* Attachments */}
              <div>
                <Label>Attachments</Label>
                {newNote.attachments.map((att, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
                    <Input
                      placeholder="File name"
                      value={att.file_name}
                      onChange={(e) => {
                        const atts = [...newNote.attachments];
                        atts[idx].file_name = e.target.value;
                        setNewNote({ ...newNote, attachments: atts });
                      }}
                    />
                    <Input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0];
                          const atts = [...newNote.attachments];
                          atts[idx] = { ...atts[idx], file };
                          setNewNote({ ...newNote, attachments: atts });
                        }
                      }}
                    />
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={() =>
                    setNewNote({
                      ...newNote,
                      attachments: [...newNote.attachments, { file_name: '', url: '' }]
                    })
                  }
                >
                  + Add Attachment
                </Button>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <Input
                  value={newNote.tags.join(', ')}
                  onChange={(e) => setNewNote({ ...newNote, tags: e.target.value.split(',').map(t => t.trim()) })}
                  placeholder="Enter tags separated by commas"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newNote.date}
                    onChange={(e) => setNewNote({ ...newNote, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={newNote.time}
                    onChange={(e) => setNewNote({ ...newNote, time: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button variant="outline" onClick={handleSaveNote}>
                <Save className="h-4 w-4 mr-2" /> Save Draft
              </Button>
              <Button onClick={handleSaveNote}>
                <Save className="h-4 w-4 mr-2" /> Save & Finalize
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
                <p className="text-2xl font-bold">{filteredNotes?.length}</p>
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
                <p className="text-2xl font-bold text-orange-600">{draftNotes?.length}</p>
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
                <p className="text-2xl font-bold text-green-600">{finalizedNotes?.length}</p>
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

      {
        isGettingNotes ? (
          <p>Loading...</p>
        ) : (
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recent">
                Recent ({recentNotes?.length})
              </TabsTrigger>
              <TabsTrigger value="drafts">
                Drafts ({draftNotes?.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All Notes ({filteredNotes?.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              {recentNotes?.length > 0 ? (
                recentNotes?.map((note: IMedicalNote) => (
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
              {draftNotes?.length > 0 ? (
                draftNotes?.map((note: IMedicalNote) => (
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
              {filteredNotes?.length > 0 ? (
                filteredNotes?.map((note: IMedicalNote) => (
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
        )
      }
    </div>
  );
}