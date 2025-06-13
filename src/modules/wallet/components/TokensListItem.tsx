import React, { FC, useEffect } from 'react';
import { Box, Text } from 'blocks';
import { TokenFormat } from '../../../types';
import { useWalletBalance } from '../../../common/hooks/useWalletOperations';
import { TokenLogoComponent } from 'common';

type TokenListItemProps = {
    token: TokenFormat
}

const TokensListItem: FC<TokenListItemProps> = ({
    token
}) => {

    const { balance, fetchBalance } = useWalletBalance();

    useEffect(() => {
        if (token.address) {
            fetchBalance(token.address)
        }
    }, [token.address])

    return (
        <Box
            display='flex'
            padding='spacing-xs'
            justifyContent='space-between'
            alignSelf='stretch'
            alignItems='center'
            borderRadius='radius-sm'
            border='border-sm solid pw-int-border-secondary-color'
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
                    <Text variant='bs-regular' color='pw-int-text-secondary-color'>{Number(balance).toLocaleString()}{" "}{token.symbol}</Text>
                </Box>
            </Box>

            <Box
                display='flex'
                flexDirection='column'
                justifyContent='end'
                alignItems='end'
            >
                <Text variant='bm-semibold' color='pw-int-text-primary-color'>${Number('12045').toLocaleString()}</Text>
                <Text variant='c-semibold' color={'+1984'.includes('+') ? 'pw-int-text-success-bold-color' : 'pw-int-text-danger-bold-color'}>+{Number('1984').toLocaleString()}</Text>
            </Box>

        </Box>
    );
};

export default TokensListItem;