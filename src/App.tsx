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
import { EventEmitterProvider } from "./context/EventEmitterContext";

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
            dispatch({
              type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE",
              payload: "rejected",
            });
          },
          onAuthFlowClose: () => {
            dispatch({
              type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE",
              payload: "rejected",
            });
          },
          onAuthFlowOpen: () => {
            dispatch({
              type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE",
              payload: "loading",
            });
          },
          onAuthFailure: (method, reason) => {
            console.log("Auth failed ", reason);
            dispatch({
              type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE",
              payload: "rejected",
            });
          },
          onAuthInit: (args) => {
            dispatch({
              type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE",
              payload: "loading",
            });
          },
          onAuthSuccess: (args) => {
            console.log(
              "User has successfully authenticated, check the network"
            );

            dispatch({
              type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE",
              payload: "check_network",
            });

            // dispatch({
            //   type: "SET_EXTERNAL_WALLET_AUTH_LOAD_STATE",
            //   payload: "success",
            // });
          },
        },
      }}
    >
      <ThemeProvider theme={isDarkMode ? themeConfig.dark : themeConfig.light}>
        <GlobalStyle />
        <Router basename={getAppBasePath()}>
          <GlobalProvider>
            <EventEmitterProvider>
              <RouterContainer />
              {/* </Router> */}
            </EventEmitterProvider>
          </GlobalProvider>
        </Router>
      </ThemeProvider>
    </DynamicContextProvider>
  );
}
