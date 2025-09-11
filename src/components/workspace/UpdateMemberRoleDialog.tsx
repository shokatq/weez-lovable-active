import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { WORKSPACE_ROLES, WorkspaceRole } from '../../types/workspace';

const updateRoleSchema = z.object({
    role: z.enum(['admin', 'team_lead', 'viewer'], {
        required_error: 'Please select a role',
    }),
});

type UpdateMemberRoleForm = z.infer<typeof updateRoleSchema>;

interface UpdateMemberRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: { id: string; role: WorkspaceRole } | null;
    onSubmit: (data: UpdateMemberRoleForm) => Promise<void>;
}

export function UpdateMemberRoleDialog({
    open,
    onOpenChange,
    member,
    onSubmit
}: UpdateMemberRoleDialogProps) {
    const form = useForm<UpdateMemberRoleForm>({
        resolver: zodResolver(updateRoleSchema),
        defaultValues: {
            role: member?.role || 'viewer',
        },
    });

    // Update form when member changes
    React.useEffect(() => {
        if (member) {
            form.setValue('role', member.role);
        }
    }, [member, form]);

    const handleSubmit = async (data: UpdateMemberRoleForm) => {
        try {
            await onSubmit(data);
            onOpenChange(false);
        } catch (error) {
            // Error handling is done in the parent component
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Member Role</DialogTitle>
                    <DialogDescription>
                        Change the role of this team member in the workspace.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(WORKSPACE_ROLES).map(([role, config]) => (
                                                <SelectItem key={role} value={role}>
                                                    <div>
                                                        <div className="font-medium">{config.label}</div>
                                                        <div className="text-sm text-muted-foreground">{config.description}</div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={form.formState.isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Update Role
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
