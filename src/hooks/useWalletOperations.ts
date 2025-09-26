import { useQuery } from '@tanstack/react-query';
import { fetchUserBalance } from '../helpers/WalletHelper';

export const useWalletOperations = (address: string) => {
    const pollMs = 10_000;

    return useQuery({
        queryKey: ['userBalance', address],
        queryFn: () => fetchUserBalance(address),
        enabled: !!address,
        refetchInterval: pollMs,
        refetchIntervalInBackground: true,
        staleTime: pollMs - 1000,
    });
};