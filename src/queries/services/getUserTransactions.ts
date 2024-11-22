import {
    Tx as PushTx,
  } from "@pushprotocol/node-core";
import config from "../../config";
import { ENV } from "../../constants";


type GetUserTransactionsParams = {
    address: string,
    page: number,
    limit: number,
    direction: "ASC" | "DESC",
    startTime: number
  };
export const getUserTransactions =  ({address,page,limit,startTime,direction}):GetUserTransactionsParams => {
    // const pushTx =  PushTx.initialize(config.APP_ENV as ENV);
    pushTx.get(
      startTime,
      direction,
      limit,
      page,
      address
    ).then()
    return userTransactions;
  };