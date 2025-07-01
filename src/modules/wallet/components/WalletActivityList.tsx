import { FC, useEffect, useRef, useState } from "react";

import { Box, Text, Spinner } from "../../../blocks";
import { WalletActivityListItem } from "./WalletActivityListItem";
import { useGetWalletActivities } from "../../../hooks/useGetWalletActivities";
import { convertCaipToObject } from "../Wallet.utils";

export type WalletActivityListProps = {
  address: string;
};

const WalletActivityList: FC<WalletActivityListProps> = ({ address }) => {
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const { result } = convertCaipToObject(address);

  const { data: activitiesData, isLoading: loadingActivities, refetch: refetchActivities } = useGetWalletActivities({ address: result.address });

  const handleScroll = () => {
    if (!containerRef.current || loadingActivities || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        refetchActivities()
        return nextPage;
      });
    }
  };

  useEffect(() => {
    if (address) {
      setHasMore(true);
      setPage(1);
      refetchActivities();
    }
  }, [address]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="292px"
      overflow="hidden scroll"
      padding='spacing-none spacing-xs spacing-none spacing-none'
      onScroll={hasMore ? handleScroll : undefined}
      ref={containerRef}
      customScrollbar
    >
      {!loadingActivities && activitiesData.map((transaction, index) => {
        const { result } = convertCaipToObject(address);
        return (
          <WalletActivityListItem
            key={`${transaction.hash}-${index}`}
            transaction={transaction}
            address={result.address}
          />
        )
      })}

      {loadingActivities && (
        <Box
          margin="spacing-xs"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner variant="primary" />
        </Box>
      )}

      {!loadingActivities && activitiesData === undefined && (
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
