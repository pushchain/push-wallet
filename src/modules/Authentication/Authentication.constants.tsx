import { Apple, DiscordSimple, Github, TwitterSimple } from "../../blocks";
import { SocialsType, WalletKeyPairType } from "./Authentication.types";

export const socials: SocialsType[] = [
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
  // {
  //   name: "discord",
  //   icon: <DiscordSimple width={24} height={24} />,
  // },
];

export const solanaWallets: WalletKeyPairType = {
  backpacksol: "Backpack",
  bitgetwalletsol: "Bitget",
  brave: "Brave",
  coin98sol: "Coin98",
  coinbasesolana: "Coinbase",
  exodus: "Exodus Wallet",
  fallbackconnector: "Fallback Connector",
  glow: "Glow",
  magiceden: "Magic Eden",
  mathwallet: "Math Wallet",
  nightlysol: "Nightly",
  okxsolana: "OKX Wallet",
  onekeysol: "OneKey",
  phantom: "Phantom",
  solflare: "Solflare",
};
