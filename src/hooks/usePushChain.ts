import { useEffect, useState } from 'react';
import { PushChain } from '@pushchain/core';
import { useExternalWallet } from '../context/ExternalWalletContext';
import { useGlobalState } from '../context/GlobalContext';
import { PUSH_NETWORK } from '@pushchain/core/src/lib/constants/enums';
import { getWalletlist } from '../modules/wallet/Wallet.utils';

export const usePushChain = () => {
    const { state } = useGlobalState();

    const [pushChain, setPushChain] = useState<PushChain | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [executorAddress, setExecutorAddress] = useState(null);

    // getting push wallet (if created by social login)
    const pushWallet = getWalletlist(state.wallet)[0];

    const parsedWallet = pushWallet?.fullAddress || state?.externalWallet?.originAddress;

    const {
        signMessageRequest,
        signTransactionRequest,
        signTypedDataRequest,
    } = useExternalWallet();

    // initialise Push Chain instance here and export that
    useEffect(() => {
        const initializePushChain = async () => {
            if (!parsedWallet) {
                setPushChain(null);
                return;
            }

            try {
                const universalAccount = PushChain.utils.account.fromChainAgnostic(
                    parsedWallet
                );

                const CHAINS = PushChain.CONSTANTS.CHAIN;

                const isSolana = [
                    CHAINS.SOLANA_DEVNET,
                    CHAINS.SOLANA_MAINNET,
                    CHAINS.SOLANA_TESTNET,
                ].includes(universalAccount.chain);

                const signerSkeleton = PushChain.utils.signer.construct(
                    universalAccount,
                    {
                        signMessage: state.wallet ? state.wallet.signMessage : signMessageRequest,
                        signAndSendTransaction: state.wallet ? state.wallet.signAndSendTransaction : signTransactionRequest,
                        signTypedData: isSolana ? undefined : state.wallet ? state.wallet.signTypedData : signTypedDataRequest,
                    }
                );

                const universalSigner = await PushChain.utils.signer.toUniversal(
                    signerSkeleton
                );


                const pushChainClient = await PushChain.initialize(universalSigner, {
                    network: PUSH_NETWORK.TESTNET_DONUT,
                    progressHook: async (progress: any) => {
                        console.log("Progress hook", progress);
                    },
                });

                const executorAddress = pushChainClient.universal.account;
                setExecutorAddress(executorAddress);
                setPushChain(pushChainClient)

            } catch (err) {
                console.log('Error occured when initialising Push chain', err);
                setError(
                    err instanceof Error
                        ? err
                        : new Error('Failed to initialize PushChain')
                );
                setPushChain(null);
            }
        };

        initializePushChain();
    }, [parsedWallet]);

    return {
        executorAddress: executorAddress,
        pushChainClient: pushChain,
        error,
        isLoading: !pushChain && !error,
    };
};
