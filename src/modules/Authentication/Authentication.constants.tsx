import { Apple, DiscordSimple, Github, TwitterSimple } from "../../blocks";
import { SocialsType, WalletKeyPairType } from "./Authentication.types";

export const socialLoginConfig: SocialsType[] = [
  {
    name: "apple",
    icon: <Apple color="icon-hero-icons" size={24} />,
  },
  {
    name: "github",
    icon: <Github color="icon-hero-icons" size={24} />,
  },
  {
    name: "twitter",
    icon: <TwitterSimple color="icon-hero-icons" size={24} />,
  },
  {
    name: "discord",
    icon: <DiscordSimple width={24} height={24} />,
  },
];

export const solanaWallets: WalletKeyPairType = {
  coinbase: "Coinbase",
  backpack: "Backpack",
  bitgetwallet: "Bitget",
  brave: "Brave",
  coin98: "Coin98",
  exodus: "Exodus Wallet",
  fallbackconnector: "Fallback Connector",
  glow: "Glow",
  magiceden: "Magic Eden",
  mathwallet: "Math Wallet",
  nightlysol: "Nightly",
  okxwallet: "OKX Wallet",
  onekey: "OneKey",
  phantom: "Phantom",
  solflare: "Solflare",
};

export const allowedEvmWallets = [
  "metamask",
  "trust",
  "safepal",
  "binance",
  "uniswap",
  "coinbase",
  "walletconnect",
  "rainbow",
  "backpack",
  "zerion",
  "rabby",
  "flowwallet",
  "sequence",
  "unstoppable",
  "frontier",
  "1inch",
  "mewwallet",
  "obvious",
  "enkrypt",
  "krakenwallet",
];
