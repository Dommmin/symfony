import type { Issue, PaginatedResponse } from '@/types';
import { issuesApi } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export const useIssues = () => {
    return useQuery<PaginatedResponse<Issue>>({
        queryKey: ['issues'],
        queryFn: () => issuesApi.getIssues(),
    });
}; 