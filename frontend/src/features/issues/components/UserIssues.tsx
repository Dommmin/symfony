import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIssues } from '@/features/issues/hooks/useIssues';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Issue } from '@/types';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'new':
            return 'bg-blue-500';
        case 'in_progress':
            return 'bg-yellow-500';
        case 'done':
            return 'bg-green-500';
        default:
            return 'bg-gray-500';
    }
};

export const UserIssues = () => {
    const { data: issues = [], isLoading } = useIssues();
    const user = useAuthStore((state) => state.user);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const userIssues = (issues as Issue[])?.filter((issue: Issue) => issue.user.id === user?.id) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Moje zgłoszenia</h1>
                <Link to="/issues/new">
                    <Button>Nowe zgłoszenie</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista zgłoszeń</CardTitle>
                </CardHeader>
                <CardContent>
                    {userIssues.length === 0 ? (
                        <p className="text-muted-foreground">Nie masz jeszcze żadnych zgłoszeń.</p>
                    ) : (
                        <div className="space-y-4">
                            {userIssues.map((issue: Issue) => (
                                <div key={issue.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium">{issue.title}</h3>
                                            <Badge className={getStatusColor(issue.status)}>
                                                {issue.status === 'new' && 'Nowe'}
                                                {issue.status === 'in_progress' && 'W trakcie'}
                                                {issue.status === 'done' && 'Zakończone'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>Utworzono: {new Date(issue.createdAt).toLocaleDateString()}</span>
                                            {issue.technician && (
                                                <span>• Technik: {issue.technician.firstName} {issue.technician.lastName}</span>
                                            )}
                                        </div>
                                    </div>
                                    <Link to={`/issues/${issue.id}`}>
                                        <Button variant="outline" size="sm">
                                            Szczegóły
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}; 
