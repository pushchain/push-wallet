import { BrowserRouter as Router } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import { GlobalProvider } from "./context/GlobalContext";
import { blocksTheme, getBlocksCSSVariables } from "./blocks";
import { getAppBasePath } from "../basePath";
import { useDarkMode, RouterContainer } from "./common";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { AppProvider, useAppState } from "./context/AppContext";

const GlobalStyle = createGlobalStyle`
  :root{
    /* Font Family */
      --font-family: 'FK Grotesk Neu';

    /* New blocks theme css variables*/
  
    ${(props) => getBlocksCSSVariables(props.theme.blocksTheme)}
  }
`;

const themeConfig = {
  dark: {
    blocksTheme: blocksTheme.dark,
    scheme: "dark",
  },
  light: { blocksTheme: blocksTheme.light, scheme: "light" },
};

const runYourOwnLogic = (): Promise<boolean> => {
  return Promise.resolve(false);
};
export default function App() {
  const { isDarkMode } = useDarkMode();
  const {
    dispatch,
    state: { externalWalletAuthState },
  } = useAppState();
  // const runYourOwnLogic = (): Promise<boolean> => {
  //   return new Promise((resolve) => {
  //     const timeoutId = setTimeout(() => {
  //       if (externalWalletAuthState === "loading") {
  //         console.debug('returning false')

  //         dispatch({ type: "SET_EXTERNAL_WALLET_TIMEOUT_STATE" });
  //         resolve(false);
  //       }
  //     }, 10000);

  //     const intervalId = setInterval(() => {
  //       if (externalWalletAuthState === "success") {
  //         clearTimeout(timeoutId); 
  //         clearInterval(intervalId); 
  //         resolve(true);
  //       }
  //     }, 100); 
  //     resolve(true);
  //   });
  // };

  return (
    <DynamicContextProvider
      theme="dark"
      settings={{
        initialAuthenticationMode: "connect-only",
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        environmentId: import.meta.env.VITE_APP_DYNAMIC_ENV_ID,
        walletConnectors: [EthereumWalletConnectors, SolanaWalletConnectors],
        // handlers: {
        //   handleAuthenticatedUser: async (args) => {
        //     console.log("handleAuthenticatedUser was called", args);

        //     // await customUserObjectProcess(args.user);
        //   },
        //   handleConnectedWallet: (args) => {
        //     console.log("handleConnectedWallet was called", args);
        //     // if runYourOwnLogic return true, the connection will be established, otherwise it will not
        //     return runYourOwnLogic();
        //   },
        // },
        events: {
          onAuthFlowCancel: () => {
            dispatch({ type: "SET_EXTERNAL_WALLET_REJECT_STATE" });
          },
          onAuthFlowClose: () => {
            dispatch({ type: "SET_EXTERNAL_WALLET_REJECT_STATE" });
          },
          onAuthFlowOpen: () => {
            dispatch({ type: "SET_EXTERNAL_WALLET_LOAD_STATE" });
          },
          onAuthFailure: (method, reason) => {
            dispatch({ type: "SET_EXTERNAL_WALLET_REJECT_STATE" });
          },
          onAuthInit: (args) => {
            dispatch({ type: "SET_EXTERNAL_WALLET_LOAD_STATE" });
          },
          onAuthSuccess: (args) => {
            dispatch({ type: "SET_EXTERNAL_WALLET_SUCCESS_STATE" });
          },
        },
      }}
    >
      <ThemeProvider theme={isDarkMode ? themeConfig.dark : themeConfig.light}>
        <GlobalStyle />
        <GlobalProvider>
          <Router basename={getAppBasePath()}>
            <RouterContainer />
          </Router>
        </GlobalProvider>
      </ThemeProvider>
    </DynamicContextProvider>
  );
}
