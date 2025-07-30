import { TransactionType } from "../modules/wallet/Wallet.types";

export type WalletActivitiesResponse = {
    hash: string;
    value: bigint;
    from: {
        hash: string;
        name?: string;
    };
    to: {
        hash: string;
        name?: string;
    } | null;
    created_contract: {
        hash: string;
        name?: string;
    } | null;
    timestamp: string;
    gas_used: string;
    fee: {
        value: string;
    };
    status: string;
    transaction_types: Array<TransactionType>;
    block_number: number;
}

export type ActivitiesNextPageParams = {
    block_number: number;
    fee: string;
    hash: string;
    index: number;
    inserted_at: string;
    items_count: number;
    value: string;
}