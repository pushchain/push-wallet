import React, { useState } from 'react'
import { useGlobalState } from '../context/GlobalContext'
import { useNavigate } from 'react-router-dom'
import { PushWallet } from '../services/pushWallet/pushWallet'
import config from '../config'
import { ENV } from '../constants'
import { useConnectWallet } from '@web3-onboard/react'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { MnemonicGrid } from '../components/MnemonicGrid'

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<string | null>(null)
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(
    Array(12).fill('')
  )
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  const { dispatch } = useGlobalState()
  const navigate = useNavigate()

  const handleMnemonicChange = (index: number, value: string) => {
    const newMnemonicWords = [...mnemonicWords]
    newMnemonicWords[index] = value
    setMnemonicWords(newMnemonicWords)
  }

  const handleLogin = async () => {
    try {
      let pushWallet: PushWallet
      switch (loginMethod) {
        case 'mnemonic': {
          pushWallet = await PushWallet.logInWithMnemonic(
            mnemonicWords.join(' '),
            config.APP_ENV as ENV
          )
          break
        }
        case 'wallet': {
          const [account] = await wallet.provider.request({
            method: 'eth_requestAccounts',
          })
          const client = createWalletClient({
            account: account,
            chain: mainnet,
            transport: custom(wallet.provider),
          })
          pushWallet = await PushWallet.loginWithWallet(
            client,
            config.APP_ENV as ENV
          )
          break
        }
      }
      dispatch({ type: 'INITIALIZE_WALLET', payload: pushWallet })
      navigate('/')
    } catch (err) {
      alert(err)
    }
  }

  const renderLoginMethods = () => (
    <div className="space-y-4 text-center">
      <button
        onClick={() => setLoginMethod('mnemonic')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64"
      >
        Using Mnemonic
      </button>
      <button
        onClick={() => setLoginMethod('wallet')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64"
      >
        Using Web3 Account
      </button>
      <button
        onClick={() => setLoginMethod('social')}
        className="border border-blue-600 text-blue-600 px-6 py-1 rounded-lg w-64"
        disabled={true}
      >
        Social Login <br /> Coming Soon 🚀
      </button>
    </div>
  )

  const renderMnemonicInput = () => (
    <div className="space-y-4">
      <MnemonicGrid
        words={mnemonicWords}
        disabled={false}
        handleMnemonicChange={handleMnemonicChange}
      />
      <button
        onClick={handleLogin}
        disabled={mnemonicWords.some((word) => word === '')}
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
        Unlock Push Account
      </button>
    </div>
  )

  const renderWalletConnection = () => (
    <div className="text-center space-y-6">
      <div className="flex flex-col items-center space-y-4">
        {wallet && wallet.provider ? (
          <button
            className="border border-blue-600 text-blue-600 px-6 py-1 rounded-md"
            onClick={() => {
              disconnect({ label: wallet.label })
            }}
          >
            Disconnect {wallet.accounts[0].address}
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
      </div>
      <button
        onClick={handleLogin}
        disabled={!wallet || !wallet.provider}
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
        Unlock Push Account
      </button>
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-8 w-full max-w-lg">
        {!loginMethod && renderLoginMethods()}
        {loginMethod === 'mnemonic' && renderMnemonicInput()}
        {loginMethod === 'wallet' && renderWalletConnection()}
      </div>
    </div>
  )
}
