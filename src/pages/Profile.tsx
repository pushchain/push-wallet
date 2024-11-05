// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../context/GlobalContext';
import api from '../services/api'; // Axios instance
import { useNavigate, useLocation } from 'react-router-dom';
import { PushWallet } from '../services/pushWallet/pushWallet'
import secrets from 'secrets.js-grempe';
import { ENV } from '../constants'

export default function Profile() {
  const { state, dispatch } = useGlobalState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [pushWallet, setPushWallet] = useState<PushWallet | null>(null)
  const [attachedWallets, setAttachedWallets] = useState<string[]>([])


  const navigate = useNavigate();
  const location = useLocation();

  // Function to extract state parameter from URL
  const extractStateFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('state');
  };

  const createWalletAndGenerateMnemonic = async (userId: string) => {
    try {
      const instance = await PushWallet.signUp(import.meta.env.VITE_APP_ENV as ENV);
      
      // Convert mnemonic to hex
      const mnemonicHex = Buffer.from(instance.mnemonic).toString('hex');
      
      // Split the mnemonic into 3 shares, requiring 2 for reconstruction
      const shares = secrets.share(mnemonicHex, 3, 2);
      
      // Store share1 in the backend
      await api.post(`/mnemonic-share/${userId}`, 
        { share: shares[0] }
      );

      // Store share2 in user'slocalStorage
      localStorage.setItem('mnemonicShare2', shares[1]);

      // Store share3 to the push-chain network
      await instance.storeMnemonicShareAsEncryptedTx(userId, shares[2], instance.mnemonic)
      
      await instance.registerPushAccount();

      dispatch({ type: 'INITIALIZE_WALLET', payload: instance });
      setPushWallet(instance);
      setAttachedWallets(Object.keys(instance.walletToEncDerivedKey));

      console.log('Wallet created and mnemonic split into shares');
    } catch (err) {
      console.error('Error creating wallet:', err);
      setError('Failed to create wallet. Please try again.');
    }
  };

  const reconstructWallet = async (share1: string, share2: string) => {
    try {
      // Reconstruct the mnemonic
      const mnemonicHex = secrets.combine([share1, share2]);
      const mnemonic = Buffer.from(mnemonicHex, 'hex').toString();
  
      // Recreate the wallet instance
      const instance = await PushWallet.logInWithMnemonic(mnemonic, import.meta.env.VITE_APP_ENV as ENV);
  
      dispatch({ type: 'INITIALIZE_WALLET', payload: instance });
      setPushWallet(instance);
      setAttachedWallets(Object.keys(instance.walletToEncDerivedKey));
  
      console.log('Wallet reconstructed successfully');
    } catch (err) {
      console.error('Error reconstructing wallet:', err);
      setError('Failed to reconstruct wallet. Please try again.');
    }
  };

  // Function to fetch JWT using state parameter
  const fetchJwtUsingState = async (stateParam: string) => {
    try {
      console.log("fetchJwtUsingState called with state:", stateParam);
      const response = await api.get('/auth/jwt', {
        params: { state: stateParam },
      });
      console.log("Received JWT:", response.data);
      const { token } = response.data;
      if (token) {
        // Store the token securely
        dispatch({ type: 'SET_JWT', payload: token });

        // Store token in sessionStorage
        sessionStorage.setItem('jwt', token);
        console.log("JWT stored in sessionStorage");

        // Fetch user profile with the token
        fetchUserProfile(token);
      } else {
        throw new Error('Token not found in response');
      }
    } catch (err) {
      console.error('Error fetching JWT:', err);
      setError('Authentication failed. Please try logging in again.');
      navigate('/login');
    }
  };

  // Function to fetch user profile
  const fetchUserProfile = async (token: string) => {
    try {
      console.log("fetchUserProfile called with token:", token);

      const response = await api.get('/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userId = response.data.id

      dispatch({ type: 'SET_USER', payload: response.data });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });

      // Check if user has a wallet, if not, create one
      if (!state.wallet) {
        // Retrieve share1 from the backend
        const mnemonicShareResponse = await api.get(`/mnemonic-share/${userId}`);
        const share1 = mnemonicShareResponse.data.share;

        // Check if we have mnemonic shares stored
        const share2 = null //localStorage.getItem('mnemonicShare2');

        if (share1 && share2) {
          await reconstructWallet(share1, share2);
        } else {
          // If share2 is missing, try to get share3 from blockchain
          try {
            const share3 = await PushWallet.retrieveMnemonicShareFromTx(
              import.meta.env.VITE_APP_ENV as ENV,
              userId,
            );

            if (share1 && share3) {
              await reconstructWallet(share1, share3);
            } else {
              // If we can't get either share2 or share3, create new wallet
              await createWalletAndGenerateMnemonic(userId);
            }
          } catch (txError) {
            console.error('Error retrieving share3:', txError);
            await createWalletAndGenerateMnemonic(userId);
          }
        }
      }
  
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to fetch user profile. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const stateParam = extractStateFromUrl();

    if (stateParam) {
      // Fetch JWT using the state parameter
      fetchJwtUsingState(stateParam);

      // Optionally, remove the state parameter from the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('state');
      window.history.replaceState({}, document.title, url.pathname);
    } else {
      // Attempt to retrieve token from storage
      const storedToken = sessionStorage.getItem('jwt');
      if (storedToken) {
        dispatch({ type: 'SET_JWT', payload: storedToken });
        fetchUserProfile(storedToken);
      } else {
        // No token found, redirect to login
        navigate('/login');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading Profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <img
        src={state.user.avatarUrl} // Adjust based on your backend's user object
        alt="Avatar"
        className="w-24 h-24 rounded-full mb-4"
      />
      <p className="text-xl mb-2">Username: {state.user.username}</p>
      <p className="text-xl mb-4">Email: {state.user.email}</p>
      <div className="w-full max-w-md bg-white shadow-md rounded px-12 py-8 mb-6">
        <h2 className="text-2xl mb-4">Your Wallet</h2>
        {/* Display wallet details or provide wallet-related actions */}
        {state.wallet ? (
          <div className="break-words">
            <p className="mb-4">
              <strong>Account:</strong> 
              <span className="break-all">{state.wallet.signerAccount.split(':')[2]}</span>
            </p>
            <p>
              <strong>DID:</strong> 
              <span className="break-all">{state.wallet.did}</span>
            </p>
            {/* Add more wallet details as needed */}
          </div>
        ) : (
          <p>No wallet connected.</p>
        )}
      </div>
      <button
        onClick={() => {
          // Implement logout functionality
          sessionStorage.removeItem('jwt');
          dispatch({ type: 'RESET_AUTHENTICATED' });
          dispatch({ type: 'RESET_USER' });
          navigate('/login');
        }}
        className="bg-red-600 text-white px-6 py-3 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
