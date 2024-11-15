import { FC, useState } from "react";
import { Tabs } from "../../../blocks";
import { WalletActivityList } from "./WalletActivityList";

import { MyWallets } from "./MyWallets";

export type WalletTabsProps = {};

const WalletTabs: FC<WalletTabsProps> = () => {
  const [activeTab, setActiveTab] = useState("activity");
  return (
    <Tabs
      items={[
        {
          label: "Activity",
          key: "activity",
          children: <WalletActivityList />,
        },
        { label: "My Wallets", key: "wallets", children: <MyWallets /> },
      ]}
      activeKey={activeTab}
      onChange={(activeKey) => setActiveTab(activeKey)}
    />
  );
};

export { WalletTabs };
