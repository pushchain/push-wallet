import { PushChain } from "@pushchain/core";
import { UniversalSigner } from "@pushchain/core/src/lib/universal/universal.types";
import { ExternalWalletType } from "../types/wallet.types";

export function createGuardedPushChain(
  baseClient: PushChain,
	handleReconnectExternalWallet: (walletData: ExternalWalletType) => Promise<void>,
	handleReconnectWallet: () => void,
	universalSigner: UniversalSigner,
	intializeProps: any,
	callback?: () => void,
): PushChain {
  const clientRef: { current: PushChain } = { current: baseClient };

  let promoting: Promise<void> | null = null;

  const promoteIfNeeded = async () => {
    if (!clientRef.current.isReadMode) return;

    if (!promoting) {
      promoting = (async () => {
        const walletInfo = localStorage.getItem("walletInfo");
        const walletData = walletInfo ? JSON.parse(walletInfo) : null;

				if (!walletData) {
					return;
				}

				if (walletData.providerName) {
					await handleReconnectExternalWallet(walletData);
				} else {
					await handleReconnectWallet();
				}

				const pushChainClient = await clientRef.current.reinitialize(universalSigner, intializeProps);

				callback?.();

				clientRef.current = pushChainClient;
				
      })().finally(() => {
        promoting = null;
      });
    }
    await promoting;
  };

  const wrapWrite = <A extends unknown[], R>(
    getter: () => (...args: A) => Promise<R>
	) => {
	const wrapped = async (...args: A): Promise<R> => {
		await promoteIfNeeded();
		const fn = getter();
		return fn(...args);
	};
		return wrapped;
	};

  const universalProxy = new Proxy({} as PushChain["universal"], {
    get(_t, p, _r) {
      const u = clientRef.current.universal;
      if (p === "sendTransaction") {
        return wrapWrite(() => clientRef.current.universal.sendTransaction);
      }
      if (p === "signMessage") {
        return wrapWrite(() => clientRef.current.universal.signMessage);
      }
      if (p === "signTypedData") {
        return wrapWrite(() => clientRef.current.universal.signTypedData);
      }
      return u[p];
    },
  });

  const clientProxy = new Proxy(baseClient, {
    get(_target, prop, _receiver) {
      if (prop === "universal") return universalProxy;
      return clientRef.current[prop];
    },
  });

  return clientProxy;
}
