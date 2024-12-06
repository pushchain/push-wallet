import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";

import { GlobalState, useGlobalState } from "./GlobalContext";
import {
  APP_TO_WALLET_ACTION,
  WALLET_TO_APP_ACTION,
} from "../common/Common.types";

// Define the shape of the app state
export type EventEmitterState = {
  handleUserLoggedIn: () => void;
  handleLogOutEvent: () => void;
  handleAppConnectionSuccess: (origin: string) => void;
  handleAppConnectionRejected: (origin: string) => void;
  handleRejectAllAppConnections: () => void;
};

// Create context
const WalletContext = createContext<EventEmitterState>({
  handleUserLoggedIn: () => {},
  handleLogOutEvent: () => {},
  handleAppConnectionSuccess: () => {},
  handleAppConnectionRejected: () => {},
  handleRejectAllAppConnections: () => {},
});

// Custom hook to use the WalletContext
export function useEventEmitterContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletState must be used within a WalletProvider");
  }
  return context;
}

// Provider component to wrap around your app
export const EventEmitterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { dispatch, state } = useGlobalState();

  const walletRef = useRef(state.wallet);

  useEffect(() => {
    walletRef.current = state.wallet;
    if (state.wallet) {
      handleUserLoggedIn();
    }
  }, [state.wallet]);

  const walletData = walletRef.current;

  // Event listener for messages
  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== "http://localhost:5174") return;
      console.log("EMIITER APPLIED");
      switch (event.data.type) {
        case APP_TO_WALLET_ACTION.NEW_CONNECTION_REQUEST:
          handleNewConnectionRequest(event.origin);
          break;
        case APP_TO_WALLET_ACTION.SIGN_MESSAGE:
          console.log("Signing Message on wallet tab");
          break;
        default:
          console.warn("Unknown message type:", event.data.type);
      }
    };

    window.addEventListener("message", messageHandler);

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  // Function to send messages to the main tab
  const sendMessageToMainTab = (message: any) => {
    if (window.opener) {
      try {
        window.opener.postMessage(message, "http://localhost:5174");
      } catch (error) {
        console.error("Error sending message to main tab:", error);
      }
    }
  };

  const handleNewConnectionRequest = (origin: string) => {
    walletData?.requestToConnect(origin);

    const appConnections = localStorage.getItem("appConnections")
      ? JSON.parse(localStorage.getItem("appConnections")!)
      : [];

    const payload = {
      ...walletData,
      appConnections: [...walletData?.appConnections, ...appConnections],
    } as GlobalState["wallet"];

    dispatch({
      type: "INITIALIZE_WALLET",
      payload,
    });
  };

  const handleAppConnectionSuccess = (origin: string) => {
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.APP_CONNECTION_SUCCESS,
      data: "Connection successful",
    });
    walletData?.acceptConnectionReq(origin);
  };

  const handleAppConnectionRejected = (origin: string) => {
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.APP_CONNECTION_REJECTED,
      data: "App Connection Rejected",
    });
    walletData?.rejectConnectionReq(origin);
  };

  const handleRejectAllAppConnections = () => {
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.APP_CONNECTION_REJECTED,
      data: "App Connection Rejected",
    });
    walletData?.rejectAllConnectionReqs();
  };

  const handleUserLoggedIn = () => {
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.IS_LOGGED_IN,
      data: "user_logged_in wallet_address",
    });
  };

  const handleLogOutEvent = () => {
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.IS_LOGGED_OUT,
      data: "user_logged_out",
    });
  };

  return (
    <WalletContext.Provider
      value={{
        handleUserLoggedIn,
        handleLogOutEvent,
        handleAppConnectionSuccess,
        handleAppConnectionRejected,
        handleRejectAllAppConnections,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
