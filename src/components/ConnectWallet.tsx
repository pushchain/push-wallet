import { useEffect, useState } from 'react'
import { useConnectWallet } from '@web3-onboard/react'
import type { TokenSymbol } from '@web3-onboard/common'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { PushWallet } from '../services/pushWallet/pushWallet'
import { ENV } from '../constants'

interface Account {
  address: string
  balance: Record<TokenSymbol, string> | null
  ens: { name: string | undefined; avatar: string | undefined }
}

export default function ConnectWallet() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [account, setAccount] = useState<Account | null>(null)

  useEffect(() => {
    if (wallet?.provider) {
      const { name, avatar } = wallet?.accounts[0].ens ?? {}
      setAccount({
        address: wallet.accounts[0].address,
        balance: wallet.accounts[0].balance,
        ens: { name, avatar: avatar?.url },
      })
    }
  }, [wallet])

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
        const pushWallet = await PushWallet.initialize(client, { env: ENV.DEV })
        console.log(pushWallet)
      }
      pushWalletFn()
    }
  }, [wallet])

  if (wallet?.provider && account) {
    return (
      <div>
        {account.ens?.avatar ? (
          <img src={account.ens?.avatar} alt="ENS Avatar" />
        ) : null}
        <div>{account.ens?.name ? account.ens.name : account.address}</div>
        <button
          onClick={() => {
            disconnect({ label: wallet.label })
          }}
        >
          Disconnect
        </button>
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
