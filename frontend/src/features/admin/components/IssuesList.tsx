import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { issuesApi, techniciansApi } from '@/services/api';
import type { Issue, Technician, UpdateIssueDto } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Filter, MoreHorizontal, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UNASSIGNED_VALUE = "unassigned";

const statusColors = {
    new: 'bg-blue-500',
    in_progress: 'bg-yellow-500',
    done: 'bg-green-500',
    closed: 'bg-gray-500',
};

const priorityColors = {
    low: 'bg-gray-500',
    medium: 'bg-blue-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
};

const statusLabels = {
    new: 'Nowe',
    in_progress: 'W trakcie',
    done: 'Rozwiązane',
    closed: 'Zamknięte',
};

const priorityLabels = {
    low: 'Niski',
    medium: 'Średni',
    high: 'Wysoki',
    critical: 'Krytyczny',
};

export const IssuesList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<Issue['status'] | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<Issue['priority'] | 'all'>('all');
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: issues, isLoading } = useQuery({
        queryKey: ['issues'],
        queryFn: issuesApi.getIssues,
    });

    const { data: technicians } = useQuery({
        queryKey: ['technicians'],
        queryFn: techniciansApi.getTechnicians,
    });

    const updateIssueMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateIssueDto }) => issuesApi.updateIssue(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues'] });
            toast.success('Zgłoszenie zaktualizowane');
        },
        onError: () => {
            toast.error('Wystąpił błąd podczas aktualizacji zgłoszenia');
        },
    });

    const filteredIssues = (issues || []).filter((issue) => {
        const matchesSearch =
            issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || issue.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const handleStatusChange = (issueId: number, newStatus: Issue['status']) => {
        updateIssueMutation.mutate({ id: issueId, data: { status: newStatus } });
    };

    const handlePriorityChange = (issueId: number, newPriority: Issue['priority']) => {
        updateIssueMutation.mutate({ id: issueId, data: { priority: newPriority } });
    };

    const handleTechnicianAssign = (issueId: number, value: string) => {
        updateIssueMutation.mutate({
            id: issueId,
            data: {
                technicianId: value === UNASSIGNED_VALUE ? null : parseInt(value)
            }
        });
    };

    if (isLoading) {
        return <div>Ładowanie...</div>;
    }

    if (!issues) {
        return <div>Brak zgłoszeń</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Zgłoszenia</h2>
                <Button onClick={() => navigate('/admin/issues/new')}>Nowe zgłoszenie</Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                    <Input placeholder="Szukaj zgłoszeń..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8" />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Status
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setStatusFilter('all')}>Wszystkie</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setStatusFilter('new')}>Nowe</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('in_progress')}>W trakcie</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('done')}>Rozwiązane</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter('closed')}>Zamknięte</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Priorytet
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setPriorityFilter('all')}>Wszystkie</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setPriorityFilter('low')}>Niski</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPriorityFilter('medium')}>Średni</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPriorityFilter('high')}>Wysoki</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPriorityFilter('critical')}>Krytyczny</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Tytuł</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priorytet</TableHead>
                            <TableHead>Data utworzenia</TableHead>
                            <TableHead className="min-w-[200px]">Przypisany do</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredIssues.map((issue) => (
                            <TableRow key={issue.id}>
                                <TableCell className="font-medium">#{issue.id}</TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">{issue.title}</div>
                                        <div className="text-muted-foreground text-sm">{issue.description}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${statusColors[issue.status]} text-white`}>
                                        {statusLabels[issue.status]}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${priorityColors[issue.priority]} text-white`}>
                                        {priorityLabels[issue.priority]}
                                    </Badge>
                                </TableCell>
                                <TableCell>{new Date(issue.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Select
                                        value={issue.technician?.id?.toString() || UNASSIGNED_VALUE}
                                        onValueChange={(value) => handleTechnicianAssign(issue.id, value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Wybierz technika" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={UNASSIGNED_VALUE}>Brak przypisania</SelectItem>
                                            {technicians?.map((technician: Technician) => (
                                                <SelectItem key={technician.id} value={technician.id.toString()}>
                                                    {technician.firstName} {technician.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                                            <DropdownMenuItem>Zobacz szczegóły</DropdownMenuItem>
                                            <DropdownMenuItem>Edytuj</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                                            {Object.entries(statusLabels).map(([value, label]) => (
                                                <DropdownMenuItem
                                                    key={value}
                                                    onClick={() => handleStatusChange(issue.id, value as Issue['status'])}
                                                    disabled={issue.status === value}
                                                >
                                                    Oznacz jako {label.toLowerCase()}
                                                </DropdownMenuItem>
                                            ))}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>Priorytet</DropdownMenuLabel>
                                            {Object.entries(priorityLabels).map(([value, label]) => (
                                                <DropdownMenuItem
                                                    key={value}
                                                    onClick={() => handlePriorityChange(issue.id, value as Issue['priority'])}
                                                    disabled={issue.priority === value}
                                                >
                                                    Ustaw priorytet: {label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
