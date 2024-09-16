import React, { useState } from 'react'
import { WALLET_STATE } from '../../constants'
import { WalletProps } from './types'
import { PushWallet } from '../../services/pushWallet/pushWallet'

export const Signup: React.FC<WalletProps> = ({ changeWalletState }) => {
  const [step, setStep] = useState(1)

  const goToNextStep = () => setStep(step + 1)

  const signUp = async () => {
    const pushWallet = await PushWallet.signUp()
  }

  return (
    <div className="flex items-center justify-center">
      {step === 1 && (
        <div className="text-center space-y-6">
          {/* First screen with centered buttons and spacing */}
          <div className="flex flex-col items-center space-y-4">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64"
              onClick={() => console.log('Clicked')}
            >
              Connect Web3 Account
            </button>
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

          {/* Second screen with 4 rows and 3 columns for seed phrase input */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Array(12)
              .fill('')
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Word ${index + 1}`}
                  className="border p-2 rounded w-full text-center"
                />
              ))}
          </div>

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64"
            onClick={() => changeWalletState(WALLET_STATE.INITIALIZED)}
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}
