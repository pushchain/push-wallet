import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { blocksTheme, getBlocksCSSVariables } from "blocks";
import { getAppBasePath, useDarkMode } from "common";
import { Home, Login, Signup } from "./pages";
import config from "./config";
import { GlobalProvider } from "./context/GlobalContext";

const GlobalStyle = createGlobalStyle`
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
  const { isDarkMode } = useDarkMode();
  return (
    <ThemeProvider theme={isDarkMode ? themeConfig.dark : themeConfig.light}>
      <GlobalStyle />
      <GlobalProvider>
        <div className="min-h-screen flex flex-col">
          <h1 className="text-4xl font-bold mt-8 text-center">
            {config.APP_NAME}
          </h1>
          <div className="flex-1 flex items-center justify-center">
            <Router basename={getAppBasePath()}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                {/* Redirect to home if route is not found */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </div>
        </div>
      </GlobalProvider>
    </ThemeProvider>
  );
}
