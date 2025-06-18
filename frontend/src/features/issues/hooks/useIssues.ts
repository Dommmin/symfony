import { useQuery } from '@tanstack/react-query';
import { issuesApi } from '@/services/api';

export const useIssues = () => {
    return useQuery({
        queryKey: ['issues'],
        queryFn: issuesApi.getIssues,
    });
}; 