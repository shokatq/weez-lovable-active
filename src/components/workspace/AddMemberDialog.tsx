import React, { useState, useEffect } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Loader2, Search, User } from 'lucide-react';
import { useUserSearch } from '../../hooks/useWorkspace';
import { WORKSPACE_ROLES } from '../../types/workspace';

const addMemberSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    role: z.enum(['admin', 'team_lead', 'viewer'], {
        required_error: 'Please select a role',
    }),
});

type AddMemberForm = z.infer<typeof addMemberSchema>;

interface AddMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: AddMemberForm) => Promise<void>;
}

export function AddMemberDialog({ open, onOpenChange, onSubmit }: AddMemberDialogProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { users, loading: searchLoading, searchUsers } = useUserSearch();
    const [selectedUser, setSelectedUser] = useState<{ id: string; email: string; first_name: string | null; last_name: string | null } | null>(null);

    const form = useForm<AddMemberForm>({
        resolver: zodResolver(addMemberSchema),
        defaultValues: {
            email: '',
            role: 'viewer',
        },
    });

    // Search users when query changes with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim() && !selectedUser) {
                console.log('🔍 Searching for users with query:', searchQuery);
                searchUsers(searchQuery);
            }
        }, 200); // Reduced debounce for faster search

        return () => clearTimeout(timeoutId);
    }, [searchQuery, searchUsers, selectedUser]);

    const handleUserSelect = (user: { id: string; email: string; first_name: string | null; last_name: string | null }) => {
        setSelectedUser(user);
        form.setValue('email', user.email);
        setSearchQuery(user.email);
        // Clear search results after selection
        setTimeout(() => {
            setSearchQuery(user.email);
        }, 100);
    };

    const handleSubmit = async (data: AddMemberForm) => {
        try {
            // For mock users, we need to handle the submission differently
            if (selectedUser) {
                // Create a mock submission that includes the user ID
                const mockData = {
                    ...data,
                    userId: selectedUser.id
                };
                await onSubmit(mockData);
            } else {
                await onSubmit(data);
            }
            form.reset();
            setSelectedUser(null);
            setSearchQuery('');
        } catch (error) {
            // Error handling is done in the parent component
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
            setSelectedUser(null);
            setSearchQuery('');
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                    <DialogDescription>
                        Add a new member to your workspace by searching for their email address.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search by email address"
                                                className="pl-10"
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    field.onChange(e.target.value);
                                                    setSelectedUser(null);
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />

                                    {/* User search results */}
                                    {searchQuery && !selectedUser && (
                                        <div className="border rounded-md max-h-64 overflow-y-auto">
                                            {searchLoading ? (
                                                <div className="p-3 text-center text-sm text-muted-foreground">
                                                    <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                                                    Searching users...
                                                </div>
                                            ) : users.length > 0 ? (
                                                <div className="p-1">
                                                    <div className="text-xs text-muted-foreground px-2 py-1 border-b">
                                                        Found {users.length} users
                                                    </div>
                                                    {users.map((user) => (
                                                        <button
                                                            key={user.id}
                                                            type="button"
                                                            className="w-full p-2 text-left hover:bg-muted rounded-sm flex items-center gap-3"
                                                            onClick={() => handleUserSelect(user)}
                                                        >
                                                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                                                <User className="h-4 w-4" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium">
                                                                    {user.first_name} {user.last_name}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-3 text-center text-sm text-muted-foreground">
                                                    No users found with that email address
                                                    <br />
                                                    <span className="text-xs">Try searching with a different email or name</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Selected user display */}
                                    {selectedUser && (
                                        <div className="p-3 border rounded-md bg-muted/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <User className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {selectedUser.first_name} {selectedUser.last_name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                onClick={() => handleOpenChange(false)}
                                disabled={form.formState.isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting || !selectedUser}
                            >
                                {form.formState.isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Add Member
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
