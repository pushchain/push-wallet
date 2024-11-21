import { FC, useState } from "react";
import { Tabs } from "../../../blocks";
import { WalletActivityList } from "./WalletActivityList";

import { MyWallets } from "./MyWallets";
import { useGlobalState } from "../../../context/GlobalContext";

export type WalletTabsProps = {};

const WalletTabs: FC<WalletTabsProps> = () => {
  const [activeTab, setActiveTab] = useState("activity");
  const { state } = useGlobalState();

  const TabsArray = [
    {
      label: "Activity",
      key: "activity",
      children: <WalletActivityList />,
    },
    {
      label: "My Wallets",
      key: "wallets",
      children: <MyWallets />,
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
