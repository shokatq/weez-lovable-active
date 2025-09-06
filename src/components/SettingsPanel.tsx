import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { User, Bell, Shield, Moon, Sun, Globe } from "lucide-react";

const SettingsPanel = () => {
  const { signOut, user } = useAuth();
  const [appLanguage, setAppLanguage] = useState(() => 
    localStorage.getItem('weez-app-language') || 'english'
  );
  const [notifications, setNotifications] = useState(() => 
    localStorage.getItem('weez-notifications') !== 'false'
  );
  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem('weez-theme') === 'dark'
  );

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleLanguageChange = (value: string) => {
    setAppLanguage(value);
    localStorage.setItem('weez-app-language', value);
    toast.success(`Language changed to ${value.charAt(0).toUpperCase() + value.slice(1)}`);
  };

  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem('weez-notifications', String(checked));
    toast.success(`Notifications ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleThemeChange = (checked: boolean) => {
    setDarkMode(checked);
    localStorage.setItem('weez-theme', checked ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', checked);
    toast.success(`${checked ? 'Dark' : 'Light'} mode enabled`);
  };

  return (
    <div className="w-80 p-6 space-y-6">
      <div className="space-y-6">
        {/* Account Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <h3 className="text-sm font-medium">Account</h3>
          </div>
          
          <div className="space-y-3 pl-6">
            <div className="text-sm">
              <p className="font-medium">{user?.email || 'User'}</p>
              <p className="text-muted-foreground text-xs">Premium Plan</p>
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              Manage Account
            </Button>
          </div>
        </div>

        <Separator />

        {/* Preferences Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <h3 className="text-sm font-medium">Preferences</h3>
          </div>
          
          <div className="space-y-3 pl-6">
            <div className="space-y-2">
              <Label className="text-xs">Language</Label>
              <Select value={appLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-xs">
                Notifications
              </Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={handleNotificationsChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="theme" className="text-xs">
                Dark Mode
              </Label>
              <Switch
                id="theme"
                checked={darkMode}
                onCheckedChange={handleThemeChange}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Security Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <h3 className="text-sm font-medium">Security</h3>
          </div>
          
          <div className="space-y-2 pl-6">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Privacy Settings
            </Button>
          </div>
        </div>

        <Separator />
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;