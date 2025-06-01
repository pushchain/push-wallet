import React, { FC } from 'react';
import TokensListItem from './TokensListItem';
import { ActiveStates, TokenType } from '../../../types/wallet.types';
import { Box, Text, YieldFarming } from 'blocks';
import { tokens } from 'common';

type TokensListProps = {
    setActiveState: (activeStates: ActiveStates) => void;
}
const TokensList: FC<TokensListProps> = ({
    setActiveState
}) => {

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
                {tokens.map((token: TokenType) => (
                    <TokensListItem token={token} key={token.id} />
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
                <YieldFarming color='icon-brand-medium' />
                <Text variant='bs-regular' color='text-brand-medium'>Manage Tokens</Text>
            </Box>
        </Box>

    );
};

export { TokensList };