import { FC, useCallback, useEffect, useRef, useState } from "react";

import { Box, Text, Spinner } from "../../../blocks";
import { Tx as PushTx } from "@pushprotocol/node-core";
import config from "../../../config";
import { ENV } from "../../../constants";
import { BlockType } from "@pushprotocol/node-core/src/lib/block/block.types";
import { WalletActivityListItem } from "./WalletActivityListItem";

export type WalletActivityListProps = {
  address: string;
};

const WalletActivityList: FC<WalletActivityListProps> = ({ address }) => {
  const [activities, setActivities] = useState<BlockType["transactions"]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchActivities = useCallback(
    async (pageNumber: number) => {
      if (isLoading) return; 
      setIsLoading(true);
      try {
        const pushTx = await PushTx.initialize(config.APP_ENV as ENV);
        const response = await pushTx.get(
          Math.floor(Date.now()),
          "DESC",
          20,
          pageNumber,
          address || null
        );

        const transactions = response.blocks
          .map((tx) => tx.transactions)
          .flat();

          setActivities((prev) => [...prev, ...transactions]);

        setHasMore(response.totalPages > pageNumber); 
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
      onScroll={hasMore?handleScroll:undefined}
      ref={containerRef}
      customScrollbar
    >
      {activities.map((transaction, index) => (
        <WalletActivityListItem
          key={`${transaction.txnHash}-${index}`}
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
          <Text variant="bes-semibold" color="text-primary">
            Your activity will appear here
          </Text>
        </Box>
      )}
    </Box>
  );
};

export { WalletActivityList };
