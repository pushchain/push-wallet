import { BrowserRouter as Router } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import { GlobalProvider } from "./context/GlobalContext";
import { blocksTheme, getBlocksCSSVariables } from "./blocks";
import { getAppBasePath } from "../basePath";
import { useDarkMode, RouterContainer } from "./common";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { useAppState } from "./context/AppContext";
import {
  EventEmitterProvider,
  useEventEmitterContext,
} from "./context/EventEmitterContext";
import { useEffect } from "react";

const GlobalStyle = createGlobalStyle`
  :root{
    /* Font Family */
      --font-family: 'FK Grotesk Neu';

    /* New blocks theme css variables*/
  
    ${(props) => {
      // @ts-expect-error
      return getBlocksCSSVariables(props.theme.blocksTheme);
    }}
  }
`;

const themeConfig = {
  dark: {
    blocksTheme: blocksTheme.dark,
    scheme: "dark",
  },
  light: { blocksTheme: blocksTheme.light, scheme: "light" },
};

export default function App() {
  const { isDarkMode } = useDarkMode();
  const { dispatch } = useAppState();

  const { handlePushWalletTabClosedEvent } = useEventEmitterContext();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const appParam = urlParams.get("app");
    if (appParam) {
      // Send a message to the parent when the child tab is closed
      window.onbeforeunload = () => {
        if (window.opener) {
          console.log("Closing the tab", window.opener);
          // // Send a message to the parent app using the target origin (parent's URL)
          // window.opener.postMessage("walletClosed", appParam);
          handlePushWalletTabClosedEvent();
        }
      };
    }
  }, []);

  return (
    <DynamicContextProvider
      theme="dark"
      settings={{
        initialAuthenticationMode: "connect-and-sign",
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        environmentId: import.meta.env.VITE_APP_DYNAMIC_ENV_ID,
        walletConnectors: [EthereumWalletConnectors, SolanaWalletConnectors],
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
          <EventEmitterProvider>
            <Router basename={getAppBasePath()}>
              <RouterContainer />
            </Router>
          </EventEmitterProvider>
        </GlobalProvider>
      </ThemeProvider>
    </DynamicContextProvider>
  );
}
