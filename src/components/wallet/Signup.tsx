import React, { useEffect, useState } from 'react'
import { ENV, WALLET_STATE } from '../../constants'
import { WalletProps } from './types'
import { PushWallet } from '../../services/pushWallet/pushWallet'
import config from '../../config'
import { useConnectWallet } from '@web3-onboard/react'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

export const Signup: React.FC<WalletProps> = ({ changeWalletState }) => {
  const [step, setStep] = useState(1)
  const [pushWallet, setPushWallet] = useState<PushWallet | null>(null)
  const [mnemonicWords, setMnemonicWords] = useState<string[]>([])
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

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
        pushWallet?.connectWalletWithAccount(client)
      }
      pushWalletFn()
    }
  }, [wallet])

  useEffect(() => {
    const signUp = async () => {
      const pushWallet = await PushWallet.signUp()
      setPushWallet(pushWallet)
    }
    signUp()
  }, [])

  useEffect(() => {
    if (pushWallet?.mnemonic) {
      const words = pushWallet.mnemonic.split(' ')
      setMnemonicWords(words)
    }
  }, [pushWallet])

  const goToNextStep = () => setStep(step + 1)

  const handleMnemonicChange = (index: number, value: string) => {
    const newMnemonicWords = [...mnemonicWords]
    newMnemonicWords[index] = value
    setMnemonicWords(newMnemonicWords)
  }

  const copyMnemonic = () => {
    const mnemonic = mnemonicWords.join(' ')
    navigator.clipboard
      .writeText(mnemonic)
      .then(() => alert('Copied to clipboard'))
      .catch(() => alert('Failed to copy'))
  }

  const registerWallet = async () => {
    if (pushWallet) {
      try {
        await pushWallet.registerPushAccount(config.APP_ENV as ENV)
        changeWalletState(WALLET_STATE.INITIALIZED)
      } catch (err) {
        alert(err)
      }
    }
  }

  return (
    <div className="flex items-center justify-center p-4">
      {step === 1 && (
        <div className="text-center space-y-6">
          {/* First screen with centered buttons and spacing */}
          <div className="flex flex-col items-center space-y-4">
            {wallet && wallet.provider ? (
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64"
                onClick={() => {
                  disconnect({ label: wallet.label })
                }}
              >
                Disconnect {wallet.accounts[0].address.substring(0, 10)}....
              </button>
            ) : (
              <button
                disabled={connecting}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64"
                onClick={() => connect()}
              >
                Connect Web3 Account
              </button>
            )}
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64"
              onClick={() => console.log('Clicked')}
            >
              Add Socials
            </button>
          </div>
          <button
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg w-64"
            onClick={goToNextStep}
          >
            Skip
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center">
          <h2 className="text-2xl mb-6">Store Seed Phrase Safely</h2>
          {/* Second screen with input fields for seed phrase */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {mnemonicWords.map((word, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-lg font-medium">{`${index + 1}.`}</span>
                <input
                  type="text"
                  value={word}
                  onChange={(e) => handleMnemonicChange(index, e.target.value)}
                  placeholder={`Word ${index + 1}`}
                  className="border p-2 rounded w-full text-center"
                  disabled={true}
                />
              </div>
            ))}
          </div>
          <button
            className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg w-30"
            onClick={copyMnemonic}
          >
            Copy
          </button>

          <p className="mb-6 mt-20 text-gray-600">
            Your wallet needs to be registered on the Push network to be able to
            send transactions on the network.
          </p>

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg w-40"
            onClick={registerWallet}
          >
            Register
          </button>
        </div>
      )}
    </div>
  )
}
