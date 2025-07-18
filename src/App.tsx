import { BrowserRouter as Router } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import { GlobalProvider } from "./context/GlobalContext";
import { blocksTheme, getBlocksCSSVariables } from "./blocks";
import { getAppBasePath } from "../basePath";
import { useDarkMode, RouterContainer } from "./common";
import { EventEmitterProvider } from "./context/EventEmitterContext";
import { WalletContextProvider } from "./context/WalletContext";
import { useAppState } from "./context/AppContext";

const GlobalStyle = createGlobalStyle`
  :root{
    /* Font Family */
      --pw-int-font-family: "Arial", sans-serif;
    /* New blocks theme css variables*/
    ${(props) => {
    // @ts-expect-error: The getBlocksCSSVariables function is not typed, so we need to suppress the error here.
    return getBlocksCSSVariables(props.theme.blocksTheme, props.theme.scheme, props.theme.themeOverrides);
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

  const { state } = useAppState();

  return (
    <ThemeProvider theme={{ ...(isDarkMode ? themeConfig.dark : themeConfig.light), themeOverrides: state.themeOverrides }}>
      <GlobalStyle />
      <Router basename={getAppBasePath()}>
        <WalletContextProvider>
          <GlobalProvider>
            <EventEmitterProvider>
              <RouterContainer />
            </EventEmitterProvider>
          </GlobalProvider>
        </WalletContextProvider>
      </Router>
    </ThemeProvider>
  );
}
