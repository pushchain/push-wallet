import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useGlobalState } from "./GlobalContext";
import {
  acceptPushWalletConnectionRequest,
  APP_TO_WALLET_ACTION,
  getAllAppConnections,
  getAppParamValue,
  rejectAllPushWalletConnectionRequests,
  rejectPushWalletConnectionRequest,
  WALLET_TO_APP_ACTION,
} from "../common";
import { requestToConnectPushWallet } from "../common";

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

  const [isLoggedEmitterCalled, setLoginEmitterStatus] = useState(false);

  const walletRef = useRef(state.wallet);

  walletRef.current = state.wallet;

  useEffect(() => {
    if (walletRef.current && !isLoggedEmitterCalled) {
      setLoginEmitterStatus(true);
      handleUserLoggedIn();
    }
  }, [walletRef.current]);

  // Event listener for messages
  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== getAppParamValue()) return;

      console.log("EMIITER APPLIED");

      switch (event.data.type) {
        case APP_TO_WALLET_ACTION.NEW_CONNECTION_REQUEST:
          handleNewConnectionRequest(event.origin);
          break;
        case APP_TO_WALLET_ACTION.SIGN_MESSAGE:
          console.log("Signing Message on wallet tab");
          handleSignAndSendMessage(event.data.data, event.origin);
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
  const sendMessageToMainTab = (data: any) => {
    if (window.opener) {
      try {
        window.opener.postMessage(data, getAppParamValue());
      } catch (error) {
        console.error("Error sending message to main tab:", error);
      }
    }
  };
  console.log("in emitter context", walletRef.current, state.wallet);

  const handleNewConnectionRequest = (origin: string) => {
    console.log("in emitter context function", walletRef.current);

    const appConnections = requestToConnectPushWallet(origin);

    dispatch({
      type: "SET_APP_CONNECTIONS",
      payload: appConnections,
    });
  };

  const handleAppConnectionSuccess = (origin: string) => {
    const appConnections = acceptPushWalletConnectionRequest(origin);

    dispatch({
      type: "SET_APP_CONNECTIONS",
      payload: appConnections,
    });

    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.APP_CONNECTION_SUCCESS,
      data: {
        account: walletRef.current.signerAccount,
      },
    });
  };

  const handleAppConnectionRejected = (origin: string) => {
    const appConnections = rejectPushWalletConnectionRequest(origin);

    dispatch({
      type: "SET_APP_CONNECTIONS",
      payload: appConnections,
    });

    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.APP_CONNECTION_REJECTED,
      data: {
        account: null,
      },
    });
  };

  const handleRejectAllAppConnections = () => {
    const appConnections = rejectAllPushWalletConnectionRequests();

    dispatch({
      type: "SET_APP_CONNECTIONS",
      payload: appConnections,
    });

    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.APP_CONNECTION_REJECTED,
      data: {
        account: null,
      },
    });
  };

  const handleSignAndSendMessage = async (message: string, origin: string) => {
    console.log("Signing message", message, origin);

    console.log("in signing message function", walletRef.current);

    const signature = await walletRef.current.sign(
      message,
      origin,
      getAllAppConnections()
    );

    console.log("Signature signed", signature);

    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.SIGNATURE,
      data: { signature },
    });
  };

  const handleUserLoggedIn = () => {
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.IS_LOGGED_IN,
      data: {
        account: null,
      },
    });
  };

  const handleLogOutEvent = () => {
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.IS_LOGGED_OUT,
      data: {
        account: null,
      },
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
