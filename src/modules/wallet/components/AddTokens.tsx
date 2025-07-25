import { Box, Button, Spinner, Text, TextInput } from 'blocks';
import React, { FC, useState } from 'react';
import { css } from 'styled-components';
import WalletHeader from './dashboard/WalletHeader';
import { useWalletDashboard } from '../../../context/WalletDashboardContext';
import { useTokenManager } from '../../../hooks/useTokenManager';
import { TokenFormat } from '../../../types';
import { usePushChain } from '../../../hooks/usePushChain';
import { TokensListItem } from './TokensListItem';

const AddTokens: FC = () => {
    const [tokenAddress, setTokenAddress] = useState<string | null>(null);
    const [token, setToken] = useState<TokenFormat | null>(null);
    const [loadingTokenDetails, setLoadingTokens] = useState<boolean>(false);

    const { addToken, fetchTokenDetails } = useTokenManager();
    const { setActiveState } = useWalletDashboard();

    const { executorAddress } = usePushChain();

    const handleSearch = async () => {
        if (!tokenAddress) return;

        setLoadingTokens(true)
        try {
            const tokenDetails = await fetchTokenDetails(tokenAddress as `0x${string}`);

            if (tokenDetails) {
                setToken(tokenDetails)
            }
        } catch (error) {
            console.log("Error in fetching token details", error);
        } finally {
            setLoadingTokens(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleAddToken = async () => {

        if (!token) {
            handleSearch();
        }

        const res = await addToken(token);

        if (res.error) {
            console.log("Error in adding tokens >>", res.error)
        }

        if (res.success) {
            console.log("Successfully added tokens");
            setActiveState('walletDashboard')
        }
    }

    return (
        <Box
            flexDirection="column"
            display="flex"
            height={{ initial: "570px", ml: "100%" }}
            gap="spacing-md"
            position="relative"
        >
            <WalletHeader walletAddress={executorAddress} handleBackButton={() => setActiveState('walletDashboard')} />
            <Box display='flex' flexDirection='column' justifyContent='space-between' css={css`flex:1`}>
                <Box
                    display="flex"
                    flexDirection="column"
                    gap='spacing-md'
                >
                    <Text variant='h3-semibold' color='pw-int-text-primary-color' textAlign='center'>Add a Token</Text>

                    <Box
                        display="flex"
                        flexDirection="column"
                        gap="spacing-xxs"
                        width="100%"
                    >
                        <Box
                            borderRadius="radius-xs"
                            width="100%"
                            justifyContent="center"
                            alignItems="center"
                            onKeyDown={handleKeyPress}
                        >
                            <TextInput
                                value={tokenAddress}
                                onChange={(e) => setTokenAddress(e.target.value)}
                                placeholder="Enter Token Address"
                                label='Token Contract address'
                                description='Add the contract address of the token you want to add'
                                css={css`
                                color: white;
                            `}
                            />
                        </Box>

                    </Box>

                    {loadingTokenDetails && (
                        <Spinner size='large' variant='primary' />
                    )}

                    {token && (
                        <TokensListItem token={token} />
                    )}
                </Box>
                <Box display='flex' gap='spacing-xs'>
                    <Button variant='outline' css={css`flex:1`} onClick={() => setActiveState('walletDashboard')}>Cancel</Button>
                    <Button onClick={handleAddToken} css={css`flex:2`}>Add</Button>
                </Box>

            </Box>

        </Box>
    );
};

export default AddTokens;