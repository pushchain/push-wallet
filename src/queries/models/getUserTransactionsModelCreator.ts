import { BlockResponse } from '@pushprotocol/push-chain/src/lib/block/block.types';


//add type
//any remodelling needed in the response can be done here
export const getUserTransactionsModelCreator = (response: BlockResponse): any =>
  response;
