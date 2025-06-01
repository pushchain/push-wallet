import { Box, Button, PushMonotone, Search, Text, TextInput } from 'blocks';
import React, { FC, useState } from 'react';
import { css } from 'styled-components';
import { TOKEN_LOGO, tokens } from 'common';
import { TokenType } from '../../../../types/wallet.types';
import { useWalletDashboard } from '../../WalletContext';
import { useSend } from './SendContext';

type SelectTokenProps = {
    handleTokenSelection: (token: TokenType) => void;
}
const SelectToken: FC<SelectTokenProps> = ({
    handleTokenSelection
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { setActiveState } = useWalletDashboard();

    const { tokenSelected, setTokenSelected } = useSend();

    const handleSearch = () => {
        if (!searchQuery) return;

        const result = tokens.find(token =>
            token.contractAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

    function getTokenLogo(tokenSymbol: string) {
        const IconComponent = TOKEN_LOGO[tokenSymbol];
        if (IconComponent) {
            return (
                <Box
                    position="relative"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box
                        width="36px"
                        height="36px"
                        borderRadius="radius-xl"
                        overflow="hidden"
                        alignSelf="center"
                    >
                        <IconComponent width={36} height={36} />;
                    </Box>
                    {tokenSymbol !== 'PCZ' && (
                        <Box
                            position="absolute"
                            css={css`
                                bottom:-12px;
                                right:50%;
                                left:52%;
                            `}
                        >
                            <PushMonotone />
                        </Box>
                    )}
                </Box>
            )
        }
    }
    return (
        <>
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
                        border='border-sm solid stroke-secondary'
                        onClick={() => handleTokenSelection(tokenSelected)}
                        cursor='pointer'
                    >
                        <Box
                            display='flex'
                            gap='spacing-xxs'
                            alignItems='center'
                        >
                            {getTokenLogo(tokenSelected.symbol)}
                            <Box
                                display='flex'
                                flexDirection='column'
                            >
                                <Text variant='bm-semibold' color='text-primary'>{tokenSelected.name}</Text>
                                <Text variant='bs-regular' color='text-secondary'>{tokenSelected.amount}{" "}{tokenSelected.symbol}</Text>
                            </Box>
                        </Box>
                    </Box>

                ) : (
                    <Box
                        display='flex'
                        flexDirection='column'
                        gap='spacing-xxs'
                    >
                        {tokens.map((token: TokenType) => (
                            <Box
                                display='flex'
                                padding='spacing-xs'
                                justifyContent='space-between'
                                alignSelf='stretch'
                                alignItems='center'
                                borderRadius='radius-sm'
                                border='border-sm solid stroke-secondary'
                                key={token.id}
                                onClick={() => handleTokenSelection(token)}
                                cursor='pointer'
                            >
                                <Box
                                    display='flex'
                                    gap='spacing-xxs'
                                    alignItems='center'
                                >
                                    {getTokenLogo(token.symbol)}
                                    <Box
                                        display='flex'
                                        flexDirection='column'
                                    >
                                        <Text variant='bm-semibold' color='text-primary'>{token.name}</Text>
                                        <Text variant='bs-regular' color='text-secondary'>{token.amount}{" "}{token.symbol}</Text>
                                    </Box>
                                </Box>
                            </Box>

                        ))}
                    </Box>
                )}
            </Box>

            <Box display='flex' css={css`flex:1`} alignItems='flex-end'>
                <Button onClick={() => setActiveState('wallet')} block>Close</Button>
            </Box>
        </>
    );
};

export { SelectToken };