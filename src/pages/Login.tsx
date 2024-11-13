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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faGoogle, faDiscord, faTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<string | null>(null)
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(
    Array(12).fill('')
  )
  const { setShowAuthFlow, primaryWallet, handleLogOut } = useDynamicContext()
  const [email, setEmail] = useState(''); 
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

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

  // const handleGitHubLogin = () => {
  //   window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL}/auth/github`
  // }

  const handleSocialLogin = (provider: 'github' | 'google' | 'discord' | 'twitter') => {
    window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL}/auth/authorize-social?provider=${provider}`;
  };

  const renderSocialLogins = () => (
    <div className="flex space-x-3">
      <button
        onClick={() => handleSocialLogin('github')}
        className="flex items-center justify-center text-gray-800 p-2">
        <FontAwesomeIcon icon={faGithub} size="2x" />
      </button>
      <button
        onClick={() => handleSocialLogin('google')}
        className="flex items-center justify-center text-gray-800 p-2">
        <FontAwesomeIcon icon={faGoogle} size="2x" />
      </button>
      <button
        onClick={() => handleSocialLogin('discord')}
        className="flex items-center justify-center text-[#5865F2] p-2">
        <FontAwesomeIcon icon={faDiscord} size="2x" />
      </button>
      <button
        onClick={() => handleSocialLogin('twitter')}
        className="flex items-center justify-center text-[#1DA1F2] p-2">
        <FontAwesomeIcon icon={faTwitter} size="2x" />
      </button>
    </div>
  );

  const renderEmailLogin = () => {
    const handleEmailLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (email) {
        window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL}/auth/authorize-email?email=${encodeURIComponent(email)}`;
      }
    };
  
    return (
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Continue with Email
        </button>
      </form>
    );
  };

  const renderPhoneLogin = () => {
    const handlePhoneSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Basic phone validation
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phone)) {
        setError('Please enter a valid phone number in international format (e.g., +1234567890)');
        return;
      }

      window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL}/auth/authorize-phone?phone=${encodeURIComponent(phone)}`;
    }

    return (
      <form onSubmit={handlePhoneSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Continue with Phone
        </button>
      </form>
    );
  };

  const renderLoginMethods = () => (
    <div className="space-y-4 text-center">
      <button
        onClick={() => setLoginMethod('mnemonic')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64 mx-auto"
      >
        Using Mnemonic
      </button>
      <button
        onClick={() => setLoginMethod('wallet')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64 mx-auto"
      >
        Using Web3 Account
      </button>
      <button
        onClick={() => setLoginMethod('email')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64 mx-auto"
      >
        Login with Email
      </button>
      <div className="flex justify-center">
        {renderSocialLogins()}
      </div>
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
        {loginMethod === 'email' && renderEmailLogin()}
        {loginMethod === 'phone' && renderPhoneLogin()}
        {loginMethod === 'mnemonic' && renderMnemonicInput()}
        {loginMethod === 'wallet' && renderWalletConnection()}
      </div>
    </div>
  )
}
