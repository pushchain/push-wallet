import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import { ensureWaapInit } from "../waap/initWaap";

// Define the shape of the app state
export type AppState = {
  externalWalletAuthState:
    | "idle"
    | "success"
    | "loading"
    | "rejected"
    | "timeout",
  themeOverrides: Record<string, string>,
};

// Define actions for state management
export type AppAction = {
  type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE";
  payload: AppState["externalWalletAuthState"];
} | {
  type: "SET_THEME_OVERRIDES";
  payload: Record<string, string>;
};

// Initial state
const initialState: AppState = {
  externalWalletAuthState: "idle",
  themeOverrides: {},
};

// Reducer function to manage state transitions
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE":
      return {
        ...state,
        externalWalletAuthState: action.payload,
      };
    case "SET_THEME_OVERRIDES":
      return { ...state, themeOverrides: action.payload };
    default:
      return state;
  }
}

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null, // Placeholder function for initial context
});

// Custom hook to use the AppContext
export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within a AppProvider");
  }
  return context;
}

// Provider component to wrap around your app
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    ensureWaapInit();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
