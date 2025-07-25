import { Box, Button, Spinner, Text, TextInput, WarningCircleFilled } from 'blocks';
import React, { FC, useState } from 'react';
import { css } from 'styled-components';
import WalletHeader from './dashboard/WalletHeader';
import { useWalletDashboard } from '../../../context/WalletDashboardContext';
import { useTokenManager } from '../../../hooks/useTokenManager';
import { TokenFormat } from '../../../types';
import { usePushChain } from '../../../hooks/usePushChain';
import { TokensListItem } from './TokensListItem';
import { truncateWords } from 'common';
import { isAddress } from 'viem';

const AddTokens: FC = () => {
    const [tokenAddress, setTokenAddress] = useState<string | null>(null);
    const [token, setToken] = useState<TokenFormat | null>(null);
    const [loadingTokenDetails, setLoadingTokens] = useState<boolean>(false);
    const [error, setError] = useState('');

    const { addToken, fetchTokenDetails } = useTokenManager();
    const { setActiveState } = useWalletDashboard();

    const { executorAddress } = usePushChain();

    const handleSearch = async () => {
        setError('');
        if (!tokenAddress) return;
        if (!isAddress(tokenAddress)) {
            setError('Invalid EVM address');
            return;
        }
        setLoadingTokens(true)
        try {
            const tokenDetails = await fetchTokenDetails(tokenAddress as `0x${string}`);
            if (tokenDetails) {
                setToken(tokenDetails)
            } else {
                setError('No token found at this address');
            }
        } catch (error) {
            console.warn("Error in fetching token details", error);
            setError(error.message || 'No token found');
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
            return;
        }
        const res = await addToken(token);
        if (res.error) {
            setError(res.error);
            return;
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

            {error && <Box
                display='flex'
                backgroundColor="pw-int-bg-danger-bold"
                alignItems='center'
                padding="spacing-xs"
                borderRadius="radius-sm"
                gap="spacing-xxs"
            >
                <WarningCircleFilled color="pw-int-icon-danger-subtle-color" size={20} />
                <Text wrap variant="h5-semibold" color="pw-int-text-danger-subtle-color">
                    {truncateWords(error, 10)}
                </Text>
            </Box>}

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
                                value={tokenAddress || ''}
                                onChange={(e) => {
                                    setTokenAddress(e.target.value);
                                    setToken(null);
                                    setError('');
                                }}
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
                    {!token ? (
                        <Button
                            onClick={handleSearch}
                            css={css`flex:2`}
                            disabled={
                                loadingTokenDetails ||
                                !tokenAddress ||
                                !isAddress(tokenAddress) ||
                                !!error
                            }
                        >
                            {loadingTokenDetails ? 'Searching...' : 'Search'}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleAddToken}
                            css={css`flex:2`}
                            disabled={loadingTokenDetails}
                        >
                            Add
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default AddTokens;