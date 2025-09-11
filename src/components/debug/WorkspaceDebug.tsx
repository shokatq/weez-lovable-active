import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { WorkspaceService } from '../../services/workspaceService';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../integrations/supabase/client';

export function WorkspaceDebug() {
    const { user } = useAuth();
    const [debugInfo, setDebugInfo] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const runDebugTests = async () => {
        setLoading(true);
        const info: any = {};

        try {
            // Test 1: Check authentication
            info.auth = {
                user: user ? {
                    id: user.id,
                    email: user.email
                } : null
            };

            // Test 2: Check workspaces table
            const { data: workspaces, error: workspacesError } = await supabase
                .from('workspaces')
                .select('*');

            info.workspaces = {
                data: workspaces,
                error: workspacesError?.message,
                count: workspaces?.length || 0
            };

            // Test 3: Check workspace_members table
            const { data: members, error: membersError } = await supabase
                .from('workspace_members')
                .select(`
                    *,
                    user:profiles(
                        id,
                        email,
                        first_name,
                        last_name
                    )
                `);

            info.workspace_members = {
                data: members,
                error: membersError?.message,
                count: members?.length || 0
            };

            // Test 4: Check profiles table
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*');

            info.profiles = {
                data: profiles,
                error: profilesError?.message,
                count: profiles?.length || 0
            };

            // Test 5: Check if user has workspaces
            if (user) {
                const { data: userWorkspaces, error: userWorkspacesError } = await supabase
                    .from('workspaces')
                    .select('*')
                    .eq('owner_id', user.id);

                info.user_workspaces = {
                    data: userWorkspaces,
                    error: userWorkspacesError?.message,
                    count: userWorkspaces?.length || 0
                };

                // Test 6: Check if user is a member of any workspaces
                const { data: userMemberships, error: userMembershipsError } = await supabase
                    .from('workspace_members')
                    .select(`
                        *,
                        workspace:workspaces(*)
                    `)
                    .eq('user_id', user.id);

                info.user_memberships = {
                    data: userMemberships,
                    error: userMembershipsError?.message,
                    count: userMemberships?.length || 0
                };
            }

            // Test 7: Try the WorkspaceService.getWorkspaces method
            try {
                const workspacesResponse = await WorkspaceService.getWorkspaces();
                info.workspace_service = {
                    data: workspacesResponse,
                    error: null
                };
            } catch (serviceError) {
                info.workspace_service = {
                    data: null,
                    error: serviceError instanceof Error ? serviceError.message : 'Unknown error'
                };
            }

        } catch (error) {
            info.general_error = error instanceof Error ? error.message : 'Unknown error';
        }

        setDebugInfo(info);
        setLoading(false);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Workspace Debug Information</CardTitle>
                <Button onClick={runDebugTests} disabled={loading}>
                    {loading ? 'Running Tests...' : 'Run Debug Tests'}
                </Button>
            </CardHeader>
            <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                    {JSON.stringify(debugInfo, null, 2)}
                </pre>
            </CardContent>
        </Card>
    );
}