import { useEffect, useState } from 'react'
import { useConnectWallet } from '@web3-onboard/react'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { PushWallet } from '../services/pushWallet/pushWallet'
import { ENV } from '../constants'
import './ConnectWallet.css'
import { bytesToHex } from '@noble/hashes/utils'
import './PushWallet.css'

export default function Wallet() {
  const [{ wallet }] = useConnectWallet()
  const [pushWallet, setPushWallet] = useState<PushWallet | null>(null)
  const [data, setData] = useState('')
  const [signedData, setSignedData] = useState<string | null>(null)

  useEffect(() => {
    setPushWallet(null)
  }, [wallet])

  const initializePushWallet = async () => {
    if (wallet?.provider) {
      const [account] = await wallet.provider.request({
        method: 'eth_requestAccounts',
      })
      const client = createWalletClient({
        account: account,
        chain: mainnet,
        transport: custom(wallet.provider),
      })
      const walletInstance = await PushWallet.initialize(client, {
        env: ENV.DEV,
      })
      setPushWallet(walletInstance)
      console.log(walletInstance)
    } else {
      setPushWallet(null)
    }
  }

  const handleSign = () => {
    if (pushWallet && data) {
      const signed = pushWallet.sign(data)
      setSignedData(bytesToHex(signed))
    }
  }

  return (
    <div className="connect-wallet">
      {!pushWallet ? (
        <button onClick={initializePushWallet} className="initialize-button">
          Initialize Push Wallet
        </button>
      ) : (
        <>
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Enter data to sign"
            className="data-input"
          />
          <button onClick={handleSign} className="sign-button">
            Sign Data
          </button>
          {signedData && (
            <div className="signed-data">
              <h3>Signed Data:</h3>
              <p>{signedData}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
