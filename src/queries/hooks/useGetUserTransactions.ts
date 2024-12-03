import { userTransactions } from "../queryKeys";
import { getUserTransactions } from "../services";
import { useQuery } from "@tanstack/react-query";
import { Tx as PushTx } from "@pushprotocol/push-chain";
import config from "../../config";
import { ENV } from "../../constants";

export const useGetUserTransactions = async (
  address: string,
  page: number,
  limit: number,
  direction: "ASC" | "DESC",
  startTime: number
) => {
  const pushTx = await PushTx.initialize(config.APP_ENV as ENV);
  console.debug(pushTx, "selectedWallet");
  const query = useQuery({
    queryKey: [userTransactions, address, pushTx],
    queryFn: () =>
      getUserTransactions({
        address,
        page,
        limit,
        startTime,
        direction,
        pushTx,
      }),
    enabled: !!address && !!pushTx, // This is required to avoid extra func calls
  });
  return query;
};
