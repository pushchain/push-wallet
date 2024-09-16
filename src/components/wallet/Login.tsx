import React, { useState } from 'react'
import { WALLET_STATE } from '../../constants'
import { WalletProps } from './types'

export const Login: React.FC<WalletProps> = ({ changeWalletState }) => {
  const [loginMethod, setLoginMethod] = useState<string | null>(null)
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(
    Array(12).fill('')
  )

  const [socialInputs, setSocialInputs] = useState({
    google: '',
    discord: '',
    twitter: '',
  })

  const handleLogin = () => {
    // Implement login logic here
    changeWalletState(WALLET_STATE.INITIALIZED)
  }

  const handleMnemonicChange = (index: number, value: string) => {
    const newMnemonicWords = [...mnemonicWords]
    newMnemonicWords[index] = value
    setMnemonicWords(newMnemonicWords)
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
        className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64"
      >
        Social Login
      </button>
    </div>
  )

  const renderMnemonicInput = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {mnemonicWords.map((word, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-lg font-medium">{`${index + 1}.`}</span>
            <input
              type="text"
              value={word}
              onChange={(e) => handleMnemonicChange(index, e.target.value)}
              placeholder={`Word ${index + 1}`}
              className="border p-2 rounded text-center w-full"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleLogin}
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

  const renderWalletOptions = () => (
    <div className="space-y-4">
      {['Metamask', 'Phantom', 'XVerse', 'WalletConnect'].map((wallet) => (
        <button
          key={wallet}
          onClick={() => handleLogin()}
          className="w-full py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center"
        >
          <div className="w-8 h-8 bg-gray-400 rounded-full mr-2"></div>
          {wallet}
          {wallet === 'Phantom' && (
            <span className="ml-auto text-sm text-gray-500">
              Any Solana Wallet
            </span>
          )}
          {wallet === 'XVerse' && (
            <span className="ml-auto text-sm text-gray-500">
              Any BTC wallet
            </span>
          )}
        </button>
      ))}
      <button
        onClick={handleLogin}
        className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
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

  const renderSocialLogin = () => (
    <div className="space-y-4">
      {['google', 'discord', 'twitter'].map((platform) => (
        <div key={platform} className="flex items-center space-x-2">
          <img
            src={`/api/placeholder/24/24`}
            alt={platform}
            className="w-6 h-6"
          />
          <input
            type="text"
            placeholder={`Add ${platform} handle`}
            value={socialInputs[platform as keyof typeof socialInputs]}
            onChange={(e) =>
              setSocialInputs({ ...socialInputs, [platform]: e.target.value })
            }
            className="flex-grow p-2 border border-gray-300 rounded-md"
          />
        </div>
      ))}
      <button
        onClick={handleLogin}
        className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
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
        {loginMethod === 'wallet' && renderWalletOptions()}
        {loginMethod === 'social' && renderSocialLogin()}
      </div>
    </div>
  )
}
