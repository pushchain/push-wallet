// helpers/fetchTransactions.ts
import axios from 'axios';
import { EXPLORER_URL } from 'common';

export interface FetchWalletActivitiesParams {
    address: string;
    page?: number;
    limit?: number;
    filter?: string;
}

export const fetchWalletActivities = async ({
    address,
    page = 1,
    limit = 10,
    filter = 'to | from',
}: FetchWalletActivitiesParams) => {
    const url = `${EXPLORER_URL}/api/v2/addresses/${address}/transactions`;

    const response = await axios.get(url, {
        params: {
            page,
            limit,
        },
        headers: {
            accept: 'application/json',
        },
    });

    return response.data.items;
};
