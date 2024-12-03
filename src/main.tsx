import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { AppProvider } from "./context/AppContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <AppProvider>
      <App />
    </AppProvider>
  </>
);
