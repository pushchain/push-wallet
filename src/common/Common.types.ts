import { ReactNode } from "react";

export type WalletCategoriesType = {
  chain: string;
  wallet: 'ethereum' | 'solana';
  label: string;
  icon: ReactNode;
};

export enum WALLET_TO_APP_ACTION {
  IS_LOGGED_IN = "isLoggedIn",

  APP_CONNECTION_REJECTED = "appConnectionRejected",
  APP_CONNECTION_SUCCESS = "appConnectionSuccess",
  APP_CONNECTION_RETRY = "appConnectionRetry",

  SIGNATURE = "signature",

  IS_LOGGED_OUT = "loggedOut",
  TAB_CLOSED = "tabClosed",
  ERROR = "error",

  CONNECT_WALLET = "connectWallet",
}

export enum APP_TO_WALLET_ACTION {
  NEW_CONNECTION_REQUEST = "newConnectionRequest",
  SIGN_MESSAGE = "signMessage",
  LOG_OUT = "logOut",

  CONNECTION_STATUS = "connectionStatus",
}

export enum WALLET_TO_WALLET_ACTION {
  AUTH_STATE_PARAM = "authStateParam",
  PHANTOM_SUCCESS = "phantomsuccessful",
  PHANTOM_SIGN = "phantomsign",
  PHANTOM_SIGN_SUCCESS = "phantomsignsuccessful",
  PHANTOM_SIGN_ERROR = "phantomsignerror",
  CLOSE_TAB = "closetab",
}

export type PushWalletAppConnectionData = {
  origin: string;
  appConnectionStatus: "connected" | "pending";
};
