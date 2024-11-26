import { solanaWallets } from "./Authentication.constants";
import { WalletKeyPairType } from "./Authentication.types";


export const getGroupedWallets = (walletOptions)=>{return walletOptions.reduce(
    (options, wallet) => {
      const key = wallet.group || wallet.key;
      const name = wallet.groupName || wallet.name;

      if (!options[key]) {
        options[key] = name;
      }

      return options;
    },
    {}
  );
}

export const filterEthereumWallets = (wallets: Record<string, string>) =>
{
    
    return Object.fromEntries(
        Object.entries(wallets).filter(
          ([key]) => !(key in solanaWallets)
        )
      );
}
