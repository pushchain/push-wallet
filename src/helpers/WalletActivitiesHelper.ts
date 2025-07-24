// helpers/fetchTransactions.ts
import axios from 'axios';
import { EXPLORER_URL } from 'common';
import { ActivitiesNextPageParams, WalletActivitiesResponse } from '../types/walletactivities.types';

export interface FetchWalletActivitiesParams {
    address: string;
    pageParam?: ActivitiesNextPageParams;
    page?: number;
    limit?: number;
    filter?: string;
}

export interface ApiResponse {
    items: WalletActivitiesResponse[];
    next_page_params?: ActivitiesNextPageParams;
}

export const fetchWalletActivities = async ({
    address,
    pageParam,
    limit = 10,
    filter = 'to | from',
}: FetchWalletActivitiesParams): Promise<ApiResponse> => {
    const url = `${EXPLORER_URL}/api/v2/addresses/${address}/transactions`;

    // Build query parameters
    const params: Record<string, string> = {};

    if (pageParam) {
        params.block_number = pageParam.block_number.toString();
        params.fee = pageParam.fee;
        params.hash = pageParam.hash;
        params.index = pageParam.index.toString();
        params.inserted_at = pageParam.inserted_at;
        params.items_count = pageParam.items_count.toString();
        params.value = pageParam.value;
    }

    const response = await axios.get<ApiResponse>(url, {
        params,
        headers: {
            accept: 'application/json',
        },
    });

    console.log("Response >>>", response);

    return response.data;
};
