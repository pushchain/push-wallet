import React, { useEffect, useState } from 'react'
import { ENV } from '../constants'
import { PushWallet } from '../services/pushWallet/pushWallet'
import config from '../config'
import { useConnectWallet } from '@web3-onboard/react'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { MnemonicGrid } from '../components/MnemonicGrid'
import { useNavigate } from 'react-router-dom'
import { useGlobalState } from '../context/GlobalContext'

export default function Signup() {
  const [step, setStep] = useState(1)
  const [pushWallet, setPushWallet] = useState<PushWallet | null>(null)
  const [attachedWallets, setAttachedWallets] = useState<string[]>([])
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(
    Array(12).fill('')
  )
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [signupMethod, setSignupMethod] = useState<string | null>(null)
  const { dispatch } = useGlobalState()
  const navigate = useNavigate()

  useEffect(() => {
    if (pushWallet?.mnemonic) {
      const words = pushWallet.mnemonic.split(' ')
      setMnemonicWords(words)
    }
  }, [pushWallet])

  const goToNextStep = () => setStep(step + 1)

  const registerPushAccount = async () => {
    if (pushWallet) {
      try {
        // TODO: Uncomment This
        // await pushWallet.registerPushAccount(config.APP_ENV as ENV)
        dispatch({ type: 'INITIALIZE_WALLET', payload: pushWallet })
        navigate('/')
      } catch (err) {
        alert(err)
      }
    }
  }

  const handleMnemonicSignup = async () => {
    try {
      const instance = await PushWallet.signUp()
      setPushWallet(instance)
      setAttachedWallets(Object.keys(instance.walletToEncDerivedKey))
    } catch (err) {
      alert(err)
    }
  }

  const connectWalletToPushAccount = async () => {
    const [account] = await wallet.provider.request({
      method: 'eth_requestAccounts',
    })
    const client = createWalletClient({
      account: account,
      chain: mainnet,
      transport: custom(wallet.provider),
    })
    await pushWallet?.connectWalletWithAccount(client)
    setAttachedWallets(Object.keys(pushWallet.walletToEncDerivedKey))
  }

  const renderSignupMethods = () => (
    <div className="space-y-4 text-center">
      <button
        onClick={async () => {
          setSignupMethod('mnemonic')
          await handleMnemonicSignup()
        }}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64 mx-10"
      >
        Using Mnemonic
      </button>
      <button
        onClick={() => setSignupMethod('social')}
        className="border border-blue-600 text-blue-600 px-6 py-1 rounded-lg w-64"
        disabled={true}
      >
        Social Signup <br /> Coming Soon 🚀
      </button>
    </div>
  )

  const renderMnemonicInput = () => {
    const copyMnemonic = () => {
      const mnemonic = mnemonicWords.join(' ')
      navigator.clipboard
        .writeText(mnemonic)
        .then(() => alert('Copied to clipboard'))
        .catch(() => alert('Failed to copy'))
    }

    return (
      <div className="text-center">
        <h2 className="text-2xl mb-6">Store Seed Phrase Safely</h2>
        <MnemonicGrid words={mnemonicWords} disabled={true} />
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
          onClick={goToNextStep}
        >
          Next
        </button>
      </div>
    )
  }

  const renderWalletConnection = () => {
    return (
      <div className="text-center space-y-6 mt-6">
        <div className="flex flex-col items-center space-y-4">
          {wallet && wallet.provider ? (
            <>
              <button
                className="border border-blue-600 text-blue-600 px-6 py-1 rounded-md"
                onClick={() => {
                  disconnect({ label: wallet.label })
                }}
              >
                Disconnect {wallet.accounts[0].address}
              </button>
              <button
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                onClick={connectWalletToPushAccount}
              >
                Add to Push Account
              </button>
            </>
          ) : (
            <button
              disabled={connecting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64"
              onClick={() => connect()}
            >
              Connect Web3 Account
            </button>
          )}
        </div>
        <button
          onClick={registerPushAccount}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
          Register Push Account
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-8 w-full max-w-xl">
        {step === 1 && (
          <>
            {!signupMethod && renderSignupMethods()}
            {signupMethod === 'mnemonic' && renderMnemonicInput()}
          </>
        )}
        {step === 2 && (
          <div className="space-y-2 text-center">
            {attachedWallets.map((wallet) => {
              return (
                <div
                  key={wallet}
                  className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium rounded-full px-4 py-2 border border-blue-300"
                >
                  <span className="font-mono">{wallet}</span>
                </div>
              )
            })}
          </div>
        )}
        {step === 2 && renderWalletConnection()}
      </div>
    </div>
  )
}
