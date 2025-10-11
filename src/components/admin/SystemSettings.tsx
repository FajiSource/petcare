import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Database, Download, Save, Eye, EyeOff } from 'lucide-react';
import { useUpdateUser } from '../../lib/react-query/QueriesAndMutations';
import apiService from '../../services/api/apiService';

export function SystemSettings() {
  const { user, login } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const { mutateAsync: updateUserMutation, isPending: isUpdatingUser } = useUpdateUser();
  const [error, setError] = useState<string | null>(null);

  const handleSaveUser = async () => {
    if (!user) return;
    setError(null);

    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    try {
      const resp = await updateUserMutation({ userID: user.id, name, email, password: password || '' });
      if (resp && resp.success && resp.user) {
        login(resp.user);
        setUnsavedChanges(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(resp?.message || 'Failed to update user');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred while updating user');
    }
  };

  const handleCreateBackup = async () => {
  try {
    setError(null);

    const response = await apiService.get('/admin/backup', {
      responseType: 'blob', // Important for file download
    });

    const blob = new Blob([response.data], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);

    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'backup_' + new Date().toISOString() + '.json';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match && match[1]) {
        fileName = match[1];
      }
    }

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadUrl);

    setLastBackup(new Date().toLocaleString());
  } catch (err: any) {
    console.error(err);
    setError(err?.message || 'Failed to create backup');
  }
};


  React.useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Only essential settings: edit user account and backup database</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersPlaceholder />
            Edit User Account
          </CardTitle>
          <CardDescription>Update your account name and email</CardDescription>
        </CardHeader>
        <CardContent>
          {!user ? (
            <p className="text-sm text-gray-600">No user is currently logged in.</p>
          ) : (
            <div className="space-y-4 max-w-md">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => { setName(e.target.value); setUnsavedChanges(true); }} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={email} onChange={(e) => { setEmail(e.target.value); setUnsavedChanges(true); }} />
              </div>
              <div>
                <Label>Password</Label>
                <div className="flex items-center">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setUnsavedChanges(true); }}
                  />
                  <Button variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Leave blank to keep current password</p>
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setUnsavedChanges(true); }}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button onClick={handleSaveUser} disabled={!unsavedChanges || isUpdatingUser}>
                  <Save className="w-4 h-4 mr-2" />
                  {isUpdatingUser ? 'Saving...' : 'Save Account'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Backup Database
          </CardTitle>
          <CardDescription>Create a backup of system data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Last Backup: {lastBackup ?? 'No backups created yet'}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCreateBackup}>
                <Download className="w-4 h-4 mr-2" />
                Create Backup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UsersPlaceholder() {
  return (
    <div className="w-5 h-5 bg-gray-200 rounded-full" aria-hidden />
  );
}