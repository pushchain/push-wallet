// hooks/useTransactions.ts
import { useQuery } from '@tanstack/react-query';
import { fetchWalletActivities, FetchWalletActivitiesParams } from '../helpers/WalletActivitiesHelper';

export const useGetWalletActivities = (params: FetchWalletActivitiesParams) => {
    const { address, page, limit, filter } = params;

    return useQuery({
        queryKey: ['transactions', address, page, limit, filter],
        queryFn: () => fetchWalletActivities(params),
        enabled: !!address,
        // keepPreviousData: true,
    });
};
