import React, { useEffect, useState } from 'react'
import { ENV } from '../constants'
import { PushWallet } from '../services/pushWallet/pushWallet'
import config from '../config'
import { MnemonicGrid } from '../components/MnemonicGrid'
import { useNavigate } from 'react-router-dom'
import { useGlobalState } from '../context/GlobalContext'
import { PushSigner } from '../services/pushSigner/pushSigner'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

export default function Signup() {
  const [step, setStep] = useState(1)
  const [registering, setRegistering] = useState(false)
  const [pushWallet, setPushWallet] = useState<PushWallet | null>(null)
  const [attachedWallets, setAttachedWallets] = useState<string[]>([])
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(
    Array(12).fill('')
  )
  const { setShowAuthFlow, primaryWallet, handleLogOut } = useDynamicContext()
  const [signupMethod, setSignupMethod] = useState<string | null>(null)
  const { state, dispatch } = useGlobalState()
  const navigate = useNavigate()

  // Email states
  const [email, setEmail] = useState('')
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/profile')
    }
  }, [state.isAuthenticated, navigate])


  useEffect(() => {
    if (pushWallet?.mnemonic) {
      const words = pushWallet.mnemonic.split(' ')
      setMnemonicWords(words)
    }
  }, [pushWallet])

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEmailSubmitting(true)
    setError('')
    
    try {
      // Redirect to backend auth endpoint with email signup parameters
      window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL}/auth/authorize-email?email=${encodeURIComponent(email)}`;
    } catch (err) {
      setError('Failed to initiate signup')
      setIsEmailSubmitting(false)
    }
  }

  const renderEmailSignup = () => (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">
        Create account with Email
      </h2>
      
      <form onSubmit={handleEmailSignup} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your email"
            required
            disabled={isEmailSubmitting}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={isEmailSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isEmailSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isEmailSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full" />
              Redirecting...
            </div>
          ) : (
            'Continue with Email'
          )}
        </button>
      </form>
    </div>
  )

  const goToNextStep = () => setStep(step + 1)

  const registerPushAccount = async () => {
    if (pushWallet) {
      setRegistering(true)
      try {
        await pushWallet.registerPushAccount()
        dispatch({ type: 'INITIALIZE_WALLET', payload: pushWallet })
        navigate('/')
      } catch (err) {
        alert(err)
      }
      setRegistering(false)
    }
  }

  const handleMnemonicSignup = async () => {
    try {
      const instance = await PushWallet.signUp(config.APP_ENV as ENV)
      setPushWallet(instance)
      setAttachedWallets(Object.keys(instance.walletToEncDerivedKey))
    } catch (err) {
      alert(err)
    }
  }

  const connectWalletToPushAccount = async () => {
    const signer = await PushSigner.initialize(primaryWallet, 'DYNAMIC')
    await pushWallet?.connectWalletWithAccount(signer)
    setAttachedWallets(Object.keys(pushWallet.walletToEncDerivedKey))
  }

  const handleGitHubSignup = () => {
    window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL}/auth/github`
  }

  const renderSignupMethods = () => (
    <div className="space-y-4 text-center">
      <div>
        <button
          onClick={async () => {
            setSignupMethod('mnemonic')
            await handleMnemonicSignup()
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64 mx-10"
        >
          Using Mnemonic
        </button>
      </div>

      <div>
        <button
          onClick={() => setSignupMethod('email')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg w-64 mx-10"
        >
          Using Email
        </button>
      </div>

      <div>
        <button
          onClick={handleGitHubSignup}
          className="bg-green-600 text-white px-6 py-3 rounded-lg w-64 mx-10"
        >
          Signup with GitHub
        </button>
      </div>
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
          {primaryWallet ? (
            <>
              <button
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md"
                onClick={() => {
                  handleLogOut()
                }}
              >
                Disconnect <b>{primaryWallet.address}</b>
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
              // disabled={connecting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64"
              onClick={() => setShowAuthFlow(true)}
            >
              Connect Web3 Account
            </button>
          )}
        </div>
        <button
          disabled={registering}
          onClick={registerPushAccount}
          className={
            registering
              ? 'w-full py-3 bg-grey flex items-center justify-center'
              : 'w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center'
          }
        >
          {!registering ? (
            <span className="flex items-center">
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
            </span>
          ) : (
            'Registering'
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Signup</h1>
      <div className="p-8 w-full max-w-4xl">
        {step === 1 && (
          <>
            {!signupMethod && renderSignupMethods()}
            {signupMethod === 'mnemonic' && renderMnemonicInput()}
            {signupMethod === 'email' && renderEmailSignup()}
          </>
        )}
        {step === 2 && signupMethod === 'mnemonic' && (
          <>
            <div className="space-y-2 text-center">
              {attachedWallets.map((wallet) => (
                <div
                  key={wallet}
                  className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium rounded-full px-4 py-2 border border-blue-300"
                >
                  <span className="font-mono">{wallet}</span>
                </div>
              ))}
            </div>
            {renderWalletConnection()}
          </>
        )}
      </div>
    </div>
  )
}
