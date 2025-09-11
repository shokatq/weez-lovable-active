import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import {
    Settings,
    Users,
    FileText,
    Plus,
    Building2
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface WorkspaceNavigationProps {
    className?: string;
}

export function WorkspaceNavigation({ className }: WorkspaceNavigationProps) {
    const location = useLocation();

    const navItems = [
        {
            label: 'Workspace Management',
            href: '/workspace-management',
            icon: Building2,
            description: 'Manage workspaces and teams'
        },
        {
            label: 'Create Workspace',
            href: '/workspace',
            icon: Plus,
            description: 'Create a new workspace'
        }
    ];

    return (
        <div className={cn('space-y-2', className)}>
            <div className="px-3 py-2">
                <h2 className="mb-1 px-4 text-lg font-semibold tracking-tight">
                    Workspaces
                </h2>
                <p className="px-4 text-sm text-muted-foreground">
                    Manage your workspaces and collaborate with teams
                </p>
            </div>
            <div className="space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                        <Button
                            key={item.href}
                            variant={isActive ? 'secondary' : 'ghost'}
                            className={cn(
                                'w-full justify-start h-auto p-3',
                                isActive && 'bg-secondary'
                            )}
                            asChild
                        >
                            <Link to={item.href}>
                                <Icon className="mr-3 h-4 w-4" />
                                <div className="text-left">
                                    <div className="font-medium">{item.label}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {item.description}
                                    </div>
                                </div>
                            </Link>
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
