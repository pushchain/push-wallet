import {  allowedEvmWallets } from "./Authentication.constants";

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
  wallets: Record<string, string>
): Record<string, string> => {
  const result = Object.fromEntries(
    allowedEvmWallets
      .filter((key) => key in wallets) 
      .map((key) => [key, wallets[key]]) 
  );

  return result;
};


