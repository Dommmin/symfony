import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { techniciansApi } from '@/services/api';
import type { CreateTechnicianDto, Technician, UpdateTechnicianDto } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

type TechnicianFormData = {
    firstName: string;
    lastName: string;
    email: string;
    specialization: string;
};

const defaultFormData: TechnicianFormData = {
    firstName: '',
    lastName: '',
    email: '',
    specialization: '',
};

export const TechniciansList = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);
    const [formData, setFormData] = useState<TechnicianFormData>(defaultFormData);

    const queryClient = useQueryClient();

    const { data: technicians, isLoading } = useQuery({
        queryKey: ['technicians'],
        queryFn: techniciansApi.getTechnicians,
    });

    const createTechnicianMutation = useMutation({
        mutationFn: techniciansApi.createTechnician,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['technicians'] });
            toast.success('Technik został dodany');
            handleCloseDialog();
        },
        onError: () => {
            toast.error('Wystąpił błąd podczas dodawania technika');
        },
    });

    const updateTechnicianMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateTechnicianDto }) =>
            techniciansApi.updateTechnician(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['technicians'] });
            toast.success('Technik został zaktualizowany');
            handleCloseDialog();
        },
        onError: () => {
            toast.error('Wystąpił błąd podczas aktualizacji technika');
        },
    });

    const deleteTechnicianMutation = useMutation({
        mutationFn: techniciansApi.deleteTechnician,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['technicians'] });
            toast.success('Technik został usunięty');
        },
        onError: () => {
            toast.error('Wystąpił błąd podczas usuwania technika');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTechnician) {
            updateTechnicianMutation.mutate({
                id: editingTechnician.id,
                data: formData,
            });
        } else {
            createTechnicianMutation.mutate(formData as CreateTechnicianDto);
        }
    };

    const handleEdit = (technician: Technician) => {
        setEditingTechnician(technician);
        setFormData({
            firstName: technician.firstName,
            lastName: technician.lastName,
            email: technician.email,
            specialization: technician.specialization,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Czy na pewno chcesz usunąć tego technika?')) {
            deleteTechnicianMutation.mutate(id);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingTechnician(null);
        setFormData(defaultFormData);
    };

    if (isLoading) {
        return <div>Ładowanie...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Technicy</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Dodaj technika
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingTechnician ? 'Edytuj technika' : 'Dodaj technika'}</DialogTitle>
                            <DialogDescription>
                                {editingTechnician
                                    ? 'Zaktualizuj dane technika poniżej.'
                                    : 'Wypełnij formularz, aby dodać nowego technika.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Imię</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nazwisko</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="specialization">Specjalizacja</Label>
                                <Input
                                    id="specialization"
                                    value={formData.specialization}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, specialization: e.target.value }))
                                    }
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                    Anuluj
                                </Button>
                                <Button type="submit">
                                    {editingTechnician ? 'Zaktualizuj' : 'Dodaj'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Imię i nazwisko</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Specjalizacja</TableHead>
                            <TableHead className="w-[100px]">Akcje</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {technicians?.map((technician) => (
                            <TableRow key={technician.id}>
                                <TableCell>
                                    {technician.firstName} {technician.lastName}
                                </TableCell>
                                <TableCell>{technician.email}</TableCell>
                                <TableCell>{technician.specialization}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(technician)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(technician.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}; 