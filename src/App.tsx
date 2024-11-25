import { BrowserRouter as Router } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import { GlobalProvider } from "./context/GlobalContext";
import { blocksTheme, getBlocksCSSVariables } from "./blocks";
import { getAppBasePath, useDarkMode, RouterContainer } from "./common";
import AuthContextProvider from "./context/AuthContext";

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

export default function App() {
  const baseUrl = window.location.origin + "/push-keys/#";

  const { isDarkMode } = useDarkMode();

  return (
    <ThemeProvider theme={isDarkMode ? themeConfig.dark : themeConfig.light}>
      <GlobalStyle />
      <GlobalProvider>
        <AuthContextProvider>
          <Router basename={getAppBasePath()}>
            <RouterContainer />
            {/* <Routes> */}
            {/* <RouterConatiner/> */}
            {/* <Route path="/landing" element={<Landing />} />

                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} /> */}
            {/* Redirect to home if route is not found
                // {/* <Route path="*" element={<Navigate to="/" />} />  */}
            {/* </Routes> */}
          </Router>
        </AuthContextProvider>
      </GlobalProvider>
    </ThemeProvider>
  );
}
