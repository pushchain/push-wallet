import { FC, useState } from "react";
import { Box, Tabs } from "../../../blocks";
import { WalletActivityList } from "./WalletActivityList";

import { MyWallets } from "./MyWallets";
import { useGlobalState } from "../../../context/GlobalContext";
import { WalletListType } from "../Wallet.types";

export type WalletTabsProps = {
  walletList: WalletListType[];
  selectedWallet: WalletListType;
  setSelectedWallet: React.Dispatch<React.SetStateAction<WalletListType>>;
};

const WalletTabs: FC<WalletTabsProps> = ({
  walletList,
  selectedWallet,
  setSelectedWallet,
}) => {
  const [activeTab, setActiveTab] = useState("activity");
  const { state } = useGlobalState();

  return (
    <Box height="340px">
      <Tabs
        items={[
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
        onChange={(activeKey) => setActiveTab(activeKey)}
      />
    </Box>
  );
};

export { WalletTabs };
