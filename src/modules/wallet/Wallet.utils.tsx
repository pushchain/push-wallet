import { PushWallet } from "src/services/pushWallet/pushWallet";
import { ChainType } from "../../types/wallet.types";
import { PushChain } from "@pushchain/core";

export const getWalletlist = (wallet: PushWallet) => {
  const walletList = [];
  // if (attachedAccounts?.length) {
  //   attachedAccounts?.forEach((account, index) => {
  //     let walletObj = {};
  //     if (account.includes("push")) {
  //       walletObj = {
  //         name: "Push Account",
  //         address: wallet?.signerAccount,
  //         fullAddress: wallet?.signerAccount,
  //         isSelected: false,
  //         type: "push",
  //       };
  //     } else {
  //       walletObj = {
  //         name: `Account ${index + 1}`,
  //         address: account.split(':')[2],
  //         fullAddress: account,
  //         isSelected: false,
  //         //TODO:change the type as per backend later
  //         type: "metamask",
  //       };
  //     }
  //     walletList.push(walletObj);
  //   });
  // }

  if (wallet) {
    const universalSigner = wallet?.universalSigner
    const account = PushChain.utils.account.toChainAgnostic(universalSigner.account.address, { chain: universalSigner.account.chain });
    const walletObj = {
      name: "Push Account",
      address: wallet.universalSigner.account.address,
      fullAddress: account,
      isSelected: false,
      type: "push",
    };
    walletList.push(walletObj);
  }

  walletList.reverse();
  return walletList; // Return the wallet list instead of null
};

export function formatWalletCategory(input: string): string {
  // Match the string after the first ':' if it exists
  const match = input.match(/^CUSTOM:(.+)$/);
  if (match && match[1]) {
    // Extract the part after 'CUSTOM:'
    const coreString = match[1];
    // Replace underscores with spaces and capitalize each word
    let formattedString = coreString
      .toLowerCase()
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
    // Trim and add '...' if length exceeds 15
    if (formattedString.length > 15) {
      formattedString = formattedString.slice(0, 15).trim() + "...";
    }
    return formattedString;
  }
}

export const getFixedTime = (timestamp: number | string): string => {
  let timeValue: number;

  if (typeof timestamp === 'string') {
    // Parse ISO string to milliseconds
    timeValue = Date.parse(timestamp);
    if (isNaN(timeValue)) {
      return 'Invalid date';
    }
  } else {
    timeValue = timestamp;
  }

  const now = Date.now();
  const diffInSeconds = Math.floor((now - timeValue) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInWeeks / 4);
  if (diffInMonths < 12) {
    return `${diffInMonths}M ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
};

export const convertCaipToObject = (
  addressinCAIP: string
): {
  result: {
    chainId: string | null;
    chain: string | null;
    address: string | null;
  };
} => {
  // Check if the input is a valid non-empty string
  if (!addressinCAIP || typeof addressinCAIP !== 'string') {
    return {
      result: {
        chain: null,
        chainId: null,
        address: null,
      },
    };
  }

  const addressComponent = addressinCAIP.split(':');

  // Handle cases where there are exactly three components (chain, chainId, address)
  if (addressComponent.length === 3) {
    return {
      result: {
        chain: addressComponent[0],
        chainId: addressComponent[1],
        address: addressComponent[2],
      },
    };
  }
  // Handle cases where there are exactly two components (chain, address)
  else if (addressComponent.length === 2) {
    return {
      result: {
        chain: addressComponent[0],
        chainId: null,
        address: addressComponent[1],
      },
    };
  }
  // If the input doesn't match the expected format, return the address only
  else {
    return {
      result: {
        chain: null,
        chainId: null,
        address: addressinCAIP,
      },
    };
  }
};


export function toCAIPFormat(
  rawAddress: string,
  chain: ChainType,
  chainId: number | string
) {
  const formattedAddress = rawAddress;
  let formattedChainId = chainId;
  let namespace = '';

  if (
    chain.toLowerCase() === ChainType.ETHEREUM ||
    chain.toLowerCase() === ChainType.BINANCE ||
    chain.toLowerCase() === ChainType.ARBITRUM ||
    chain.toLowerCase() === ChainType.AVALANCHE
  ) {
    namespace = 'eip155';

    if (typeof chainId === 'string' && chainId.startsWith('0x')) {
      formattedChainId = parseInt(chainId, 16);
    }
  } else if (chain.toLowerCase() === ChainType.SOLANA) {
    namespace = 'solana';

    // TODO: Find a method to get the solana chain id in caip format
    formattedChainId = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'; //mainnet
  } else {
    throw new Error("Unsupported chain. Use 'ethereum' or 'solana'.");
  }

  return `${namespace}:${formattedChainId}:${formattedAddress}`;
}