import { createPublicClient, createWalletClient, http, formatUnits, parseUnits, type Address, setupKzg } from 'viem';
import { useState } from 'react';
import { pushTestnetChain } from '../../utils/chainDetails';
// import { useGlobalState } from 'src/context/GlobalContext';

export const useWalletBalance = () => {
    const [balance, setBalance] = useState<string>('0');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBalance = async (address: string) => {
        try {
            console.log("Called ");

            setIsLoading(true);
            setError(null);
            const publicClient = createPublicClient({
                chain: pushTestnetChain,
                transport: http(),
            });

            const balance = await publicClient.getBalance({
                address: address as Address,
            });

            setBalance(formatUnits(balance, 18));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch balance');
        } finally {
            setIsLoading(false);
        }
    };

    return { balance, isLoading, error, fetchBalance };
};

// export const useSendNativeToken = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [txHash, setTxHash] = useState<string | null>(null);

//     const { state } = useGlobalState();

//     const sendNativeToken = async (
//         fromAddress: string,
//         toAddress: string,
//         amount: string,
//         privateKey: string
//     ) => {
//         try {
//             setIsLoading(true);
//             setError(null);
//             setTxHash(null);

//             const walletClient = createWalletClient({
//                 account: state.externalWallet,
//                 chain: pushTestnetChain,
//                 transport: http(`https://evm.pn1.dev.push.org`),
//             });

//             const publicClient = createPublicClient({
//                 chain: pushTestnetChain,
//                 transport: http(`https://evm.pn1.dev.push.org`),
//             });

//             // Convert amount to wei
//             const amountInWei = parseUnits(amount, 18);



//             setTxHash(hash);

//             // Wait for transaction to be mined
//             const receipt = await publicClient.waitForTransactionReceipt({ hash });
//             return receipt;
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Failed to send transaction');
//             throw err;
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return { isLoading, error, txHash, sendNativeToken };
// }; 