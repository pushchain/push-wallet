import { useEffect, useState } from 'react'
import { useConnectWallet } from '@web3-onboard/react'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import './ConnectWallet.css'
import { PushSigner } from '../services/pushSigner/pushSigner'
import Wallet from './PushWallet'

export default function ConnectWallet() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [account, setAccount] = useState<string | null>(null)

  //   useEffect(() => {
  //     if (wallet?.provider) {
  //       const { name, avatar } = wallet?.accounts[0].ens ?? {}
  //       setAccount({
  //         address: wallet.accounts[0].address,
  //         balance: wallet.accounts[0].balance,
  //         ens: { name, avatar: avatar?.url },
  //       })
  //     }
  //   }, [wallet])

  useEffect(() => {
    // If the wallet has a provider than the wallet is connected
    if (wallet?.provider) {
      const pushWalletFn = async () => {
        const [account] = await wallet.provider.request({
          method: 'eth_requestAccounts',
        })
        const client = createWalletClient({
          account: account,
          chain: mainnet,
          transport: custom(wallet.provider),
        })
        const pushSigner = await PushSigner.initialize(client)
        setAccount(pushSigner.account)
      }
      pushWalletFn()
    } else {
      setAccount(null)
    }
  }, [wallet])

  if (wallet?.provider && account) {
    return (
      <div>
        {/* {account.ens?.avatar ? (
          <img src={account.ens?.avatar} alt="ENS Avatar" />
        ) : null} */}
        <div>{account}</div>
        <button
          className="connectionBtn"
          onClick={() => {
            disconnect({ label: wallet.label })
          }}
        >
          Disconnect
        </button>
        <Wallet />
      </div>
    )
  }

  return (
    <div>
      <button disabled={connecting} onClick={() => connect()}>
        Connect
      </button>
    </div>
  )
}
