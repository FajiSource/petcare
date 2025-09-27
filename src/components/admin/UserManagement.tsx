import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { FormInput } from '../FormInput';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  Calendar,
  Filter,
  Download,
  UserCheck,
  UserX,
  Shield
} from 'lucide-react';
import type { UserRole } from '../../contexts/AppContext';
import { useAddNewUser, useDeleteUser, useGetAllUsers, useUpdateUserStatus } from '../../lib/react-query/QueriesAndMutations';
import { IUser } from '../../lib/types';


export function UserManagement() {
  const { mutateAsync: createUser, isPending: isCreatingUser } = useAddNewUser()
  const { data: users, isPending: isGettingUsers, refetch } = useGetAllUsers()
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser()
  const { mutateAsync: updateUserStatus, isPending: isUpdatingStatus } = useUpdateUserStatus()


  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'pet_owner' as UserRole,
    status: 'active' as const,
    password: ''
  });

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: UserRole) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddUser = async () => {

    try {
      await createUser({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        status: newUser.status
      })
      setIsAddUserOpen(false)

    } catch (error) {
      console.log(error)
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser({ userID: userId });
      refetch()
    } catch (error) {
      console.log(error)
    }
  };

  const handleStatusChange = async (userId: string, newStatus: IUser['status']) => {
    try {
      await updateUserStatus({
        userID: userId,
        status: newStatus
      })
    } catch (error) {
      console.log(error)
      alert("something went wrong")
    }
  };

  const exportUsers = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Name,Email,Role,Status,Registration Date,Last Login\n"
      + users?.map(user =>
        `${user.name},${user.email},${user.role},${user.status},${user.created_at}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and their permissions</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <FormInput
                  id="name"
                  name="name"
                  label="Full Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <FormInput
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: UserRole) =>
                      setNewUser(prev => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pet_owner">Pet Owner</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={newUser.status}
                    onValueChange={(value: any) =>
                      setNewUser(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>
                  Add User
                </Button>
              </div>
            </DialogContent>

          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="pet_owner">Pet Owners</SelectItem>
                  <SelectItem value="veterinarian">Veterinarians</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers?.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="space-y-4">
              {filteredUsers?.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={
                        user.role === 'admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'veterinarian' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                      }>
                        {user.role === 'admin' ? <Shield className="h-5 w-5" /> :
                          user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{user.name}</h3>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {user.role === 'veterinarian' && (
                        <p className="text-xs text-gray-500 mt-1">
                          License: {user.licenseNumber} | {user.specialization}
                        </p>
                      )}
                      {user.role === 'pet_owner' && (
                        <p className="text-xs text-gray-500 mt-1">
                          {user.petCount} pets | {user.appointmentCount} appointments
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">


                    <Select
                      value={user.status}
                      onValueChange={(value: IUser['status']) => handleStatusChange(user.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-3 w-3" />
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <div className="flex items-center gap-2">
                            <UserX className="h-3 w-3" />
                            Inactive
                          </div>
                        </SelectItem>
                        <SelectItem value="suspended">
                          <div className="flex items-center gap-2">
                            <UserX className="h-3 w-3" />
                            Suspended
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers?.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No users found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}