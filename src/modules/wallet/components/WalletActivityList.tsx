import { FC, useCallback, useEffect, useRef, useState } from "react";

import { Box, Text, Spinner } from "../../../blocks";
import { WalletActivityListItem } from "./WalletActivityListItem";
import { PushChain } from "@pushchain/core";

export type WalletActivityListProps = {
  address: string;
};

const WalletActivityList: FC<WalletActivityListProps> = ({ address }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchActivities = useCallback(
    async (pageNumber: number) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        // const pushChain = await PushChain.initialize(null, {
        //   network: config.APP_ENV,
        //   rpcUrl: import.meta.env.VITE_APP_RPC_URL,
        // });

        // const response = await PushChain.viem.(universalAccount, {
        //   startTime: Math.floor(Date.now()),
        //   order: ORDER.DESC,
        //   page: pageNumber,
        //   limit: 20,
        // })

        // const transactions = response.blocks
        //   .map((tx) => tx.transactions)
        //   .flat();

        // const filteredTransactions = transactions.filter(transaction => !transaction.category.includes('CHESS'));

        // setActivities((prev) => [...prev, ...filteredTransactions]);

        // setHasMore(response.totalPages > pageNumber);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasMore, address]
  );

  const handleScroll = () => {
    if (!containerRef.current || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchActivities(nextPage);
        return nextPage;
      });
    }
  };

  useEffect(() => {
    if (address) {
      setActivities([]);
      setHasMore(true);
      setPage(1);
      fetchActivities(1);
    }
  }, [address]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="292px"
      overflow="hidden scroll"
      onScroll={hasMore ? handleScroll : undefined}
      ref={containerRef}
      customScrollbar
    >
      {activities.map((transaction, index) => (
        <WalletActivityListItem
          key={`${transaction.hash}-${index}`}
          transaction={transaction}
          address={address}
        />
      ))}

      {isLoading && (
        <Box
          margin="spacing-xs"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner variant="primary" />
        </Box>
      )}

      {!activities.length && !isLoading && (
        <Box
          margin="spacing-xxxl spacing-none spacing-none spacing-none"
          display="flex"
          justifyContent="center"
        >
          <Text variant="bes-semibold" color="pw-int-text-primary-color">
            Your activity will appear here
          </Text>
        </Box>
      )}
    </Box>
  );
};

export { WalletActivityList };
