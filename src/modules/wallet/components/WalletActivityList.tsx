import { FC, useEffect } from "react";
import { css } from "styled-components";
import { Box, ExternalLink, Text } from "../../../blocks";
import { centerMaskWalletAddress } from "../../../common";
import { WalletListType } from "../Wallet.types";
import { useGlobalState } from "../../../context/GlobalContext";
import { useGetUserTransactions } from "../../../queries";

export type WalletActivityListProps = {
  selectedWallet:WalletListType;
};

const WalletActivityList: FC<WalletActivityListProps> = ({selectedWallet}) => {
  const { state } = useGlobalState();
  const {data} = useGetUserTransactions(selectedWallet?.fullAddress,1,10,'DESC',Math.floor(Date.now()));
console.debug(data,'data');
  // useEffect(()=>{
  //   (async()=>{
  //     const data = await state?.wallet?.getTransactions(selectedWallet?.fullAddress);
  //     console.debug(data,'activity')
  //     const dataSource =
  //   data?.transactions.map((dt) => ({
  //     id: dt.txnHash,
  //     status: dt.status,
  //     txHash: dt.txnHash,
  //     blockHash: dt.blockHash,
  //     category: dt.category,
  //     from: JSON.stringify({ from: dt.from, source: dt.source }),
  //     recipients: dt.recipients,
  //     ts: dt.ts,
  //   })) || [];
  //   })();
  // })
  return (
    <Box display="flex" flexDirection="column" height="292px" overflow="scroll">
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
