import { useQuery } from '@tanstack/react-query';
import { fetchUserBalance } from '../helpers/WalletHelper';

export const useWalletOperations = (address: string) => {
    return useQuery({
        queryKey: ['userBalance', address],
        queryFn: () => fetchUserBalance(address),
        enabled: !!address,
    });
};