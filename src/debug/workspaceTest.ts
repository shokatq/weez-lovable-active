// Debug script to test workspace creation
import { supabase } from '../integrations/supabase/client';

export async function testWorkspaceCreation() {
    try {
        console.log('Testing workspace creation...');

        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
            console.error('Auth error:', authError);
            return;
        }

        if (!user) {
            console.error('No user found');
            return;
        }

        console.log('User authenticated:', user.id);

        // Check if workspaces table exists and is accessible
        const { data: testData, error: testError } = await supabase
            .from('workspaces')
            .select('id')
            .limit(1);

        if (testError) {
            console.error('Table access error:', testError);
            return;
        }

        console.log('Table access successful');

        // Try to create a test workspace
        const { data: workspace, error: createError } = await supabase
            .from('workspaces')
            .insert({
                name: 'Test Workspace',
                owner_id: user.id
            })
            .select()
            .single();

        if (createError) {
            console.error('Create workspace error:', createError);
            return;
        }

        console.log('Workspace created successfully:', workspace);

        // Clean up - delete the test workspace
        await supabase
            .from('workspaces')
            .delete()
            .eq('id', workspace.id);

        console.log('Test workspace deleted');

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

// Call the test function
testWorkspaceCreation();
