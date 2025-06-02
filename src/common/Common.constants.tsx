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
  PushMonotone,
  Solana,
  SolanaMonotone,
} from "../blocks";
import { ChainType, WalletCategoriesType } from "../types/wallet.types";
import { TokenType } from "../types";

export const walletCategories: WalletCategoriesType[] = [
  {
    chain: ChainType.ETHEREUM,
    wallet: "ethereum",
    label: "Connect Ethereum Wallet",
    icon: <Ethereum width={24} height={24} />,
    isMobile: false,
  },
  {
    chain: ChainType.WALLET_CONNECT,
    wallet: "walletConnect",
    label: "Wallet Connect",
    icon: <WalletConnectIcon width={24} height={24} />,
    isMobile: true,
  },
  {
    chain: ChainType.SOLANA,
    wallet: "solana",
    label: "Connect Solana Wallet",
    icon: <Solana width={24} height={24} />,
    isMobile: false,
  },
  {
    chain: ChainType.ARBITRUM,
    wallet: "ethereum",
    label: "Connect Arbitrum Wallet",
    icon: <Arbitrum width={24} height={24} />,
    isMobile: false,
  },
  {
    chain: ChainType.BINANCE,
    wallet: "ethereum",
    label: "Connect Binance Wallet",
    icon: <BNB width={24} height={24} />,
    isMobile: false,
  },
  {
    chain: ChainType.AVALANCHE,
    wallet: "ethereum",
    label: "Connect Avalanche Wallet",
    icon: <Avalanche width={24} height={24} />,
    isMobile: false,
  },
  {
    chain: ChainType.PUSH_TESTNET,
    wallet: "ethereum",
    label: "Connect Push Testnet",
    icon: <PushAlpha width={24} height={24} />,
    isMobile: false,
  },
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
  '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': SolanaMonotone, // mainnet
  '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z': SolanaMonotone, // testnet
  'EtWTRABZaYq6iMfeYKouRu166VU2xqa1': SolanaMonotone, // devnet
  devnet: PushMonotone,
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
  '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': Solana, // mainnet
  '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z': Solana, // testnet
  'EtWTRABZaYq6iMfeYKouRu166VU2xqa1': Solana, // devnet
};

export const TOKEN_LOGO = {
  'pETH': Ethereum,
  'pPOL': Polygon,
  'PCZ': PushAlpha
}

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


export const tokens: TokenType[] = [
  {
    id: 1,
    name: 'Push Chain Donut',
    symbol: 'PCZ',
    amount: 124.53,
    amountInUsd: 124.53,
    amountChange: '+24.54',
    contractAddress: '0xf418588522d5dd018b425E472991E52EB',
  },
  {
    id: 2,
    name: 'Ethereum',
    symbol: 'pETH',
    amount: 1.49,
    amountInUsd: 3225.21,
    amountChange: '-125.37',
    contractAddress: '0x6D2a0194bD791CADd7a3F5c9464cE9fC24a49e71',
  },
  {
    id: 3,
    name: 'Polygon',
    symbol: 'pPOL',
    amount: 256,
    amountInUsd: 44800.20,
    amountChange: '+8500.00',
    contractAddress: '0x6D2a0194bD791CADd7a3F5c9464cE9fC24a49a3',
  }
]
