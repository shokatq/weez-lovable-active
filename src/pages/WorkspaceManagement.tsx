import React from 'react';
import { WorkspaceManagement } from '../components/workspace/WorkspaceManagement';
import { WorkspaceProvider } from '../hooks/useWorkspace';

export default function WorkspaceManagementPage() {
    return (
        <WorkspaceProvider>
            <WorkspaceManagement />
        </WorkspaceProvider>
    );
}
