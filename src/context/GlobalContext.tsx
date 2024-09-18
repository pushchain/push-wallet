import { createContext, ReactNode, useContext, useReducer } from 'react'
import { PushWallet } from '../services/pushWallet/pushWallet' // Ensure the import path is correct

// Define the shape of the global state
interface GlobalState {
  wallet: PushWallet | null
  theme: 'light' | 'dark'
}

// Define actions for state management
type GlobalAction =
  | { type: 'INITIALIZE_WALLET'; payload: PushWallet }
  | { type: 'RESET_WALLET' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }

// Initial state
const initialState: GlobalState = {
  wallet: null,
  theme: 'light',
}

// Reducer function to manage state transitions
function globalReducer(state: GlobalState, action: GlobalAction): GlobalState {
  switch (action.type) {
    case 'INITIALIZE_WALLET':
      return { ...state, wallet: action.payload }
    case 'RESET_WALLET':
      return { ...state, wallet: null }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    default:
      return state
  }
}

// Create context
const GlobalContext = createContext<{
  state: GlobalState
  dispatch: React.Dispatch<GlobalAction>
}>({
  state: initialState,
  dispatch: () => null, // Placeholder function for initial context
})

// Custom hook to use the GlobalContext
export function useGlobalState() {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalProvider')
  }
  return context
}

// Provider component to wrap around your app
export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(globalReducer, initialState)

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}
