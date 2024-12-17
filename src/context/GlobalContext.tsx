import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useEffect,
} from "react";
import { PushWallet } from "../services/pushWallet/pushWallet";
import { fetchJwtUsingState } from "../helpers/AuthHelper";
import { useDynamicContext, Wallet } from "@dynamic-labs/sdk-react-core";
import { getAllAppConnections, PushWalletAppConnectionData } from "../common";
import { APP_ROUTES } from "../constants";
import { useNavigate } from "react-router-dom";

// Define the shape of the global state
export type GlobalState = {
  wallet: PushWallet | null;
  appConnections: PushWalletAppConnectionData[];
  dynamicWallet: Wallet | null;
  theme: "light" | "dark";
  user: any;
  isAuthenticated: boolean;
  jwt: string | null;
  walletLoadState: "idle" | "success" | "loading" | "rejected";
  messageSignState: "idle" | "loading" | "rejected";
  externalWalletAppConnectionStatus: "pending" | "connected";
  stateParam: string | null;
};

// Define actions for state management
export type GlobalAction =
  | { type: "INITIALIZE_WALLET"; payload: PushWallet }
  | { type: "INITIALIZE_STATE_APP_PARAMS"; payload: GlobalState['stateParam'] }
  | { type: "SET_APP_CONNECTIONS"; payload: PushWalletAppConnectionData[] }
  | { type: "SET_DYNAMIC_WALLET"; payload: Wallet }
  | { type: "RESET_WALLET" }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "SET_USER"; payload: any }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "SET_JWT"; payload: string }
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
  dynamicWallet: null,
  theme: "light",
  user: null,
  isAuthenticated: false,
  jwt: null,
  walletLoadState: "idle",
  messageSignState: "idle",
  externalWalletAppConnectionStatus: "pending",
  stateParam: null,
};

// Reducer function to manage state transitions
function globalReducer(state: GlobalState, action: GlobalAction): GlobalState {
  switch (action.type) {
    case "INITIALIZE_WALLET":
      return {
        ...state,
        wallet: action.payload,
      };
    case "INITIALIZE_STATE_APP_PARAMS":
      return {
        ...state,
        stateParam: action.payload,
      };
    case "SET_APP_CONNECTIONS":
      return {
        ...state,
        appConnections: action.payload,
      };
    case "SET_DYNAMIC_WALLET":
      return {
        ...state,
        dynamicWallet: action.payload,
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

  const { primaryWallet, sdkHasLoaded } = useDynamicContext();

  const navigate = useNavigate();

  // const stateParam = extractStateFromUrl();
  const storedToken = sessionStorage.getItem("jwt");

  useEffect(() => {
    console.count();

    const fetchUser = async () => {
      try {
        dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "loading" });

        console.log("Params Available from store in useEffect", state.stateParam)

        // This condition is valid for social login and email for redirection during login
        if (state.stateParam) {
          const jwtToken = await fetchJwtUsingState({
            stateParam: state.stateParam,
          });

          sessionStorage.setItem("jwt", jwtToken);

          dispatch({ type: "SET_JWT", payload: jwtToken });
          dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "success" });

          navigate(APP_ROUTES.WALLET)
        }

        // This condition is valid for social login and email for during reload
        if (storedToken) {
          dispatch({ type: "SET_JWT", payload: storedToken });

          dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "success" });
        }

        // This condition is valid for continue with wallet for during login and reload
        if (primaryWallet) {
          dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "success" });
          dispatch({ type: "SET_DYNAMIC_WALLET", payload: primaryWallet });
        }

        if (!state.stateParam && !storedToken && !primaryWallet && sdkHasLoaded) {
          dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "rejected" });
        }
      } catch (error) {
        dispatch({ type: "SET_WALLET_LOAD_STATE", payload: "rejected" });
        console.error("Error creating wallet:", error);
        throw error;
      }
    };

    fetchUser();
  }, [state.stateParam, primaryWallet, sdkHasLoaded]);

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
