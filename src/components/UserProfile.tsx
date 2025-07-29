import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, MoreHorizontal } from 'lucide-react';

const UserProfile = () => {
  // Simple demo user data - replace with your auth system
  const user = {
    name: "Demo User",
    email: "demo@example.com",
    avatar: null
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors duration-200">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-sm font-bold text-primary-foreground shadow-md">
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <User className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {user.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">Premium Plan</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg flex-shrink-0 transition-colors duration-200"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => console.log('Sign out clicked')}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfile;