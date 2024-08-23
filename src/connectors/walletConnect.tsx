import walletConnectModule from '@web3-onboard/walletconnect'
import config from '../config'

const wcV2InitOptions = {
  /**
   * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
   */
  projectId: import.meta.env.VITE_APP_WALLETCONNECT_PROJECT_ID,
  /**
   * Chains required to be supported by all wallets connecting to your DApp
   */
  requiredChains: [config.DEFAULT_CHAIN],
  /**
   * Optional chains
   */
  optionalChains: config.ALLOWED_NETWORKS,
  version: 2,
}

export const walletConnect = walletConnectModule(wcV2InitOptions)
