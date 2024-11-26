import React from "react";
import { FC } from "react";
import {
  ArbitrumMonotone,
  BnbMonotone,
  EthereumMonotone,
  IconProps,
  OptimismMonotone,
  PolygonMonotone,
  PushMonotone,
  SolanaMonotone,
} from "../blocks";
import { WalletCategoriesType } from "./Common.types";
import { BackpackIcon, BinanceIcon, BitGetWalletIcon, BitPayIcon, BnbIcon, BraveIcon, Coin98Icon, CoinbaseIcon, CryptoIcon, ExodusIcon, FireblocksIcon, GlowIcon, ImTokenWallet, MagicEdenIcon, MathWalletIcon, MetaMaskIcon, NightlyIcon, OkxIcon, OneKeyIcon, PhantomIcon, RainbowIcon, SafeIcon, SolflareIcon, TrustIcon, UnisatIcon, ZeroDevIcon } from "@dynamic-labs/iconic";

export const walletCategories: WalletCategoriesType[] = [
  {
    value: "ethereum",
    label: "Link Ethereum Wallet",
    icon: undefined,
  },
  {
    value: "solana",
    label: "Link Solana Wallet",
    icon: undefined,
  },
];

export const CHAIN_LOGO: {
  [x: number | string]: FC<IconProps>;
} = {
  1: EthereumMonotone,
  11155111: EthereumMonotone,
  137: PolygonMonotone,
  80002: PolygonMonotone,
  97: BnbMonotone,
  56: BnbMonotone,
  42161: ArbitrumMonotone,
  421614: ArbitrumMonotone,
  11155420: OptimismMonotone,
  10: OptimismMonotone,
  2442: PolygonMonotone,
  1101: PolygonMonotone,
  "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": SolanaMonotone,
  devnet: PushMonotone,
};

export const WALLETS_LOGO = {
  coinbasesolana: <CoinbaseIcon/>,
  backpacksol: <BackpackIcon/>,
  solflare: <SolflareIcon/>,
  bitgetwalletsol: <BitGetWalletIcon/>,
  bravesol: <BraveIcon/>,
  coin98sol: <Coin98Icon/>,
  exodussol: <ExodusIcon/>,
  glow: <GlowIcon/>,
  magicedensol: <MagicEdenIcon/>,
  mathwalletsol: <MathWalletIcon/>,
  nightlysol: <NightlyIcon/>,
  okxsolana: <OkxIcon/>,
  onekeysol: <OneKeyIcon/>,
  phantom: <PhantomIcon/>,
  exodus:<ExodusIcon/>,
  metamask:<MetaMaskIcon/>,
  okxwallet: <OkxIcon/>,
  bitgetwallet:<BitGetWalletIcon/>,
  trust:<TrustIcon/>,
  binance:<BnbIcon/>,
  uniswap:<UnisatIcon/>,
  safepal:<SafeIcon/>,
  rainbow:<RainbowIcon/>,
  // bybitwallet:<BitPayIcon/>,
  // tokenPocket:<ImTokenWallet/>,
  zerion:<ZeroDevIcon/>,
  // cryptocom:<CryptoIcon/>,
  magiceden:<MagicEdenIcon/>,
  backpack:<BackpackIcon/>,
  // fireblocks:<FireblocksIcon/>,
  // onekeywallet: <OneKeyIcon/>,
};
