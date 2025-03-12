import { BrowserRouter as Router } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import { GlobalProvider } from "./context/GlobalContext";
import { blocksTheme, getBlocksCSSVariables } from "./blocks";
import { getAppBasePath } from "../basePath";
import { useDarkMode, RouterContainer } from "./common";
import { EventEmitterProvider } from "./context/EventEmitterContext";
import { WalletContextProvider } from "./context/WalletContext";

const GlobalStyle = createGlobalStyle`
  :root{
    /* Font Family */
      --font-family: 'FK Grotesk Neu';

    /* New blocks theme css variables*/
    ${(props) => {
    // @ts-expect-error: The getBlocksCSSVariables function is not typed, so we need to suppress the error here.
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
  return (
    <ThemeProvider theme={isDarkMode ? themeConfig.dark : themeConfig.light}>
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
