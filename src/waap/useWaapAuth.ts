import { useState, useCallback } from 'react';
import { ChainType } from '../types/wallet.types';
import { switchNetwork } from './waapProvider';

type WaapLoginResult = {
  address: string;
  loginType: 'human' | 'walletconnect' | 'injected' | null;
};

const getWaap = () => (window as any).waap as
  | {
      login: () => Promise<'human' | 'walletconnect' | 'injected' | null>;
      request: (args: { method: string; params?: any }) => Promise<any>;
      logout: () => Promise<void>;
    }
  | undefined;

export const useWaapAuth = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [loginType, setLoginType] = useState<WaapLoginResult['loginType']>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const ensureConnected = useCallback(
    async (opts?: { interactive?: boolean }): Promise<WaapLoginResult | null> => {
      try {
        setLoading(true);
        setError(null);

        const waap = getWaap();
        if (!waap) throw new Error('WaaP not initialized (window.waap missing)');

        let accounts: string[] = await waap.request({ method: 'eth_accounts' });
        let addr = accounts?.[0];

        if (!addr && opts?.interactive) {
          const lt = await waap.login(); // opens WaaP UI
          accounts = await waap.request({ method: 'eth_requestAccounts' });
          addr = accounts?.[0];
          setLoginType(lt);
        }

        if (!addr) return null;

        switchNetwork(ChainType.PUSH_WALLET);

        setAddress(addr);
        return { address: addr, loginType };
      } catch (e: any) {
        console.error('[WaaP] ensureConnected failed', e);
        setError(e);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [loginType]
  );

  const loginWithWaapSocial = useCallback(async (): Promise<WaapLoginResult | null> => {
    return ensureConnected({ interactive: true });
  }, [ensureConnected]);

  const logoutWaap = useCallback(async () => {
    try {
      const waap = getWaap();
      if (waap) {
        await waap.logout();
      }
    } finally {
      setAddress(null);
      setLoginType(null);
    }
  }, []);

  const tryAutoConnect = useCallback(async () => {
    const res = await ensureConnected({ interactive: false });
    return res;
  }, [ensureConnected]);

  return {
    address,
    loginType,
    loading,
    error,
    loginWithWaapSocial,
    logoutWaap,
    tryAutoConnect,
  };
};
