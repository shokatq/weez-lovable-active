import { User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const UserProfile = () => {
  const { user: authUser } = useAuth();
  
  // Use real user data from authentication
  const user = {
    name: authUser?.user_metadata?.first_name && authUser?.user_metadata?.last_name 
      ? `${authUser.user_metadata.first_name} ${authUser.user_metadata.last_name}`.trim()
      : authUser?.email?.split('@')[0] || 'User',
    email: authUser?.email || '',
    avatar: authUser?.user_metadata?.avatar_url || null
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
    </div>
  );
};

export default UserProfile;