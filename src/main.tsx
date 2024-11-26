import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { DynamicContextProvider, SortWallets } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <DynamicContextProvider
      settings={{
        initialAuthenticationMode: "connect-only",
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        environmentId: import.meta.env.VITE_APP_DYNAMIC_ENV_ID,
        walletConnectors: [
          EthereumWalletConnectors,
          SolanaWalletConnectors,
        ],
      }}
    >
      <App />
    </DynamicContextProvider>
  </>
);
