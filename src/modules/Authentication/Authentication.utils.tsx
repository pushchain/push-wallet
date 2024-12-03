import { WalletKeyPairType } from "src/modules/Authentication/Authentication.types";
import { allowedEvmWallets } from "./Authentication.constants";

export const getGroupedWallets = (walletOptions) => {
  return walletOptions.reduce((options, wallet) => {
    const key = wallet.group || wallet.key;
    const name = wallet.groupName || wallet.name;

    if (!options[key]) {
      options[key] = name;
    }

    return options;
  }, {});
};

export const filterEthereumWallets = (
  wallets: WalletKeyPairType
): WalletKeyPairType => {
  const result = Object.fromEntries(
    allowedEvmWallets
      .filter((key) => key in wallets)
      .map((key) => [key, wallets[key]])
  );

  return result;
};

export const getInstalledWallets = (wallets, walletOptions):WalletKeyPairType=> {
  const result =  Object.fromEntries(
    Object.entries(wallets).filter(([key]) =>
      walletOptions.some(
        (item) => item.isInstalledOnBrowser === true && item.key === key
      )
    )
  );
  return result as WalletKeyPairType;
}

