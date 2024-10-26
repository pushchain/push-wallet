import { useState, useEffect } from 'react'
import { useGlobalState } from '../context/GlobalContext'
import { useNavigate } from 'react-router-dom'
import { PushWallet } from '../services/pushWallet/pushWallet'
import config from '../config'
import { ENV } from '../constants'
import { MnemonicGrid } from '../components/MnemonicGrid'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { PushSigner } from '../services/pushSigner/pushSigner'
import api from '../services/api'

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<string | null>(null)
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(
    Array(12).fill('')
  )
  const { setShowAuthFlow, primaryWallet, handleLogOut } = useDynamicContext()

  const { state, dispatch } = useGlobalState()
  const navigate = useNavigate()

  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/profile')
    }
  }, [state.isAuthenticated, navigate])

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
          const signer = await PushSigner.initialize(primaryWallet, 'DYNAMIC')
          pushWallet = await PushWallet.loginWithWallet(
            signer,
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

  const handleGitHubLogin = () => {
    window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL}/auth/github`
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
        onClick={handleGitHubLogin}
        className="bg-green-600 text-white px-6 py-3 rounded-lg w-64"
      >
        Login with GitHub
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
        {primaryWallet ? (
          <button
            className="border border-blue-600 text-blue-600 px-6 py-1 rounded-md"
            onClick={() => {
              handleLogOut()
            }}
          >
            Disconnect {primaryWallet.address}
          </button>
        ) : (
          <button
            // disabled={connecting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64"
            onClick={() => setShowAuthFlow(true)}
          >
            Connect Web3 Account
          </button>
        )}
      </div>
      <button
        onClick={handleLogin}
        disabled={!primaryWallet}
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
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <div className="p-8 w-full max-w-lg">
        {!loginMethod && renderLoginMethods()}
        {loginMethod === 'mnemonic' && renderMnemonicInput()}
        {loginMethod === 'wallet' && renderWalletConnection()}
      </div>
    </div>
  )
}
