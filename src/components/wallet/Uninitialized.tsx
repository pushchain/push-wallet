import { WALLET_STATE } from '../../constants'
import { WalletProps } from './types'

export const Uninitialized: React.FC<WalletProps> = ({ changeWalletState }) => {
  return (
    <div className="flex gap-5">
      <button
        onClick={() => changeWalletState(WALLET_STATE.SIGNUP)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg w-44"
      >
        Sign Up
      </button>
      <button
        onClick={() => changeWalletState(WALLET_STATE.LOGIN)}
        className="bg-green-600 text-white px-6 py-3 rounded-lg w-44"
      >
        Login
      </button>
    </div>
  )
}
