import { Box, Text } from 'blocks';
import { BoxLayout } from 'common';
import React, { FC } from 'react';
import ConnectWallet from './ConnectWallet';
import { Login } from './Login';
import styled from 'styled-components';
import { WalletState } from '../Authentication.types';
import { WalletConfig } from '../../../types/wallet.types';

type SplitWalletViewProps = {
    connectMethod: WalletState,
    email: string,
    setEmail: (email: string) => void,
    setConnectMethod: (connectMethod: WalletState) => void,
    walletConfig: WalletConfig
}

const SplitWalletView: FC<SplitWalletViewProps> = ({
    connectMethod,
    email,
    setEmail,
    setConnectMethod,
    walletConfig
}) => {
    return (
        <>
            <Box
                display='flex'
                flexDirection={{ initial: 'row', tb: 'column-reverse' }}
                borderRadius="radius-lg"
                backgroundColor="surface-tertiary"
            >
                <Box
                    width={{ initial: "280px", ml: "100%" }}
                    padding='spacing-md'
                >
                    <Box
                        gap="spacing-sm"
                        display='flex'
                        flexDirection='column'
                        padding='spacing-md spacing-none spacing-none spacing-none'
                    >
                        <Box
                            width="64px"
                            height="64px"
                        >
                            <Image
                                src={walletConfig.appMetadata.logoUrl}
                                alt={walletConfig.appMetadata.name}
                            />
                        </Box>
                        <Box
                            display='flex'
                            flexDirection='column'
                            gap='spacing-xxs'
                            alignSelf='stretch'
                            alignItems='flex-start'
                        >
                            <Text
                                variant="h4-semibold"
                                color="text-primary"
                            >
                                {walletConfig.appMetadata.name}
                            </Text>
                            <Text
                                variant="bm-regular"
                                color="text-secondary"
                            >
                                Push Chain is a shared state L1 blockchain that allows all chains to unify, enabling apps of any chain to be accessed by users of any chain.
                            </Text>
                        </Box>
                    </Box>

                </Box>
                <BoxLayout
                    previewPaneVisible={true}
                >
                    <Box
                        alignItems="center"
                        flexDirection="column"
                        display="flex"
                        width={{ initial: "376px", ml: "100%" }}
                        padding="spacing-md"
                    >
                        {(connectMethod === "authentication" ||
                            connectMethod === "social") && (
                                <Login
                                    email={email}
                                    setEmail={setEmail}
                                    setConnectMethod={setConnectMethod}
                                    walletConfig={walletConfig}
                                />
                            )}
                        {connectMethod === "connectWallet" && (
                            <ConnectWallet setConnectMethod={setConnectMethod} />
                        )}
                    </Box>
                </BoxLayout>
            </Box>
        </>
    );
};

export { SplitWalletView };

const Image = styled.img`
  width:inherit;
  height:inherit;
  border-radius: 16px;
  border: 1px solid var(--stroke-secondary, #313338);
`