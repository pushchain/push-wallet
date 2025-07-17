import { FC, useState } from "react";
import { Box, Tabs } from "../../../blocks";
import { WalletActivityList } from "./WalletActivityList";

import { MyWallets } from "./MyWallets";
import { useGlobalState } from "../../../context/GlobalContext";
import { TokensList } from "./TokensList";
import { ActiveStates, WalletListType } from "../../../types";

export type WalletTabsProps = {
  walletList: WalletListType[];
  walletAddress: string;
  selectedWallet: WalletListType;
  setSelectedWallet: React.Dispatch<React.SetStateAction<WalletListType>>;
  setActiveState: (activeStates: ActiveStates) => void;
};

const WalletTabs: FC<WalletTabsProps> = ({
  walletList,
  walletAddress,
  selectedWallet,
  setSelectedWallet,
  setActiveState
}) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'activity' | 'rewards' | 'wallets'>('tokens');
  const { state } = useGlobalState();

  return (
    <Box height="340px">
      <Tabs
        items={[
          {
            label: "Tokens",
            key: "tokens",
            children: (
              <TokensList setActiveState={setActiveState} />
            )
          },
          {
            label: "Activity",
            key: "activity",
            children: (
              <WalletActivityList
                address={
                  walletAddress
                }
              />
            ),
          },
          ...(state.wallet
            ? [
              {
                label: "My Wallets",
                key: "wallets",
                children: (
                  <MyWallets
                    walletList={walletList}
                    setSelectedWallet={setSelectedWallet}
                    selectedWallet={selectedWallet}
                  />
                ),
              },
            ]
            : []),
        ]}
        activeKey={activeTab}
        onChange={(activeKey: 'tokens' | 'activity' | 'rewards' | 'wallets') => setActiveTab(activeKey)}
      />
    </Box>
  );
};

export { WalletTabs };
