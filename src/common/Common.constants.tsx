import { FC } from "react";
import {
  BackpackIcon,
  BitGetWalletIcon,
  BnbIcon,
  BraveIcon,
  Coin98Icon,
  CoinbaseIcon,
  ExodusIcon,
  FlowIcon,
  GlowIcon,
  MagicEdenIcon,
  MathWalletIcon,
  MetaMaskIcon,
  NightlyIcon,
  OkxIcon,
  OneKeyIcon,
  PhantomIcon,
  RabbyIcon,
  RainbowIcon,
  SafeIcon,
  SequenceIcon,
  SolflareIcon,
  TrustIcon,
  UnisatIcon,
  UnstoppableIcon,
  WalletConnectIcon,
  ZeroDevIcon,
} from "@dynamic-labs/iconic";
import {
  Arbitrum,
  ArbitrumMonotone,
  Avalanche,
  AvalancheMonotone,
  BNB,
  BnbMonotone,
  Ethereum,
  EthereumMonotone,
  IconProps,
  Optimisim,
  OptimismMonotone,
  Polygon,
  PolygonMonotone,
  PushAlpha,
  PushChainLogo,
  PushChainMonotone,
  PushMonotone,
  Solana,
  SolanaMonotone,
} from "../blocks";
import { ChainType, WalletCategoriesType } from "../types/wallet.types";

export const walletCategories: WalletCategoriesType[] = [
  {
    chain: ChainType.PUSH_WALLET,
    wallet: "pushWallet",
    label: "Connect Push Wallet",
    icon: <PushAlpha width={24} height={24} />,
    isMobile: false,
  },
  {
    chain: ChainType.ETHEREUM,
    wallet: "ethereum",
    label: "Connect Ethereum Wallet",
    icon: <Ethereum width={24} height={24} />,
    isMobile: false,
  },
  {
    chain: ChainType.SOLANA,
    wallet: "solana",
    label: "Connect Solana Wallet",
    icon: <Solana width={24} height={24} />,
    isMobile: false,
  },
  {
    chain: ChainType.WALLET_CONNECT,
    wallet: "walletConnect",
    label: "Connect using Wallet Connect",
    icon: <WalletConnectIcon width={24} height={24} />,
    isMobile: true,
  },
  // {
  //   chain: ChainType.ARBITRUM,
  //   wallet: "ethereum",
  //   label: "Connect Arbitrum Wallet",
  //   icon: <Arbitrum width={24} height={24} />,
  //   isMobile: false,
  // },
  // {
  //   chain: ChainType.BINANCE,
  //   wallet: "ethereum",
  //   label: "Connect Binance Wallet",
  //   icon: <BNB width={24} height={24} />,
  //   isMobile: false,
  // },
  // {
  //   chain: ChainType.AVALANCHE,
  //   wallet: "ethereum",
  //   label: "Connect Avalanche Wallet",
  //   icon: <Avalanche width={24} height={24} />,
  //   isMobile: false,
  // },
];

export const CHAIN_MONOTONE_LOGO: {
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
  43114: AvalancheMonotone,
  43113: AvalancheMonotone,
  "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": SolanaMonotone, // mainnet
  "4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z": SolanaMonotone, // testnet
  EtWTRABZaYq6iMfeYKouRu166VU2xqa1: SolanaMonotone, // devnet
  devnet: PushChainMonotone,
};

export const CHAIN_LOGO: {
  [x: number | string]: FC<IconProps>;
} = {
  1: Ethereum,
  11155111: Ethereum,
  137: Polygon,
  80002: Polygon,
  97: BNB,
  56: BNB,
  42161: Arbitrum,
  421614: Arbitrum,
  11155420: Optimisim,
  10: Optimisim,
  2442: Polygon,
  1101: Polygon,
  43114: Avalanche,
  43113: Avalanche,
  "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": Solana, // mainnet
  "4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z": Solana, // testnet
  EtWTRABZaYq6iMfeYKouRu166VU2xqa1: Solana, // devnet
};

export const TOKEN_LOGO = {
  pETH: Ethereum,
  pPOL: Polygon,
  PC: PushChainLogo,
};

export const WALLETS_LOGO = {
  coinbasesolana: <CoinbaseIcon />,
  backpacksol: <BackpackIcon />,
  solflare: <SolflareIcon />,
  bitgetwalletsol: <BitGetWalletIcon />,
  brave: <BraveIcon />,
  coin98sol: <Coin98Icon />,
  coin98: <Coin98Icon />,
  exodussol: <ExodusIcon />,
  glow: <GlowIcon />,
  magicedensol: <MagicEdenIcon />,
  mathwalletsol: <MathWalletIcon />,
  mathwallet: <MathWalletIcon />,
  nightlysol: <NightlyIcon />,
  okxsolana: <OkxIcon />,
  onekeysol: <OneKeyIcon />,
  onekey: <OneKeyIcon />,
  phantom: <PhantomIcon />,
  exodus: <ExodusIcon />,
  metamask: <MetaMaskIcon />,
  okxwallet: <OkxIcon />,
  bitgetwallet: <BitGetWalletIcon />,
  trust: <TrustIcon />,
  binance: <BnbIcon />,
  uniswap: <UnisatIcon />,
  safepal: <SafeIcon />,
  rainbow: <RainbowIcon />,
  bravesol: <BraveIcon />,
  coinbase: <CoinbaseIcon />,
  zerion: <ZeroDevIcon />,
  rabby: <RabbyIcon />,
  walletconnect: <WalletConnectIcon />,
  magiceden: <MagicEdenIcon />,
  flowwallet: <FlowIcon />,
  unstoppable: <UnstoppableIcon />,
  backpack: <BackpackIcon />,
  sequence: <SequenceIcon />,
};

export const ERC20ABI = [
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
];

export const EXPLORER_URL = `https://donut.push.network`;
export const FAUCET_URL = "https://faucet.push.org";

