import { Box, Button, Search, Text, TextInput } from 'blocks';
import React, { FC, useState } from 'react';
import { css } from 'styled-components';
import { TokenFormat } from '../../../../types';
import { useWalletDashboard } from '../../../../context/WalletDashboardContext';
import { useSendTokenContext } from '../../../../context/SendTokenContext';
import WalletHeader from '../WalletHeader';
import { useTokenManager } from '../../../../hooks/useTokenManager';
import { TokenLogoComponent } from 'common';

type SelectTokenProps = {
    handleTokenSelection: (token: TokenFormat) => void;
}
const SelectToken: FC<SelectTokenProps> = ({
    handleTokenSelection
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { setActiveState, selectedWallet } = useWalletDashboard();

    const { tokenSelected, setTokenSelected } = useSendTokenContext();

    const { tokens } = useTokenManager();

    const handleSearch = () => {
        if (!searchQuery) return;

        const result = tokens.find(token =>
            token.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setTokenSelected(result);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            <WalletHeader selectedWallet={selectedWallet} handleBackButton={() => setActiveState('walletDashboard')} />

            <Box
                display='flex'
                flexDirection='column'
                gap='spacing-sm'
            >
                <Box
                    borderRadius="radius-xs"
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                    onKeyDown={handleKeyPress}
                >
                    <TextInput
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<Search />}
                        placeholder="Search Token..."
                        description='Search by token name, symbol, or contract address'
                        css={css`
                        color: var(--text-primary);
                    `}
                    />
                </Box>

                {tokenSelected ? (
                    <Box
                        display='flex'
                        padding='spacing-xs'
                        justifyContent='space-between'
                        alignSelf='stretch'
                        alignItems='center'
                        borderRadius='radius-sm'
                        border='border-sm solid pw-int-border-secondary-color'
                        onClick={() => handleTokenSelection(tokenSelected)}
                        cursor='pointer'
                    >
                        <Box
                            display='flex'
                            gap='spacing-xxs'
                            alignItems='center'
                        >
                            <TokenLogoComponent tokenSymbol={tokenSelected.symbol} />
                            <Box
                                display='flex'
                                flexDirection='column'
                            >
                                <Text variant='bm-semibold' color='pw-int-text-primary-color'>{tokenSelected.name}</Text>
                                <Text variant='bs-regular' color='pw-int-text-secondary-color'>{0}{" "}{tokenSelected.symbol}</Text>
                            </Box>
                        </Box>
                    </Box>

                ) : (
                    <Box
                        display='flex'
                        flexDirection='column'
                        gap='spacing-xxs'
                    >
                        {tokens.map((token: TokenFormat) => (
                            <Box
                                display='flex'
                                padding='spacing-xs'
                                justifyContent='space-between'
                                alignSelf='stretch'
                                alignItems='center'
                                borderRadius='radius-sm'
                                border='border-sm solid pw-int-border-secondary-color'
                                key={token.address}
                                onClick={() => handleTokenSelection(token)}
                                cursor='pointer'
                            >
                                <Box
                                    display='flex'
                                    gap='spacing-xxs'
                                    alignItems='center'
                                >
                                    <TokenLogoComponent tokenSymbol={token.symbol} />
                                    <Box
                                        display='flex'
                                        flexDirection='column'
                                    >
                                        <Text variant='bm-semibold' color='pw-int-text-primary-color'>{token.name}</Text>
                                        <Text variant='bs-regular' color='pw-int-text-secondary-color'>{0}{" "}{token.symbol}</Text>
                                    </Box>
                                </Box>
                            </Box>

                        ))}
                    </Box>
                )}
            </Box>

            <Box display='flex' css={css`flex:1`} alignItems='flex-end'>
                <Button onClick={() => setActiveState('walletDashboard')} block>Close</Button>
            </Box>
        </>
    );
};

export { SelectToken };