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
  const [showInMenuBar, setShowInMenuBar] = useState(true);
  const [correctSpelling, setCorrectSpelling] = useState(false);
  const [openLinksInApp, setOpenLinksInApp] = useState(true);
  const [appLanguage, setAppLanguage] = useState("english");

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
    toast.success(`Language changed to ${value.charAt(0).toUpperCase() + value.slice(1)}`);
  };

  return (
    <div className="w-80 p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">App Language</Label>
          <Select value={appLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Español</SelectItem>
              <SelectItem value="french">Français</SelectItem>
              <SelectItem value="german">Deutsch</SelectItem>
              <SelectItem value="chinese">中文</SelectItem>
              <SelectItem value="japanese">日本語</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between py-2">
          <Label htmlFor="menu-bar" className="text-sm font-medium text-foreground">
            Show in Menu Bar
          </Label>
          <Switch
            id="menu-bar"
            checked={showInMenuBar}
            onCheckedChange={setShowInMenuBar}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <Label htmlFor="spelling" className="text-sm font-medium text-foreground">
            Correct Spelling Automatically
          </Label>
          <Switch
            id="spelling"
            checked={correctSpelling}
            onCheckedChange={setCorrectSpelling}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <Label htmlFor="links" className="text-sm font-medium text-foreground">
            Open Weez AI Links in Desktop App
          </Label>
          <Switch
            id="links"
            checked={openLinksInApp}
            onCheckedChange={setOpenLinksInApp}
          />
        </div>

        <Separator className="bg-border" />
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-foreground hover:bg-accent"
          onClick={handleCheckUpdates}
        >
          Check for Updates...
        </Button>
        
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