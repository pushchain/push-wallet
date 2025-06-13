import React, { FC } from 'react';
import TokensListItem from './TokensListItem';
import { Box, Text, YieldFarming } from 'blocks';
import { ActiveStates, TokenFormat } from '../../../types';
import { useTokenManager } from '../../../hooks/useTokenManager';

type TokensListProps = {
    setActiveState: (activeStates: ActiveStates) => void;
}
const TokensList: FC<TokensListProps> = ({
    setActiveState
}) => {

    const { tokens } = useTokenManager();

    return (

        <Box
            display='flex'
            flexDirection='column'
            gap='spacing-xs'
        >
            <Box
                display='flex'
                flexDirection='column'
                gap='spacing-xs'
                overflow='scroll'
                height='240px'
                padding='spacing-none spacing-xs spacing-none spacing-none'
            >
                {tokens.map((token: TokenFormat) => (
                    <TokensListItem token={token} key={token.address} />
                ))}
            </Box>
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                gap='spacing-xxs'
                padding='spacing-xxs'
                cursor='pointer'
                onClick={() => setActiveState('addTokens')}
            >
                <YieldFarming color='pw-int-icon-brand-color' />
                <Text variant='bs-regular' color='pw-int-text-link-color'>Manage Tokens</Text>
            </Box>
        </Box>

    );
};

export { TokensList };