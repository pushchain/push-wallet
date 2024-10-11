import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { AlgorandWalletConnectors } from '@dynamic-labs/algorand'
import { BitcoinWalletConnectors } from '@dynamic-labs/bitcoin'
import { CosmosWalletConnectors } from '@dynamic-labs/cosmos'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { FlowWalletConnectors } from '@dynamic-labs/flow'
import { SolanaWalletConnectors } from '@dynamic-labs/solana'
import { StarknetWalletConnectors } from '@dynamic-labs/starknet'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DynamicContextProvider
      settings={{
        initialAuthenticationMode: 'connect-only',
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        environmentId: import.meta.env.VITE_APP_DYNAMIC_ENV_ID,
        walletConnectors: [
          AlgorandWalletConnectors,
          BitcoinWalletConnectors,
          CosmosWalletConnectors,
          EthereumWalletConnectors,
          FlowWalletConnectors,
          SolanaWalletConnectors,
          StarknetWalletConnectors,
        ],
      }}
    >
      <App />
    </DynamicContextProvider>
  </React.StrictMode>
)
