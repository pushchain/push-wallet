// hooks/useTransactions.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchWalletActivities, FetchWalletActivitiesParams } from '../helpers/WalletActivitiesHelper';
import { ActivitiesNextPageParams } from '../types/walletactivities.types';

export const useGetWalletActivities = (params: FetchWalletActivitiesParams) => {
    const { address, limit = 10, filter } = params;

    return useInfiniteQuery({
        queryKey: ['transactions', address, limit, filter],
        queryFn: ({ pageParam }: { pageParam?: ActivitiesNextPageParams }) =>
            fetchWalletActivities({
                address,
                pageParam,
                limit,
                filter,
            }),
        enabled: !!address,
        getNextPageParam: (lastPage) => {
            return lastPage.next_page_params || undefined;
        },
        initialPageParam: undefined as ActivitiesNextPageParams | undefined,
        staleTime: 5 * 60 * 1000,
    });
};
