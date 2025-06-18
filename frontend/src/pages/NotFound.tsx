import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2 text-center">
                <FileQuestion className="text-muted-foreground h-16 w-16" />
                <h1 className="text-4xl font-bold tracking-tight">404</h1>
                <h2 className="text-2xl font-semibold tracking-tight">Strona nie została znaleziona</h2>
                <p className="text-muted-foreground">Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.</p>
            </div>
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Wróć do poprzedniej strony
                </Button>
                <Button onClick={() => navigate('/')}>Przejdź do strony głównej</Button>
            </div>
        </div>
    );
};
