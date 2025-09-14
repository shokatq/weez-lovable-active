import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { WorkspaceService } from '../services/workspaceService';

export function useWorkspaceInitialization() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [initializationError, setInitializationError] = useState<string | null>(null);
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        const initializeWorkspaceData = async () => {
            if (!isAuthenticated || !user) {
                console.log('User not authenticated, skipping workspace initialization');
                return;
            }

            try {
                console.log('🚀 Initializing workspace data for user:', user.id);
                setIsInitialized(false);
                setInitializationError(null);

                // Pre-load workspace data to ensure member counts are available
                await WorkspaceService.getWorkspaces();
                
                console.log('✅ Workspace data initialized successfully');
                setIsInitialized(true);
            } catch (error) {
                console.error('❌ Failed to initialize workspace data:', error);
                setInitializationError(error instanceof Error ? error.message : 'Failed to initialize workspace data');
                setIsInitialized(true); // Set to true even on error to prevent infinite loading
            }
        };

        initializeWorkspaceData();
    }, [isAuthenticated, user]);

    return {
        isInitialized,
        initializationError,
        isAuthenticated
    };
}
