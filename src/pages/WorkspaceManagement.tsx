import React from 'react';
import { WorkspaceManagement } from '../components/workspace/WorkspaceManagement';
import { WorkspaceProvider } from '../hooks/useWorkspace';
import { MemberProvider } from '../contexts/MemberContext';

export default function WorkspaceManagementPage() {
    return (
        <WorkspaceProvider>
            <MemberProvider>
                <WorkspaceManagement />
            </MemberProvider>
        </WorkspaceProvider>
    );
}
