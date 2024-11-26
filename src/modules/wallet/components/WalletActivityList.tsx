import { FC, useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

import { Box, Spinner } from "../../../blocks";
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

  const fetchActivities = useCallback(
    async (pageNumber: number) => {
      if (isLoading || !hasMore) return;
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
        console.log("RES==", address, response);
        // Assuming response contains `data` array and its length determines `hasMore`
        const transactions = response.blocks.map((tx) => (tx.transactions)).flat();
        setActivities((prev) => [...prev, ...transactions]);
        setHasMore(response.totalPages === 0 ? true : response.totalPages > page);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasMore, address, page]
  );

  const loadMore = (pageNumber: number) => {
    setPage(pageNumber);
    fetchActivities(pageNumber);
  };


  useEffect(() => {
    address && fetchActivities(page);
  }, [page, address]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="292px"
      overflow="scroll"
    // customScrollbar={true}
    >
      {/* <InfiniteScroll
        pageStart={1}
        loadMore={loadMore}
        hasMore={hasMore}
        loader={
          <Box margin="spacing-xs" key="loader-spinner">
            <Spinner variant="primary" />
          </Box>
        }
        useWindow={false} // Set true if you want to scroll the entire window
      > */}
      {activities.map((transaction, index) => {
        return (
          <WalletActivityListItem transaction={transaction} address={address} />
        )


      })}
      {/* </InfiniteScroll> */}
    </Box>
  );
};

export { WalletActivityList };