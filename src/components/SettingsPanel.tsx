import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const SettingsPanel = () => {
  const { signOut } = useAuth();
  const [correctSpelling, setCorrectSpelling] = useState(() => 
    localStorage.getItem('weez-correct-spelling') === 'true'
  );
  const [appLanguage, setAppLanguage] = useState(() => 
    localStorage.getItem('weez-app-language') || 'english'
  );

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleCheckUpdates = () => {
    toast.info('No updates available. You are using the latest version.');
  };

  const handleLanguageChange = (value: string) => {
    setAppLanguage(value);
    localStorage.setItem('weez-app-language', value);
    toast.success(`Language changed to ${value.charAt(0).toUpperCase() + value.slice(1)}`);
  };

  const handleSpellingChange = (checked: boolean) => {
    setCorrectSpelling(checked);
    localStorage.setItem('weez-correct-spelling', String(checked));
    toast.success(`Spell check ${checked ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="w-80 p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <Label htmlFor="spelling" className="text-sm font-medium text-foreground">
            Correct Spelling Automatically
          </Label>
          <Switch
            id="spelling"
            checked={correctSpelling}
            onCheckedChange={handleSpellingChange}
          />
        </div>

        <Separator className="bg-border" />
        
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