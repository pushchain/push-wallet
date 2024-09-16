import { useState } from 'react'
import { WALLET_STATE } from '../constants'
import { Uninitialized } from '../components/wallet/Uninitialized'
import { Signup } from '../components/wallet/signup'
import { Login } from '../components/wallet/Login'
import { Initialized } from '../components/wallet/Initialized'

export default function Home() {
  const [walletState, setWalletState] = useState<WALLET_STATE>(
    WALLET_STATE.UNINITIALIZED
  )
  const changeWalletState = (walletState: WALLET_STATE) => {
    setWalletState(walletState)
  }

  return (
    <div>
      {walletState === WALLET_STATE.UNINITIALIZED && (
        <Uninitialized changeWalletState={changeWalletState} />
      )}
      {walletState === WALLET_STATE.SIGNUP && (
        <Signup changeWalletState={changeWalletState} />
      )}
      {walletState === WALLET_STATE.LOGIN && (
        <Login changeWalletState={changeWalletState} />
      )}
      {walletState === WALLET_STATE.INITIALIZED && (
        <Initialized changeWalletState={changeWalletState} />
      )}
    </div>
  )
}
