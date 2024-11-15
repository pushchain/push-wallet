import { FC } from "react";
import { Box } from "../../blocks";
import { BoxLayout, ContentLayout } from "../../common";
import { WalletProfile } from "./components/WalletProfile";
import { WalletTabs } from "./components/WalletTabs";

export type WalletProps = {};

const Wallet: FC<WalletProps> = () => {
  return (
    <ContentLayout>
      <BoxLayout>
        <Box
          flexDirection="column"
          display="flex"
          width="376px"
          padding="spacing-md"
          gap="spacing-sm"
        >
          <WalletProfile />
          <WalletTabs />
        </Box>
      </BoxLayout>
    </ContentLayout>
  );
};

export { Wallet };
