import { createContext, ReactNode, useContext, useReducer, useEffect } from 'react'
import { PushWallet } from '../services/pushWallet/pushWallet'
import { PostMessageHandler } from '../services/messageHandler/messageHandler'
import api from '../services/api'

// Define the shape of the global state
interface GlobalState {
  wallet: PushWallet | null
  theme: 'light' | 'dark'
  postMessageHandler: PostMessageHandler
  user: any // Add user to manage authentication state
  isAuthenticated: boolean
  jwt: string | null;

}

// Define actions for state management
type GlobalAction =
  | { type: 'INITIALIZE_WALLET'; payload: PushWallet }
  | { type: 'RESET_WALLET' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_JWT'; payload: string }
  | { type: 'RESET_AUTHENTICATED' }
  | { type: 'RESET_USER' };

// Initial state
const initialState: GlobalState = {
  wallet: null,
  theme: 'light',
  postMessageHandler: new PostMessageHandler(undefined),
  user: null,
  isAuthenticated: false,
  jwt: null,
}

// Reducer function to manage state transitions
function globalReducer(state: GlobalState, action: GlobalAction): GlobalState {
  switch (action.type) {
    case 'INITIALIZE_WALLET':
      return {
        ...state,
        wallet: action.payload,
        postMessageHandler: new PostMessageHandler(action.payload),
      }
    case 'RESET_WALLET':
      return {
        ...state,
        wallet: null,
        postMessageHandler: new PostMessageHandler(undefined),
      }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload }
    case 'SET_JWT':
      return { ...state, jwt: action.payload };
    case 'RESET_AUTHENTICATED':
      return { ...state, isAuthenticated: false };
    case 'RESET_USER':
      return { ...state, user: null };
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem('jwt');
        if (token) {
          // Optionally, set the token in the Axios instance
          // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Or use an interceptor as previously defined

          // Fetch user profile
          const response = await api.get('/auth/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          dispatch({ type: 'SET_USER', payload: response.data });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
          dispatch({ type: 'SET_JWT', payload: token });
        }
      } catch (error) {
        console.error('User not authenticated', error);
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        dispatch({ type: 'SET_JWT', payload: null });
      }
    };

    fetchUser();
  }, []);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}
