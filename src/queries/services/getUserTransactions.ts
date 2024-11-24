
import { getUserTransactionsModelCreator } from "../models";


type GetUserTransactionsParams = {
    address: string,
    page: number,
    limit: number,
    direction: "ASC" | "DESC",
    startTime: number,
    pushTx: any;
  };
export const getUserTransactions =  ({address,page,limit,startTime,direction,pushTx}):GetUserTransactionsParams => 
    pushTx.get(
      startTime,
      direction,
      limit,
      page,
      address
    ).then(getUserTransactionsModelCreator)
    
