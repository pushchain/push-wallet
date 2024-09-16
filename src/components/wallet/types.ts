import { WALLET_STATE } from '../../constants'

export interface WalletProps {
  changeWalletState: (newState: WALLET_STATE) => void
}
