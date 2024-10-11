import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalState } from '../context/GlobalContext'

export const InitializedWallet: React.FC = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useGlobalState()

  const [activeWallet] = useState(
    Object.keys(state.wallet.walletToEncDerivedKey)[0]
  )

  const [isAppConnectionsModalOpen, setIsAppConnectionsModalOpen] =
    useState(false)
  const [isConnectedAccountsModalOpen, setIsConnectedAccountsModalOpen] =
    useState(false)

  const openAppConnectionsModal = () => setIsAppConnectionsModalOpen(true)
  const closeAppConnectionsModal = () => setIsAppConnectionsModalOpen(false)

  const openConnectedAccountsModal = () => setIsConnectedAccountsModalOpen(true)
  const closeConnectedAccountsModal = () =>
    setIsConnectedAccountsModalOpen(false)

  const handleAccept = (origin: string) => {
    state.wallet.acceptConnectionReq(origin)
    dispatch({ type: 'INITIALIZE_WALLET', payload: state.wallet })
  }

  const handleReject = (origin: string) => {
    state.wallet.rejectConnectionReq(origin)
    dispatch({ type: 'INITIALIZE_WALLET', payload: state.wallet })
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-8 w-full">
        <input
          type="text"
          placeholder="Push Wallet Address"
          value={activeWallet}
          disabled={true}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
        />

        <button
          onClick={openConnectedAccountsModal}
          className="w-full py-3 mb-4 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          View Connected Accounts
        </button>

        <button
          onClick={openAppConnectionsModal}
          className="w-full py-3 mb-4 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          View App Connections
        </button>

        <button
          onClick={() => navigate('login')}
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

      {/* App Connections Modal */}
      {isAppConnectionsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
            <button
              onClick={closeAppConnectionsModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">App Connections</h2>
            <ul>
              {state.wallet.appConnections.map((connection) => (
                <li key={connection.origin} className="mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{connection.origin}</span>
                    </div>
                    <div className="space-x-2">
                      {connection.isPending ? (
                        <>
                          <button
                            onClick={() => handleAccept(connection.origin)}
                            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(connection.origin)}
                            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleReject(connection.origin)}
                          className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Connected Accounts Modal */}
      {isConnectedAccountsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-6xl relative">
            <button
              onClick={closeConnectedAccountsModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Connected Accounts</h2>
            <ul>
              {Object.keys(state.wallet.walletToEncDerivedKey).map(
                (account) =>
                  account !== activeWallet && (
                    <li key={account} className="mb-4">
                      <div className="flex items-center">
                        {/* <div className="w-3/4 break-words"> */}

                        <div className="break-words">
                          <span className="font-medium">{account}</span>
                        </div>
                        {/* <div className="w-1/4 text-right">
                          <button
                            onClick={() => handleSwitchWallet(account)}
                            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                          >
                            Switch as Active Wallet
                          </button>
                        </div> */}
                      </div>
                    </li>
                  )
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
