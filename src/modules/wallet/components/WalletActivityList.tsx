import { FC, useCallback, useEffect, useState } from "react";
import { css } from "styled-components";
import InfiniteScroll from "react-infinite-scroller";

import { Box, ExternalLink, Text, Spinner } from "../../../blocks";
import { centerMaskWalletAddress } from "../../../common";
import { Tx as PushTx } from "@pushprotocol/node-core";
import config from "../../../config";
import { ENV } from "../../../constants";
import { BlockResponse } from "@pushprotocol/node-core/src/lib/block/block.types";

export type WalletActivityListProps = {
  address: string;
};

const WalletActivityList: FC<WalletActivityListProps> = ({ address }) => {
  const [activities, setActivities] = useState<BlockResponse["blocks"]>([]);

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
        setActivities((prev) => [...prev, ...response.blocks]);
        setHasMore(response.totalPages > page);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasMore, address]
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
      //  customScrollbar={true}
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
      {activityList.map((activity, index) => (
        <Box
          display="flex"
          justifyContent="space-between"
          padding="spacing-sm spacing-xxxs"
          key={`${index}`}
          css={css`
            border-bottom: var(--border-sm) solid var(--stroke-secondary);
          `}
        >
          <Box display="flex" gap="spacing-xxs">
            <Box
              display="flex"
              padding="spacing-xxs"
              alignItems="center"
              borderRadius="radius-xs"
              backgroundColor="surface-primary"
              border="border-sm solid stroke-secondary"
              width="32px"
              height="32px"
            >
              <ExternalLink size={16} color="icon-primary" />
            </Box>
            <Box display="flex" flexDirection="column">
              <Text variant="bm-regular">{activity.action}</Text>
              <Box display="flex" gap="spacing-xxxs">
                {/* Add support for chain icon as well for supported chains */}
                <Box
                  height="16px"
                  width="16px"
                  backgroundColor="surface-tertiary"
                  borderRadius="radius-xxxs"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {/* Get a new text variant added in design system for this. */}
                  <Text
                    color="text-tertiary"
                    variant="os-bold"
                    css={css`
                      font-size: 8px;
                      padding-top: 1px;
                    `}
                  >
                    {activity.chain.slice(0, 2).toUpperCase()}
                  </Text>
                </Box>
                <Text color="text-secondary" variant="bes-semibold">
                  {centerMaskWalletAddress(activity.addresses[0])}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap="spacing-xxxs">
            <Text variant="bes-regular">{activity.type}</Text>
            <Text variant="c-semibold">{activity.time}</Text>
          </Box>
        </Box>
      ))}
      {/* </InfiniteScroll> */}
    </Box>
  );
};

export { WalletActivityList };

const activityList = [
  {
    type: "Notification",
    time: "40 mins ago",
    action: "Send",
    chain: "Optimism",
    addresses: [
      "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
      "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
      "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
    ],
  },
  {
    type: "Message",
    time: "40 mins ago",
    action: "Receive",
    chain: "Polygon",
    addresses: [
      "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
      "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
      "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
    ],
  },
  {
    type: "Notification",
    time: "40 mins ago",
    action: "Send",
    chain: "Optimism",
    addresses: [
      "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
      "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
      "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
    ],
  },
  {
    type: "Message",
    time: "40 mins ago",
    action: "Receive",
    chain: "Polygon",
    addresses: ["0x78bB82699f030195AC5B94C6c0dc9977050213c7"],
  },
  {
    type: "Notification",
    time: "40 mins ago",
    action: "Send",
    chain: "Optimism",
    addresses: ["0x78bB82699f030195AC5B94C6c0dc9977050213c7"],
  },
  {
    type: "Message",
    time: "40 mins ago",
    action: "Receive",
    chain: "Polygon",
    addresses: [
      "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
      "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
      "0x78bB82699f030195AC5B94C6c0dc9977050213c7",
    ],
  },
];
