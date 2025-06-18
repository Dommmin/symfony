import { CreateIssueForm } from '@/features/admin/components/CreateIssueForm';

export default function NewIssuePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Nowe zgłoszenie</h1>
                <p className="text-muted-foreground mt-2">Utwórz nowe zgłoszenie w systemie</p>
            </div>
            <CreateIssueForm />
        </div>
    );
} 