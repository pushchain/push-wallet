import { Button, Info } from 'blocks';
import { DrawerWrapper, ErrorContent, getAppParamValue, LoadingContent, PushWalletAppConnection } from 'common';
import React, { FC } from 'react';
import { WalletProfile } from './WalletProfile';
import { WalletTabs } from './WalletTabs';
import { convertCaipToObject, getWalletlist } from '../Wallet.utils';
import { ConnectionSuccess } from '../../../common/components/ConnectionSuccess';
import { useGlobalState } from '../../../context/GlobalContext';
import { useWalletDashboard } from '../../../context/WalletDashboardContext';
import { useWalletBalance } from '../../../common/hooks/useWalletOperations';
import { walletRegistry } from '../../../providers/WalletProviderRegistry';

const WalletDashboard: FC = () => {
    const { state, dispatch } = useGlobalState();
    const {
        selectedWallet,
        setSelectedWallet,
        showConnectionSuccess,
        setConnectionSuccess,
        setActiveState
    } = useWalletDashboard();

    const { balance, isLoading: isBalanceLoading, error: balanceError, fetchBalance } = useWalletBalance();
    const parsedWallet = selectedWallet?.address || state?.externalWallet?.address;

    const handleFetchBalance = async () => {
        if (!parsedWallet) return;
        const { result } = convertCaipToObject(parsedWallet);
        await fetchBalance(result.address);
    };

    const signMessage = async () => {
        const providerReceived = walletRegistry.getProvider(
            state?.externalWallet?.providerName
        );

        console.log("provider received", providerReceived);
        const txhash = await providerReceived.sendNativeToken('0xe5a730337eaf120a7627ab7a3f083a7b4b865eb0', '1');
        console.log("tx hash", txhash);

    }

    return (
        <>
            <Button onClick={handleFetchBalance} disabled={isBalanceLoading}>
                {isBalanceLoading ? 'Loading...' : 'Get Balance'}
            </Button>
            <Button onClick={signMessage} >
                Sign Message
            </Button>
            {balance && <div>Balance: {balance} PUSH</div>}
            {balanceError && <div>Error: {balanceError}</div>}
            <PushWalletAppConnection selectedWallet={selectedWallet} />
            <WalletProfile selectedWallet={selectedWallet} />
            <WalletTabs
                walletList={getWalletlist(
                    state.wallet
                )}
                selectedWallet={selectedWallet}
                setSelectedWallet={setSelectedWallet}
                setActiveState={setActiveState}
            />
            {/* {!state?.wallet && primaryWallet && (
            <CreateAccount
              isLoading={createAccountLoading}
              setIsLoading={setCreateAccountLoading}
            />
          )} */}
            {state.messageSignState === "loading" && (
                <DrawerWrapper>
                    <LoadingContent
                        title={"Processing Transaction"}
                        subTitle={"Your transaction is being verified"}
                    />
                </DrawerWrapper>
            )}

            {state.messageSignState === "rejected" && (
                <DrawerWrapper>
                    <ErrorContent
                        icon={<Info size={32} color="icon-state-danger-subtle" />}
                        title="Could not verify"
                        subTitle="Please try again"
                        onClose={() =>
                            dispatch({ type: "SET_MESSAGE_SIGN_STATE", payload: "idle" })
                        }
                    />
                </DrawerWrapper>
            )}
            {showConnectionSuccess && getAppParamValue() && (
                <DrawerWrapper>
                    <ConnectionSuccess
                        onClose={() => {
                            setConnectionSuccess(false);
                        }}
                    />
                </DrawerWrapper>
            )}
        </>
    );
};

export default WalletDashboard;