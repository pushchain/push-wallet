import { ReactNode } from "react";

export type WalletCategoriesType = {
  value: string;
  label: string;
  icon: ReactNode;
};

export enum WALLET_TO_APP_ACTION {
  IS_LOGGED_IN = "isLoggedIn",

  APP_CONNECTION_REJECTED = "appConnectionRejected",
  APP_CONNECTION_SUCCESS = "appConnectionSuccess",

  IS_LOGGED_OUT = "loggedOut",
  TAB_CLOSED = "tabClosed",
}

export enum APP_TO_WALLET_ACTION {
  NEW_CONNECTION_REQUEST = "newConnectionRequest",
  SIGN_MESSAGE = "signMessage",
}

export type PushWalletAppConnectionData = {
  origin: string;
  appConnectionStatus: "connected" | "pending";
};
