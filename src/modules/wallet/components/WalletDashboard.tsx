import React, { FC } from 'react';
import { Info } from 'blocks';
import { DrawerWrapper, ErrorContent, getAppParamValue, LoadingContent, PushWalletAppConnection } from 'common';
import { WalletProfile } from './WalletProfile';
import { WalletTabs } from './WalletTabs';
import { getWalletlist } from '../Wallet.utils';
import { ConnectionSuccess } from '../../../common/components/ConnectionSuccess';
import { useGlobalState } from '../../../context/GlobalContext';
import { useWalletDashboard } from '../../../context/WalletDashboardContext';

const WalletDashboard: FC = () => {
    const { state, dispatch } = useGlobalState();
    const {
        selectedWallet,
        setSelectedWallet,
        showConnectionSuccess,
        setConnectionSuccess,
        setActiveState
    } = useWalletDashboard();

    return (
        <>
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
                        icon={<Info size={32} color="pw-int-icon-danger-subtle-color" />}
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