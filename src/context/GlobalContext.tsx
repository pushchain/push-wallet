import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useEffect,
} from "react";
import { PushWallet } from "../services/pushWallet/pushWallet";
import { fetchJwtUsingState } from "../helpers/AuthHelper";
import {
  getAllAppConnections,
  PushWalletAppConnectionData,
} from "../common";
import { APP_ROUTES } from "../constants";
import { useWallet } from "./WalletContext";
import { WalletConfig, WalletInfo } from "../types/wallet.types";

// Define the shape of the global state
export type GlobalState = {
  wallet: PushWallet | null;
  appConnections: PushWalletAppConnectionData[];
  externalWallet: WalletInfo | null;
  theme: "light" | "dark";
  user: any;
  isAuthenticated: boolean;
  jwt: string | null;
  walletConfig: WalletConfig | null;
  walletLoadState: "idle" | "success" | "loading" | "rejected";
  messageSignState: "idle" | "loading" | "rejected";
  externalWalletAppConnectionStatus: "pending" | "connected";
  externalWalletAuthState:
  | "idle"
  | "success"
  | "loading"
  | "rejected"
  | "timeout";
};

// Define actions for state management
export type GlobalAction =
  | { type: "INITIALIZE_WALLET"; payload: PushWallet }
  | { type: "SET_APP_CONNECTIONS"; payload: PushWalletAppConnectionData[] }
  | { type: "SET_EXTERNAL_WALLET"; payload: WalletInfo }
  | { type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE"; payload: GlobalState["externalWalletAuthState"] }
  | { type: "RESET_WALLET" }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "SET_USER"; payload: any }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "SET_JWT"; payload: string }
  | { type: "WALLET_CONFIG"; payload: WalletConfig }
  | { type: "SET_WALLET_LOAD_STATE"; payload: GlobalState["walletLoadState"] }
  | { type: "SET_MESSAGE_SIGN_STATE"; payload: GlobalState["messageSignState"] }
  | {
    type: "SET_EXTERNAL_WALLET_APP_CONNECTION_STATUS";
    payload: GlobalState["externalWalletAppConnectionStatus"];
  };

// Initial state
const initialState: GlobalState = {
  wallet: null,
  appConnections: getAllAppConnections(),
  externalWallet: null,
  theme: "light",
  user: null,
  isAuthenticated: false,
  jwt: null,
  walletConfig: null,
  walletLoadState: "idle",
  messageSignState: "idle",
  externalWalletAppConnectionStatus: "pending",
  externalWalletAuthState: "idle",
};

// Reducer function to manage state transitions
function globalReducer(state: GlobalState, action: GlobalAction): GlobalState {
  switch (action.type) {
    case "INITIALIZE_WALLET":
      return {
        ...state,
        wallet: action.payload,
      };
    case "SET_APP_CONNECTIONS":
      return {
        ...state,
        appConnections: action.payload,
      };
    case "SET_EXTERNAL_WALLET":
      return {
        ...state,
        externalWallet: action.payload,
      };
    case "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE":
      return {
        ...state,
        externalWalletAuthState: action.payload,
      };
    // Reset your all the state variable while logging out
    case "RESET_WALLET":
      return {
        ...state,
        ...initialState,
      };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload };
    case "SET_JWT":
      return { ...state, jwt: action.payload };
    case "WALLET_CONFIG":
      return { ...state, walletConfig: action.payload };
    case "SET_WALLET_LOAD_STATE":
      return { ...state, walletLoadState: action.payload };
    case "SET_MESSAGE_SIGN_STATE":
      return {
        ...state,
        messageSignState: action.payload,
      };
    case "SET_EXTERNAL_WALLET_APP_CONNECTION_STATUS":
      return { ...state, externalWalletAppConnectionStatus: action.payload };
    default:
      return state;
  }
}

// Create context
const GlobalContext = createContext<{
  state: GlobalState;
  dispatch: React.Dispatch<GlobalAction>;
}>({
  state: initialState,
  dispatch: () => null, // Placeholder function for initial context
});

// Custom hook to use the GlobalContext
export function useGlobalState() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalProvider");
  }
  return context;
}

// Provider component to wrap around your app
export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  const params = new URLSearchParams(location.search);

  const { currentWallet } = useWallet();

  const stateParam = params.get("state");

  const storedToken = sessionStorage.getItem("jwt");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "loading" });

        // This condition is valid for social login and email for redirection during login
        if (stateParam) {
          const jwtToken = await fetchJwtUsingState({
            stateParam,
          });

          sessionStorage.setItem("jwt", jwtToken);
          const url = new URL(window.location.href);
          url.searchParams.delete("state");
          window.history.replaceState({}, document.title, url.toString());

          dispatch({ type: "SET_JWT", payload: jwtToken });

          dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "success" });
        }

        // This condition is valid for social login and email for during reload
        if (storedToken) {
          dispatch({ type: "SET_JWT", payload: storedToken });

          dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "success" });
        }

        if (currentWallet) {
          dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "success" });
          dispatch({ type: "SET_EXTERNAL_WALLET", payload: currentWallet });
        }

        if (!stateParam && !storedToken && !currentWallet) {
          dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "rejected" });
        }
      } catch (error) {
        dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "rejected" });
        console.error("Error creating wallet:", error);
        throw error;
      }
    };

    // We don't need to do jwt token network calls on the oauth route to avoid expiring the token
    window.location.pathname !== APP_ROUTES.OAUTH_REDIRECT && fetchUser();
  }, [stateParam, storedToken, currentWallet]);

  return (
    <GlobalContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
