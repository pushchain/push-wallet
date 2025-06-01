import { FC, useState } from "react";
import { Box, Tabs } from "../../../blocks";
import { WalletActivityList } from "./WalletActivityList";

import { MyWallets } from "./MyWallets";
import { useGlobalState } from "../../../context/GlobalContext";
import { WalletListType } from "../Wallet.types";
import { TokensList } from "./TokensList";
import { ActiveStates } from "src/types/wallet.types";

export type WalletTabsProps = {
  walletList: WalletListType[];
  selectedWallet: WalletListType;
  setSelectedWallet: React.Dispatch<React.SetStateAction<WalletListType>>;
  setActiveState: (activeStates: ActiveStates) => void;
};

const WalletTabs: FC<WalletTabsProps> = ({
  walletList,
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
                  selectedWallet?.fullAddress || state?.externalWallet?.address
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
