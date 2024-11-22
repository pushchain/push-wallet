import { userTransactions } from "../queryKeys";
import { getUserTransactions } from "../services";
import { useQuery } from '@tanstack/react-query';

export const useGetUserTransactions = (
  address: string,
  page: number,
  limit: number,
  direction: "ASC" | "DESC",
  startTime: number
) => {

  const query = useQuery({
    queryKey: [userTransactions, address],
    queryFn: () =>
      getUserTransactions({  address, page, limit,startTime,direction }),
    enabled: !!address, // This is required to avoid extra func calls
  });
  return query;
};


