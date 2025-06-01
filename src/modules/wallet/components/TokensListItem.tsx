import React, { FC } from 'react';
import { TokenType } from '../../../types/wallet.types';
import { Box, PushMonotone, Text } from 'blocks';
import { TOKEN_LOGO } from 'common';
import { css } from 'styled-components';

type TokenListItemProps = {
    token: TokenType
}

const TokensListItem: FC<TokenListItemProps> = ({
    token
}) => {

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
        <Box
            display='flex'
            padding='spacing-xs'
            justifyContent='space-between'
            alignSelf='stretch'
            alignItems='center'
            borderRadius='radius-sm'
            border='border-sm solid stroke-secondary'
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

            <Box
                display='flex'
                flexDirection='column'
                justifyContent='end'
                alignItems='end'
            >
                <Text variant='bm-semibold' color='text-primary'>${token.amountInUsd.toLocaleString()}</Text>
                <Text variant='c-semibold' color={token.amountChange.includes('+') ? 'text-state-success-bold' : 'text-state-danger-bold'}>{token.amountChange}</Text>
            </Box>

        </Box>
    );
};

export default TokensListItem;