import { Box, Button, PushAlpha, Text, TextInput } from 'blocks';
import React, { FC, useState } from 'react';
import { css } from 'styled-components';
import WalletHeader from './WalletHeader';
import { useWalletDashboard } from '../../../context/WalletDashboardContext';

type Token = {
    name: string;
    id: number;
    contractAddress: string;
    logo: string;
}

const AddTokens: FC = () => {
    const { selectedWallet, setActiveState } = useWalletDashboard();

    const [tokenAddress, setTokenAddress] = useState<string | null>(null);
    const [token, setToken] = useState<Token | null>(null);

    const tokenContractAddresses: Token[] = [
        {
            name: 'Push Chain Donut',
            id: 1,
            contractAddress: '0xf418588522d5dd018b425E472991E52EB',
            logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
        },
        {
            name: 'USDC',
            id: 2,
            contractAddress: '0x6D2a0194bD791CADd7a3F5c9464cE9fC24a49e71',
            logo: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png'
        }
    ];

    const handleSearch = () => {
        if (!tokenAddress) return;

        const token = tokenContractAddresses.find(addr =>
            addr.contractAddress.toLowerCase().includes(tokenAddress.toLowerCase())
        );
        setToken(token)
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box
            flexDirection="column"
            display="flex"
            height={{ initial: "570px", ml: "100%" }}
            gap="spacing-md"
            position="relative"
        >
            <WalletHeader selectedWallet={selectedWallet} />
            <Box display='flex' flexDirection='column' justifyContent='space-between' css={css`flex:1`}>
                <Box
                    display="flex"
                    flexDirection="column"
                    gap='spacing-md'
                >
                    <Text variant='h3-semibold' color='text-primary' textAlign='center'>Add a Token</Text>

                    <Box
                        display="flex"
                        flexDirection="column"
                        gap="spacing-xxs"
                        width="-webkit-fill-available"
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
                    {token && (
                        <Box
                            display='flex'
                            padding="spacing-xs"
                            backgroundColor="surface-secondary"
                            borderRadius="radius-sm"
                            flexDirection='row'
                            alignItems='center'
                            gap='spacing-xxs'
                        >
                            <PushAlpha />
                            <Text color="text-primary" variant='bm-semibold'>{token.name}</Text>
                        </Box>
                    )}
                </Box>
                <Box display='flex' gap='spacing-xs'>
                    <Button variant='outline' css={css`flex:1`} onClick={() => setActiveState('walletDashboard')}>Cancel</Button>
                    <Button css={css`flex:2`}>Next</Button>
                </Box>

            </Box>

        </Box>
    );
};

export default AddTokens;