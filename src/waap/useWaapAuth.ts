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

  const loginWithWaapSocial = useCallback(async (): Promise<WaapLoginResult | null> => {
    try {
      setLoading(true);
      setError(null);

      const waap = getWaap();
      if (!waap) {
        throw new Error('WaaP not initialized (window.waap missing)');
      }

      // 1. Open WaaP login modal (this includes Google/social options)
      const lt = await waap.login();

      const accounts: string[] = await waap.request({ method: 'eth_requestAccounts' });
      const addr = accounts?.[0];
      if (!addr) throw new Error('No account returned from WaaP');

      switchNetwork(ChainType.PUSH_WALLET);

      setAddress(addr);
      setLoginType(lt);

      return { address: addr, loginType: lt };
    } catch (e: any) {
      console.error('[WaaP] login failed', e);
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

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
    try {
      const waap = getWaap();
      if (!waap) return;
      const accounts: string[] = await waap.request({ method: 'eth_requestAccounts' });
      const addr = accounts?.[0];
      if (addr) setAddress(addr);
    } catch (e) {
      console.warn('[WaaP] auto-connect failed', e);
    }
  }, []);

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
