import React from 'react';
import { TOKEN_LOGO } from '../Common.constants';
import { Box, PushMonotone, Text } from 'blocks';
import { css } from 'styled-components';

const TokenLogoComponent = ({ tokenSymbol }: { tokenSymbol: string }) => {

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
                {tokenSymbol !== 'PC' && (
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
    } else {
        return (
            <Box
                cursor="pointer"
                display="flex"
                alignItems="center"
                padding="spacing-xxs"
                borderRadius="radius-sm"
                backgroundColor="pw-int-bg-tertiary-color"
                width="36px"
                height="36px"
                justifyContent="center"
            >
                <Text variant='bl-regular' color='pw-int-text-secondary-color'>{tokenSymbol.charAt(0)}</Text>
            </Box>
        )
    }
};

export { TokenLogoComponent };