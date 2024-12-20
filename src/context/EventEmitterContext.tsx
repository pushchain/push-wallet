import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "./GlobalContext";
import {
  acceptPushWalletConnectionRequest,
  APP_TO_APP_ACTION,
  APP_TO_WALLET_ACTION,
  getAllAppConnections,
  getAppParamValue,
  rejectAllPushWalletConnectionRequests,
  rejectPushWalletConnectionRequest,
  usePersistedQuery,
  WALLET_TO_APP_ACTION,
} from "../common";
import { requestToConnectPushWallet } from "../common";
import { PushSigner } from "../services/pushSigner/pushSigner";
import { Signer } from "../services/pushSigner/pushSigner.types";
import { APP_ROUTES } from "../constants";

// Define the shape of the app state
export type EventEmitterState = {
  handleUserLoggedIn: () => void;
  handleLogOutEvent: () => void;
  handleAppConnectionSuccess: (origin: string) => void;
  handleAppConnectionRejected: (origin: string) => void;
  handleRejectAllAppConnections: () => void;
  handleRetryAppConnection: () => void;
};

// Create context
const WalletContext = createContext<EventEmitterState>({
  handleUserLoggedIn: () => {},
  handleLogOutEvent: () => {},
  handleAppConnectionSuccess: () => {},
  handleAppConnectionRejected: () => {},
  handleRejectAllAppConnections: () => {},
  handleRetryAppConnection: () => {},
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

  const navigate = useNavigate();

  const persistQuery = usePersistedQuery();

  // TODO: Right now we check the logged in wallet type. But we need to support the functionality of selected wallet type of the app.

  // For social login and email
  const walletRef = useRef(state.wallet);

  walletRef.current = state.wallet;

  useEffect(() => {
    if (walletRef.current && !isLoggedEmitterCalled) {
      console.log("Sending connection request");

      setLoginEmitterStatus(true);
      handleUserLoggedIn();
    }
  }, [walletRef.current]);

  // for external wallets
  const externalWalletRef = useRef<Signer | null>(null);

  useEffect(() => {
    if (state.dynamicWallet && !isLoggedEmitterCalled) {
      (async () => {
        externalWalletRef.current = await PushSigner.initialize(
          state.dynamicWallet,
          "DYNAMIC"
        );

        setLoginEmitterStatus(true);
        handleUserLoggedIn();
      })();
    }
  }, [state.dynamicWallet]);

  // Event listener for messages
  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (
        event.origin === getAppParamValue() ||
        event.origin === window.location.origin
      ) {
        switch (event.data.type) {
          case APP_TO_WALLET_ACTION.NEW_CONNECTION_REQUEST:
            handleNewConnectionRequest(event.origin);
            break;
          case APP_TO_WALLET_ACTION.SIGN_MESSAGE:
            console.log("Signing Message on wallet tab");
            handleSignAndSendMessage(event.data.data, event.origin);
            break;
          case APP_TO_APP_ACTION.AUTH_STATE_PARAM:
            console.log("App Data received", event.data);
            handleAuthStateParam(event.data.state);
            break;
          default:
            console.warn("Unknown message type:", event.data.type);
        }
      }
    };

    window.addEventListener("message", messageHandler);

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  // Function to send messages to the main tab
  const sendMessageToMainTab = (data: any) => {
    if (window.parent) {
      try {
        window.parent.postMessage(data, getAppParamValue());
      } catch (error) {
        console.error("Error sending message to main tab:", error);
      }
    }
  };

  const handleNewConnectionRequest = (origin: string) => {
    const appConnections = requestToConnectPushWallet(origin);

    // Checking if appConnection is already connected or not, if connected so emit success message
    const appFound = appConnections.find((each) => each.origin === origin);
    if (appFound.appConnectionStatus === "connected") {
      handleAppConnectionSuccess(origin);
      return;
    }

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

  const handleRetryAppConnection = () => {
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.APP_CONNECTION_RETRY,
      data: {
        account: null,
      },
    });
  };

  const handleSignAndSendMessage = async (message: string, origin: string) => {
    try {
      dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "loading" });
      const signature = externalWalletRef?.current
        ? await externalWalletRef?.current?.signMessage(message)
        : await walletRef.current.sign(message, origin, getAllAppConnections());

      console.log("Signature signed", signature);

      sendMessageToMainTab({
        type: WALLET_TO_APP_ACTION.SIGNATURE,
        data: { signature },
      });

      if (externalWalletRef?.current?.account) {
        dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "idle" });
      } else {
        setTimeout(
          () => dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "idle" }),
          2000
        );
      }
    } catch (error) {
      // pass the error to other tab as well
      console.log(error);
      dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "rejected" });
      sendMessageToMainTab({
        type: WALLET_TO_APP_ACTION.ERROR,
        data: {
          error: error,
        },
      });
    }
  };

  const handleUserLoggedIn = () => {
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.IS_LOGGED_IN,
      data: {
        account: externalWalletRef?.current?.account ?? null,
      },
    });

    if (externalWalletRef?.current?.account) {
      dispatch({
        type: "SET_EXTERNAL_WALLET_APP_CONNECTION_STATUS",
        payload: "connected",
      });
    }
  };

  const handleLogOutEvent = () => {
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.IS_LOGGED_OUT,
      data: {
        account: null,
      },
    });
    setLoginEmitterStatus(false);
    walletRef.current = null;
    externalWalletRef.current = null;
  };

  const handleAuthStateParam = (state: string) => {
    dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "idle" });
    navigate(`${persistQuery(APP_ROUTES.WALLET)}&state=${state}`, {
      replace: true,
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
        handleRetryAppConnection,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
