import { createContext, useContext, ReactNode } from 'react';
import { ActiveStates, WalletListType } from '../types';

interface WalletDashboardContextType {
    selectedWallet: WalletListType | undefined;
    setSelectedWallet: (wallet: WalletListType) => void;
    showConnectionSuccess: boolean;
    setConnectionSuccess: (show: boolean) => void;
    activeState: ActiveStates;
    setActiveState: (state: ActiveStates) => void;
}

const WalletDashboardContext = createContext<WalletDashboardContextType | undefined>(undefined);

interface WalletProviderProps {
    children: ReactNode;
    selectedWallet: WalletListType | undefined;
    setSelectedWallet: (wallet: WalletListType) => void;
    showConnectionSuccess: boolean;
    setConnectionSuccess: (show: boolean) => void;
    activeState: ActiveStates;
    setActiveState: (state: ActiveStates) => void;
}

export const WalletDashboardProvider = ({
    children,
    selectedWallet,
    setSelectedWallet,
    showConnectionSuccess,
    setConnectionSuccess,
    activeState,
    setActiveState,
}: WalletProviderProps) => {
    return (
        <WalletDashboardContext.Provider
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
        </WalletDashboardContext.Provider>
    );
};

export const useWalletDashboard = () => {
    const context = useContext(WalletDashboardContext);
    if (context === undefined) {
        throw new Error('useWalletDashboard must be used within a WalletProvider');
    }
    return context;
}; 