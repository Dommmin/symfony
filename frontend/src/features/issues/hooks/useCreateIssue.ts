import { useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesApi } from '@/services/api';
import type { CreateIssueDto } from '@/types';

export const useCreateIssue = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateIssueDto) => issuesApi.createIssue(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues'] });
        },
    });
}; 