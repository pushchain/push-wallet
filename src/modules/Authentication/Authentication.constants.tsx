import { Apple, DiscordSimple, Ethereum, Github, Solana, TwitterSimple } from "../../blocks";
import { SocialsType, WalletCategoriesType } from "./Authentication.types";

export const walletCategories:WalletCategoriesType[] = [
  
  {
    value: "ethereum",
    label:'Link Ethereum Wallet',
    icon: <Ethereum/>,
  },
  {
    value: "solana",
    label:'Link Solana Wallet',
    icon: <Solana/>,
  }

];

export const socials: SocialsType[] = [
  {
    name: "apple",
    icon: <Apple color='icon-hero-icons' size={24}/>,
  },
  {
    name: "github",
    icon: <Github color='icon-hero-icons' size={24}/>,
  },
  {
    name: "twitter",
    icon: <TwitterSimple color='icon-hero-icons' size={24}/>,
  },
  {
    name: "discord",
    icon: <DiscordSimple width={24} height={24}/>,
  },
];

