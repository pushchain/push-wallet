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
  WALLET_TO_WALLET_ACTION,
  APP_TO_WALLET_ACTION,
  getAllAppConnections,
  getAppParamValue,
  rejectAllPushWalletConnectionRequests,
  rejectPushWalletConnectionRequest,
  usePersistedQuery,
  WALLET_TO_APP_ACTION,
  useDarkMode,
} from "../common";
import { requestToConnectPushWallet } from "../common";
import { APP_ROUTES } from "../constants";
import { AppMetadata, ChainType, CONSTANTS, IWalletProvider, LoginMethodConfig, WalletConfig, WalletInfo } from "../types/wallet.types";
import { useAppState } from "./AppContext";
import { TypedData, TypedDataDomain } from "viem";

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
  handleUserLoggedIn: () => { },
  handleLogOutEvent: () => { },
  handleAppConnectionSuccess: () => { },
  handleAppConnectionRejected: () => { },
  handleRejectAllAppConnections: () => { },
  handleRetryAppConnection: () => { },
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
  const { dispatch: appDispatch } = useAppState();
  const { enable, disable } = useDarkMode();

  const [isLoggedEmitterCalled, setLoginEmitterStatus] = useState(false);

  const navigate = useNavigate();

  const persistQuery = usePersistedQuery();

  // TODO: Right now we check the logged in wallet type. But we need to support the functionality of selected wallet type of the app.

  // For social login and email
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
      if (
        event.origin === getAppParamValue() ||
        event.origin === window.location.origin
      ) {
        switch (event.data.type) {
          case APP_TO_WALLET_ACTION.NEW_CONNECTION_REQUEST:
            handleNewConnectionRequest(event.origin);
            break;
          case APP_TO_WALLET_ACTION.WALLET_CONFIG:
            handleWalletConfigs(event.data.data);
            break;
          case APP_TO_WALLET_ACTION.SIGN_MESSAGE:
            handleSignAndSendMessage(event.data.data, event.origin);
            break;
          case APP_TO_WALLET_ACTION.SIGN_TRANSACTION:
            handleSignAndSendTransaction(event.data.data, event.origin);
            break;
          case APP_TO_WALLET_ACTION.SIGN_TYPED_DATA:
            handleSignTypedData(event.data.data, event.origin);
            break;
          case APP_TO_WALLET_ACTION.LOG_OUT:
            handleLogOutEvent();
            break;
          case APP_TO_WALLET_ACTION.CONNECTION_STATUS:
            handleExternalWalletConnection(event.data.data);
            break;
          case WALLET_TO_WALLET_ACTION.AUTH_STATE_PARAM:
            handleAuthStateParam(event.data.state);
            break;
          default:
            console.warn("Unknown message type:", event.data);
        }
      }
    };

    window.addEventListener("message", messageHandler);

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  // Function to send messages to the main tab
  const sendMessageToMainTab = (data: unknown) => {
    if (window.parent) {
      try {
        window.parent.postMessage(data, getAppParamValue());
      } catch (error) {
        console.error("Error sending message to main tab:", error);
      }
    }
  };

  const handleExternalWalletConnection = (data: {
    status: string;
    address: string;
    providerName: IWalletProvider["name"];
    chainType: ChainType;
  }) => {
    if (data.status === 'successful') {
      const walletPayload: WalletInfo = {
        address: data.address,
        chainType: data.chainType,
        providerName: data.providerName,
      };

      dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "success" });
      dispatch({ type: "SET_EXTERNAL_WALLET", payload: walletPayload });
      navigate(`${persistQuery(APP_ROUTES.WALLET)}`, {
        replace: true,
      });
    } else {
      dispatch({
        type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE",
        payload: "rejected",
      });
    }

  };

  const handleSignAndSendMessage = async (message: Uint8Array, origin: string) => {
    try {
      dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "loading" });

      const signature = await walletRef.current.signMessage(
        message,
        origin,
        getAllAppConnections()
      );

      sendMessageToMainTab({
        type: WALLET_TO_APP_ACTION.SIGN_MESSAGE,
        data: { signature },
      });

      setTimeout(
        () => dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "idle" }),
        2000
      );
    } catch (error) {
      dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "rejected" });
      sendMessageToMainTab({
        type: WALLET_TO_APP_ACTION.ERROR,
        data: {
          error: error,
        },
      });
    }
  };

  const handleSignAndSendTransaction = async (txn: Uint8Array, origin: string) => {
    try {
      dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "loading" });

      const signature = await walletRef.current.signAndSendTransaction(
        txn,
        origin,
        getAllAppConnections()
      );

      sendMessageToMainTab({
        type: WALLET_TO_APP_ACTION.SIGN_TRANSACTION,
        data: { signature },
      });

      setTimeout(
        () => dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "idle" }),
        2000
      );
    } catch (error) {
      dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "rejected" });
      sendMessageToMainTab({
        type: WALLET_TO_APP_ACTION.ERROR,
        data: {
          error: error,
        },
      });
    }
  };

  const handleSignTypedData = async (typedData: {
    domain: TypedDataDomain;
    types: TypedData;
    primaryType: string;
    message: Record<string, unknown>;
  }, origin: string) => {
    try {
      dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "loading" });

      const signature = await walletRef.current.signTypedData(
        typedData,
        origin,
        getAllAppConnections()
      );

      sendMessageToMainTab({
        type: WALLET_TO_APP_ACTION.SIGN_TYPED_DATA,
        data: { signature },
      });

      setTimeout(
        () => dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "idle" }),
        2000
      );
    } catch (error) {
      dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "rejected" });
      sendMessageToMainTab({
        type: WALLET_TO_APP_ACTION.ERROR,
        data: {
          error: error,
        },
      });
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

    const universalSigner = walletRef?.current?.universalSigner

    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.APP_CONNECTION_SUCCESS,
      data: {
        account: universalSigner.account,
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

  const handleWalletConfigs = (data: {
    loginDefaults: LoginMethodConfig,
    themeMode: typeof CONSTANTS.THEME.LIGHT | typeof CONSTANTS.THEME.DARK,
    appMetadata: AppMetadata,
    themeOverrides: Record<string, string>,
  }) => {

    console.log(data.themeOverrides);
    data.themeMode === CONSTANTS.THEME.DARK ? enable() : disable();

    const walletConfig: WalletConfig = {
      loginDefaults: data.loginDefaults,
      appMetadata: data.appMetadata,
    }

    appDispatch({ type: "SET_THEME_OVERRIDES", payload: { ...data.themeOverrides } });
    dispatch({ type: "WALLET_CONFIG", payload: walletConfig });
  }

  const handleRetryAppConnection = () => {
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.APP_CONNECTION_RETRY,
      data: {
        account: null,
      },
    });
  };

  const handleUserLoggedIn = () => {

    const universalSigner = walletRef?.current?.universalSigner

    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.IS_LOGGED_IN,
      data: {
        account: universalSigner.account ?? null,
      },
    });
  };

  const handleLogOutEvent = () => {
    dispatch({ type: "RESET_WALLET" });
    sessionStorage.removeItem("jwt");

    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.IS_LOGGED_OUT,
      data: {
        account: null,
      },
    });
    setLoginEmitterStatus(false);
    walletRef.current = null;
  };

  const handleAuthStateParam = (state: string) => {
    dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "idle" });
    navigate(`${persistQuery(APP_ROUTES.WALLET, state)}`, {
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
