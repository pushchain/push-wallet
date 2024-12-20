import { ReactNode } from "react";

export type SocialsType = {
  name: string;
  icon: ReactNode;
};

export type WalletKeyPairType = Record<string, string>;

export type WalletState = "connectWallet" | "social" | "authentication";

export type SocialProvider =
  | "github"
  | "google"
  | "discord"
  | "twitter"
  | "apple";
