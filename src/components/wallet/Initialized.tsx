import React from 'react'
import { WALLET_STATE } from '../../constants'
import { WalletProps } from './types'

export const Initialized: React.FC<WalletProps> = ({ changeWalletState }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-8 w-full max-w-md">
        <input
          type="text"
          placeholder="Push Wallet Address"
          value={''}
          disabled={true}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() => console.log('View Connected Accounts')}
          className="w-full py-3 mb-4 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          View Connected Accounts
        </button>

        <button
          onClick={() => console.log('View Connected Apps')}
          className="w-full py-3 mb-4 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          View App Connections
        </button>

        <button
          onClick={() => changeWalletState(WALLET_STATE.LOGIN)}
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Lock Push Account
        </button>
      </div>
    </div>
  )
}
