import { createContext, useContext, ReactNode } from 'react';
import { WalletListType } from './Wallet.types';
import { ActiveStates } from 'src/types/wallet.types';

interface WalletContextType {
    selectedWallet: WalletListType | undefined;
    setSelectedWallet: (wallet: WalletListType) => void;
    showConnectionSuccess: boolean;
    setConnectionSuccess: (show: boolean) => void;
    activeState: ActiveStates;
    setActiveState: (state: ActiveStates) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
    children: ReactNode;
    selectedWallet: WalletListType | undefined;
    setSelectedWallet: (wallet: WalletListType) => void;
    showConnectionSuccess: boolean;
    setConnectionSuccess: (show: boolean) => void;
    activeState: ActiveStates;
    setActiveState: (state: ActiveStates) => void;
}

export const WalletProvider = ({
    children,
    selectedWallet,
    setSelectedWallet,
    showConnectionSuccess,
    setConnectionSuccess,
    activeState,
    setActiveState,
}: WalletProviderProps) => {
    return (
        <WalletContext.Provider
            value={{
                selectedWallet,
                setSelectedWallet,
                showConnectionSuccess,
                setConnectionSuccess,
                activeState,
                setActiveState,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWalletDashboard = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}; 