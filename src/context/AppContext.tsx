import {
    createContext,
    ReactNode,
    useContext,
    useReducer,
  } from "react";
  
  // Define the shape of the app state
  export type AppState = {
    externalWalletAuthState: "idle" | "success" | "loading" | "rejected";
  };
  
  // Define actions for state management
  export type AppAction =
    | { type: "RESET_EXTERNAL_WALLET_STATE" }
    | { type: "SET_EXTERNAL_WALLET_LOAD_STATE" }
    | { type: "SET_EXTERNAL_WALLET_SUCCESS_STATE" }
    | { type: "SET_EXTERNAL_WALLET_REJECT_STATE" };
  
  // Initial state
  const initialState: AppState = {
    externalWalletAuthState: "idle",
  };
  
  // Reducer function to manage state transitions
  function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
      case "SET_EXTERNAL_WALLET_LOAD_STATE":
        return {
          ...state,
          externalWalletAuthState: 'loading'
      };
      case "SET_EXTERNAL_WALLET_REJECT_STATE":
        return {
          ...state,
          externalWalletAuthState: 'rejected'
      };
      case "SET_EXTERNAL_WALLET_SUCCESS_STATE":
        return {
          ...state,
          externalWalletAuthState: 'success'
      };
      case "RESET_EXTERNAL_WALLET_STATE":
        return {
          ...state,
          externalWalletAuthState: 'idle'
      };
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
  
    return (
      <AppContext.Provider value={{ state, dispatch }}>
        {children}
      </AppContext.Provider>
    );
  };
  