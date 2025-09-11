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
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const createWorkspaceSchema = z.object({
    name: z.string().min(1, 'Workspace name is required').max(100, 'Workspace name must be less than 100 characters'),
});

type CreateWorkspaceForm = z.infer<typeof createWorkspaceSchema>;

interface CreateWorkspaceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateWorkspaceForm) => Promise<void>;
}

export function CreateWorkspaceDialog({ open, onOpenChange, onSubmit }: CreateWorkspaceDialogProps) {
    const form = useForm<CreateWorkspaceForm>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: '',
        },
    });

    const handleSubmit = async (data: CreateWorkspaceForm) => {
        try {
            await onSubmit(data);
            form.reset();
        } catch (error) {
            // Error handling is done in the parent component
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Workspace</DialogTitle>
                    <DialogDescription>
                        Create a new workspace to collaborate with your team members.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Workspace Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter workspace name"
                                            {...field}
                                        />
                                    </FormControl>
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
                                Create Workspace
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
