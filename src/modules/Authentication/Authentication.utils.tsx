import { priorityEvmWallets, solanaWallets } from "./Authentication.constants";
import { WalletKeyPairType } from "./Authentication.types";

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

export const filterEthereumWallets = (wallets: Record<string, string>) => {
  const result = Object.fromEntries(
    Object.entries(wallets).filter(([key]) => !(key in solanaWallets))
  );
  return prioritizeWallets(result, priorityEvmWallets);
};

const prioritizeWallets = (
  wallets: Record<string, string>,
  priority: string[]
) => {
  return Object.fromEntries(
    Object.entries(wallets).sort(([keyA], [keyB]) => {
      const isPriorityA = priority.includes(keyA);
      const isPriorityB = priority.includes(keyB);

      if (isPriorityA && !isPriorityB) return -1;
      if (!isPriorityA && isPriorityB) return 1;

      return 0;
    })
  );
};
