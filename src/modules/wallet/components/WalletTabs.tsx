import { FC, useState } from "react";
import { Tabs } from "../../../blocks";
import { WalletActivityList } from "./WalletActivityList";

import { MyWallets } from "./MyWallets";
import { useGlobalState } from "../../../context/GlobalContext";
import { WalletListType } from "../Wallet.types";

export type WalletTabsProps = {
  walletList:WalletListType[];
  selectedWallet: WalletListType;
  setSelectedWallet:React.Dispatch<React.SetStateAction<WalletListType>>
};

const WalletTabs: FC<WalletTabsProps> = ({walletList,selectedWallet,setSelectedWallet}) => {
  const [activeTab, setActiveTab] = useState("activity");
  const { state } = useGlobalState();

  const TabsArray = [
    {
      label: "Activity",
      key: "activity",
      children: <WalletActivityList selectedWallet={selectedWallet}/>,
    },
    {
      label: "My Wallets",
      key: "wallets",
      children: <MyWallets walletList={walletList} setSelectedWallet={setSelectedWallet} selectedWallet={selectedWallet}/>,
    },
  ];
  if(!state?.wallet)
    TabsArray.pop();
  return (
    <Tabs
      items={TabsArray}
      activeKey={activeTab}
      onChange={(activeKey) => setActiveTab(activeKey)}
    />
  );
};

export { WalletTabs };
