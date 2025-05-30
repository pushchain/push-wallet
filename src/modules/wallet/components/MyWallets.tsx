import { FC } from "react";
import { Box } from "../../../blocks";
import { WalletList } from "./WalletList";
import { WalletListType } from "../Wallet.types";

export type MyWalletsProps = {
  walletList:WalletListType[];
  selectedWallet: WalletListType;
  setSelectedWallet:React.Dispatch<React.SetStateAction<WalletListType>>
};

const MyWallets: FC<MyWalletsProps> = ({walletList,setSelectedWallet,selectedWallet}) => {
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing-sm"
      height="292px"
      overflow="hidden scroll"
      customScrollbar
    >
      <WalletList walletList={walletList} setSelectedWallet={setSelectedWallet} selectedWallet={selectedWallet}/>
      {/* <Box display="flex" gap="spacing-sm" alignItems="center">
        <Separator />
        <Text
          variant="c-bold"
          color="pw-int-text-tertiary-color"
          css={css`
            flex-shrink: 0;
          `}
        >
          Connect more accounts
        </Text>
        <Separator />
      </Box> */}
      {/* <WalletCategories/> */}
    </Box>
  );
};

export { MyWallets };
