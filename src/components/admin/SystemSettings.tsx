import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  Mail, 
  Globe, 
  Lock, 
  Clock, 
  DollarSign,
  Building,
  Users,
  AlertCircle,
  CheckCircle,
  Save,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';

interface SystemSetting {
  id: string;
  category: string;
  name: string;
  value: string | boolean | number;
  type: 'text' | 'number' | 'boolean' | 'select' | 'password' | 'email' | 'url';
  description: string;
  options?: string[];
  required: boolean;
  lastModified: string;
  modifiedBy: string;
}

export function SystemSettings() {
  const { user } = useApp();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date().toISOString());

  // Mock system settings - in real app, this would come from API
  const [settings, setSettings] = useState<SystemSetting[]>([
    // General Settings
    {
      id: 'site_name',
      category: 'general',
      name: 'Site Name',
      value: 'PetCare Connect',
      type: 'text',
      description: 'The name of your veterinary management system',
      required: true,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },
    {
      id: 'site_description',
      category: 'general',
      name: 'Site Description',
      value: 'Comprehensive pet care management platform',
      type: 'text',
      description: 'Brief description of your service',
      required: false,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },
    {
      id: 'timezone',
      category: 'general',
      name: 'Default Timezone',
      value: 'America/New_York',
      type: 'select',
      description: 'Default timezone for appointments and records',
      options: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London'],
      required: true,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },
    {
      id: 'language',
      category: 'general',
      name: 'Default Language',
      value: 'English',
      type: 'select',
      description: 'Default language for the system',
      options: ['English', 'Spanish', 'French', 'German'],
      required: true,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },

    // Security Settings
    {
      id: 'session_timeout',
      category: 'security',
      name: 'Session Timeout (minutes)',
      value: 60,
      type: 'number',
      description: 'Automatic logout after inactivity',
      required: true,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },
    {
      id: 'password_min_length',
      category: 'security',
      name: 'Minimum Password Length',
      value: 8,
      type: 'number',
      description: 'Minimum number of characters for passwords',
      required: true,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },
    {
      id: 'require_2fa',
      category: 'security',
      name: 'Require Two-Factor Authentication',
      value: false,
      type: 'boolean',
      description: 'Require 2FA for all users',
      required: false,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },
    {
      id: 'api_key',
      category: 'security',
      name: 'API Key',
      value: 'sk-1234567890abcdef',
      type: 'password',
      description: 'System API key for integrations',
      required: false,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },

    // Email Settings
    {
      id: 'smtp_host',
      category: 'email',
      name: 'SMTP Host',
      value: 'smtp.gmail.com',
      type: 'text',
      description: 'SMTP server hostname',
      required: false,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },
    {
      id: 'smtp_port',
      category: 'email',
      name: 'SMTP Port',
      value: 587,
      type: 'number',
      description: 'SMTP server port',
      required: false,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },
    {
      id: 'smtp_username',
      category: 'email',
      name: 'SMTP Username',
      value: 'noreply@petcareconnect.com',
      type: 'email',
      description: 'SMTP authentication username',
      required: false,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },
    {
      id: 'smtp_password',
      category: 'email',
      name: 'SMTP Password',
      value: '••••••••••••',
      type: 'password',
      description: 'SMTP authentication password',
      required: false,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },

    // Notification Settings
    {
      id: 'appointment_reminders',
      category: 'notifications',
      name: 'Appointment Reminders',
      value: true,
      type: 'boolean',
      description: 'Send automatic appointment reminders',
      required: false,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },
    {
      id: 'reminder_hours',
      category: 'notifications',
      name: 'Reminder Hours Before',
      value: 24,
      type: 'number',
      description: 'Hours before appointment to send reminder',
      required: false,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },
    {
      id: 'vaccination_alerts',
      category: 'notifications',
      name: 'Vaccination Alerts',
      value: true,
      type: 'boolean',
      description: 'Send alerts for overdue vaccinations',
      required: false,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },

    // Business Settings
    {
      id: 'business_hours_start',
      category: 'business',
      name: 'Business Hours Start',
      value: '08:00',
      type: 'text',
      description: 'Daily opening time',
      required: true,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },
    {
      id: 'business_hours_end',
      category: 'business',
      name: 'Business Hours End',
      value: '18:00',
      type: 'text',
      description: 'Daily closing time',
      required: true,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },
    {
      id: 'appointment_duration',
      category: 'business',
      name: 'Default Appointment Duration (minutes)',
      value: 30,
      type: 'number',
      description: 'Default length for new appointments',
      required: true,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    },
    {
      id: 'currency',
      category: 'business',
      name: 'Currency',
      value: 'USD',
      type: 'select',
      description: 'Default currency for pricing',
      options: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
      required: true,
      lastModified: '2024-11-01',
      modifiedBy: 'Admin'
    }
  ]);

  const handleSettingChange = (settingId: string, newValue: string | boolean | number) => {
    setSettings(prev => prev.map(setting => 
      setting.id === settingId 
        ? { ...setting, value: newValue, lastModified: new Date().toISOString().split('T')[0], modifiedBy: user?.name || 'Admin' }
        : setting
    ));
    setUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    // In real app, this would make an API call to save settings
    console.log('Saving settings:', settings);
    setUnsavedChanges(false);
    setLastSaved(new Date().toISOString());
  };

  const handleResetSettings = () => {
    // Reset to default values
    console.log('Resetting settings to defaults');
    setUnsavedChanges(false);
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'system-settings.json';
    link.click();
  };

  const renderSettingField = (setting: SystemSetting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={setting.value as boolean}
              onCheckedChange={(checked) => handleSettingChange(setting.id, checked)}
            />
            <Label htmlFor={setting.id}>{setting.value ? 'Enabled' : 'Disabled'}</Label>
          </div>
        );
      
      case 'select':
        return (
          <Select 
            value={setting.value as string} 
            onValueChange={(value) => handleSettingChange(setting.id, value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {setting.options?.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={setting.value as number}
            onChange={(e) => handleSettingChange(setting.id, parseInt(e.target.value) || 0)}
            min="0"
          />
        );
      
      case 'password':
        return (
          <div className="flex items-center space-x-2">
            <Input
              type={showPasswords ? 'text' : 'password'}
              value={setting.value as string}
              onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPasswords(!showPasswords)}
            >
              {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        );
      
      default:
        return (
          <Input
            type={setting.type}
            value={setting.value as string}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
          />
        );
    }
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(setting => setting.category === category);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return <Globe className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'notifications': return <Bell className="w-4 h-4" />;
      case 'business': return <Building className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const categories = [
    { id: 'general', name: 'General Settings' },
    { id: 'security', name: 'Security & Privacy' },
    { id: 'email', name: 'Email Configuration' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'business', name: 'Business Settings' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure system-wide preferences and options</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Export Settings
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Settings
          </Button>
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSaveSettings} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!unsavedChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {unsavedChanges && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            You have unsaved changes. Click "Save Changes" to apply your modifications.
          </AlertDescription>
        </Alert>
      )}

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-gray-600">Connected</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Email Service</p>
                <p className="text-xs text-gray-600">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">API</p>
                <p className="text-xs text-gray-600">Healthy</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium">Last Saved</p>
                <p className="text-xs text-gray-600">
                  {new Date(lastSaved).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
              {getCategoryIcon(category.id)}
              <span className="hidden sm:inline">{category.name.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getCategoryIcon(category.id)}
                  {category.name}
                </CardTitle>
                <CardDescription>
                  Configure {category.name.toLowerCase()} for your system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {getSettingsByCategory(category.id).map((setting, index) => (
                    <div key={setting.id}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={setting.id} className="font-medium">
                            {setting.name}
                            {setting.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          <Badge variant="outline" className="text-xs">
                            Modified: {setting.lastModified}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                        {renderSettingField(setting)}
                        <p className="text-xs text-gray-500">
                          Last modified by: {setting.modifiedBy}
                        </p>
                      </div>
                      {index < getSettingsByCategory(category.id).length - 1 && (
                        <Separator className="mt-6" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Additional System Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              System Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users:</span>
                <span className="font-medium">127</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Sessions:</span>
                <span className="font-medium">43</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Pets:</span>
                <span className="font-medium">892</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Appointments:</span>
                <span className="font-medium">234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Storage Used:</span>
                <span className="font-medium">15.2 GB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Password Policy:</span>
                <span className="font-medium">Strong</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SSL Certificate:</span>
                <span className="font-medium text-green-600">Valid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">2FA Enabled Users:</span>
                <span className="font-medium">23%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Security Scan:</span>
                <span className="font-medium">2 days ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Failed Logins (24h):</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup & Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Backup & Maintenance
          </CardTitle>
          <CardDescription>
            System backup and maintenance operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Last Backup</Label>
              <p className="text-sm text-gray-600">November 13, 2024 at 2:00 AM</p>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Create Backup
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-gray-600">System is currently operational</p>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                Enable Maintenance
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Database Optimization</Label>
              <p className="text-sm text-gray-600">Last optimized 3 days ago</p>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                Optimize Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}