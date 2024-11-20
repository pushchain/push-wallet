// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../context/GlobalContext';
import api from '../services/api'; // Axios instance
import { useNavigate, useLocation } from 'react-router-dom';
import { PushWallet } from '../services/pushWallet/pushWallet'
import secrets from 'secrets.js-grempe';
import { ENV } from '../constants'
import { WalletProfile } from '../modules/wallet/components/WalletProfile';
import { WalletTabs } from '../modules/wallet/components/WalletTabs';
import { Box, Spinner } from '../blocks';
import { BoxLayout, ContentLayout } from '../common';

export const Profile = () => {
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
      setLoading(true);
      const instance = await PushWallet.signUp(import.meta.env.VITE_APP_ENV as ENV);

      const mnemonicHex = Buffer.from(instance.mnemonic).toString('hex');
      const shares = secrets.share(mnemonicHex, 3, 2);

      await api.post(`/mnemonic-share/${userId}`, { share: shares[0] });
      localStorage.setItem(`mnemonicShare2:${userId}`, shares[1]);
      await instance.storeMnemonicShareAsEncryptedTx(userId, shares[2], instance.mnemonic);
      await instance.registerPushAccount();

      dispatch({ type: 'INITIALIZE_WALLET', payload: instance });
      setPushWallet(instance);
      setAttachedWallets(Object.keys(instance.walletToEncDerivedKey));

      console.info('Wallet created and mnemonic split into shares', { userId });
    } catch (err) {
      console.error('Error creating wallet:', err);
      setError('Failed to create wallet. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reconstructWallet = async (share1: string, share2: string) => {
    try {
      setLoading(true);
      const mnemonicHex = secrets.combine([share1, share2]);
      const mnemonic = Buffer.from(mnemonicHex, 'hex').toString();
      const instance = await PushWallet.logInWithMnemonic(mnemonic, import.meta.env.VITE_APP_ENV as ENV);

      dispatch({ type: 'INITIALIZE_WALLET', payload: instance });
      setPushWallet(instance);
      setAttachedWallets(Object.keys(instance.walletToEncDerivedKey));

      console.info('Wallet reconstructed successfully');
    } catch (err) {
      console.error('Error reconstructing wallet:', err);
      setError('Failed to reconstruct wallet. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchJwtUsingState = async (stateParam: string) => {
    try {
      setLoading(true);
      console.log("fetchJwtUsingState called with state:", stateParam);

      const response = await api.get('/auth/jwt', {
        params: { state: stateParam },
      });

      const { token } = response.data;
      if (!token) throw new Error('Token not found in response');

      dispatch({ type: 'SET_JWT', payload: token });
      sessionStorage.setItem('jwt', token);

      await fetchUserProfile(token);
    } catch (err) {
      console.error('Error fetching JWT:', err);
      setError('Authentication failed. Please try logging in again.');
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (token: string) => {
    try {
      setLoading(true);
      const response = await api.get('/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = response.data.id;
      dispatch({ type: 'SET_USER', payload: response.data });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });

      if (!state.wallet) {
        try {
          let share1, share2, share3;

          // Try share1 + share2 combination first
          try {
            const mnemonicShareResponse = await api.get(`/mnemonic-share/${userId}`);
            share1 = mnemonicShareResponse.data.share;
            share2 = localStorage.getItem(`mnemonicShare2:${userId}`);

            if (share1 && share2) {
              console.info('Reconstructing wallet with share1 and share2', { userId });
              await reconstructWallet(share1, share2);
              return;
            }
          } catch (error) {
            console.debug('Share1 not available', { userId, error: (error as Error).message });
          }

          // Try combinations with share3 if needed
          if (!share1 || !share2) {
            try {
              share3 = await PushWallet.retrieveMnemonicShareFromTx(
                import.meta.env.VITE_APP_ENV as ENV,
                userId,
              );

              if (share1 && share3) {
                console.info('Reconstructing wallet with share1 and share3', { userId });
                await reconstructWallet(share1, share3);
                return;
              }

              if (share2 && share3) {
                console.info('Reconstructing wallet with share2 and share3', { userId });
                await reconstructWallet(share2, share3);
                return;
              }
            } catch (error) {
              console.debug('Share3 not available', { userId, error: (error as Error).message });
            }
          }

          const hasAnyShare = share1 || share2 || share3;
          if (hasAnyShare) {
            const shouldCreate = window.confirm(
              'Unable to reconstruct your existing wallet. Would you like to create a new one? ' +
              'Warning: This will make your old wallet inaccessible.'
            );
            if (!shouldCreate) {
              setError('Wallet reconstruction failed. Please try again later.');
              return;
            }
          }

          console.info('Creating new wallet', {
            userId,
            availableShares: {
              share1: !!share1,
              share2: !!share2,
              share3: !!share3
            }
          });

          await createWalletAndGenerateMnemonic(userId);

        } catch (error) {
          console.error('Error during wallet reconstruction/creation', {
            userId,
            error: (error as Error).message
          });
          throw error;
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to fetch user profile. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setLoading(true);
        const stateParam = extractStateFromUrl();

        if (stateParam) {
          await fetchJwtUsingState(stateParam);

          // Clean up URL
          const url = new URL(window.location.href);
          url.searchParams.delete('state');
          window.history.replaceState({}, document.title, url.pathname);
        } else {
          const storedToken = sessionStorage.getItem('jwt');
          if (storedToken) {
            dispatch({ type: 'SET_JWT', payload: storedToken });
            await fetchUserProfile(storedToken);
          } else {
            navigate('/auth');
          }
        }
      } catch (err) {
        console.error('Error initializing profile:', err);
        setError('Failed to initialize profile');
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
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
          <>
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

          </>
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
          navigate('/auth');
        }}
        className="bg-red-600 text-white px-6 py-3 rounded-lg"
      >
        Logout
      </button>


      {state.wallet && (
        <ContentLayout>
          <BoxLayout>
            {loading ? (
              <Spinner variant='primary' size='large' />
            ) : (
              <Box
                flexDirection="column"
                display="flex"
                width="376px"
                padding="spacing-md"
                gap="spacing-sm"
              >
                <WalletProfile />
                <WalletTabs />
              </Box>
            )}
          </BoxLayout>
        </ContentLayout>
      )}
    </div>
  );
}
