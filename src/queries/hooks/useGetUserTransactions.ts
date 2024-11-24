import { userTransactions } from "../queryKeys";
import { getUserTransactions } from "../services";
import { useQuery } from '@tanstack/react-query';
import {
    Tx as PushTx,
  } from "@pushprotocol/node-core";
import config from "../../config";
import { ENV } from "../../constants";

export const useGetUserTransactions = (
  address: string,
  page: number,
  limit: number,
  direction: "ASC" | "DESC",
  startTime: number
) => {
    const pushTx =  PushTx.initialize(config.APP_ENV as ENV);
  const query = useQuery({
    queryKey: [userTransactions, address],
    queryFn: () =>
      getUserTransactions({  address, page, limit,startTime,direction ,pushTx}),
    enabled: !!address, // This is required to avoid extra func calls
  });
  return query;
};


