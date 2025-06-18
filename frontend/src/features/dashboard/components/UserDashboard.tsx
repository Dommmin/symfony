import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIssues } from '@/features/issues/hooks/useIssues';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const UserDashboard = () => {
    const { data: issues, isLoading } = useIssues();
    const user = useAuthStore((state) => state.user);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const userIssues = issues?.filter((issue) => issue.user.id === user?.id) || [];
    const newIssues = userIssues.filter((issue) => issue.status === 'new').length;
    const inProgressIssues = userIssues.filter((issue) => issue.status === 'in_progress').length;
    const doneIssues = userIssues.filter((issue) => issue.status === 'done').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Panel użytkownika</h1>
                <Link to="/issues/new">
                    <Button>Nowe zgłoszenie</Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nowe zgłoszenia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{newIssues}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">W trakcie</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgressIssues}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Zakończone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{doneIssues}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ostatnie zgłoszenia</CardTitle>
                </CardHeader>
                <CardContent>
                    {userIssues.length === 0 ? (
                        <p className="text-muted-foreground">Nie masz jeszcze żadnych zgłoszeń.</p>
                    ) : (
                        <div className="space-y-4">
                            {userIssues.slice(0, 5).map((issue) => (
                                <div key={issue.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                    <div>
                                        <h3 className="font-medium">{issue.title}</h3>
                                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(issue.createdAt).toLocaleDateString()}
                                        </span>
                                        <Link to={`/issues/${issue.id}`}>
                                            <Button variant="outline" size="sm">
                                                Szczegóły
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}; 