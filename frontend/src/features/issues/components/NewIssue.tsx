import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateIssue } from '@/features/issues/hooks/useCreateIssue';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const newIssueSchema = z.object({
    title: z.string().min(3, 'Tytuł musi mieć minimum 3 znaki').max(255, 'Tytuł może mieć maksymalnie 255 znaków'),
    description: z.string().min(10, 'Opis musi mieć minimum 10 znaków'),
});

type NewIssueFormData = z.infer<typeof newIssueSchema>;

export const NewIssue = () => {
    const navigate = useNavigate();
    const createIssue = useCreateIssue();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<NewIssueFormData>({
        resolver: zodResolver(newIssueSchema),
    });

    const onSubmit = async (data: NewIssueFormData) => {
        try {
            await createIssue.mutateAsync({
                ...data,
                priority: 'low'
            });
            toast.success('Zgłoszenie zostało utworzone');
            navigate('/issues');
        } catch (error) {
            toast.error('Wystąpił błąd podczas tworzenia zgłoszenia');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Nowe zgłoszenie</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Formularz zgłoszenia</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Tytuł</Label>
                            <Input
                                id="title"
                                placeholder="Krótki opis problemu"
                                {...register('title')}
                                className={errors.title ? 'border-red-500' : ''}
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Opis</Label>
                            <Textarea
                                id="description"
                                placeholder="Szczegółowy opis problemu..."
                                {...register('description')}
                                className={errors.description ? 'border-red-500' : ''}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => navigate('/issues')}>
                                Anuluj
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Tworzenie...
                                    </>
                                ) : (
                                    'Utwórz zgłoszenie'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}; 