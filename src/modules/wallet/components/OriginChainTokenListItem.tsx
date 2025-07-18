import { Box, DefaultChainMonotone, Faucet, PushAlpha, Text } from 'blocks';
import { CHAIN_LOGO } from 'common';
import { css } from 'styled-components';
import { useState } from 'react';

const OriginChainTokenListItem = ({
    token,
    walletDetail
}) => {

    function getChainIcon(chainId) {
        if (chainId == null || chainId === 'devnet') {
            return <PushAlpha width={36} height={36} />
        }
        const IconComponent = CHAIN_LOGO?.[chainId];
        if (IconComponent) {
            return <IconComponent width={36} height={36} color="pw-int-icon-tertiary-color" />;
        } else {
            return <PushAlpha width={36} height={36} />;
        }
    }

    // TODO: fetch balance of the native token

    // Removed unused chainBoxHovered state
    const [faucetHovered, setFaucetHovered] = useState(false);


    return (
        <Box
            display='flex'
            justifyContent='space-between'
        >
            <Box
                display='flex'
                gap="spacing-xxs"
            >
                <Box position="relative" width="36px" height="36px" display="inline-block">
                    {getChainIcon(walletDetail.chainId)}
                    <Box
                        position="absolute"
                        width="14px"
                        height="14px"
                        backgroundColor="pw-int-bg-primary-color"
                        borderRadius="radius-lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        css={css`
                                bottom: 0;
                                right: 0;
                            `}
                    >
                        <DefaultChainMonotone width={16} height={16} />
                    </Box>
                </Box>
                <Box
                    display='flex'
                    flexDirection='column'
                >
                    <Text variant='h5-semibold' color='pw-int-text-primary-color'>Ethereum</Text>
                    <Box
                        display='flex'
                        gap="spacing-xxxs"
                    >
                        <Text variant='h6-regular' color='pw-int-text-secondary-color'>0 ETH</Text>
                        <Box
                            display='flex'
                            alignItems='center'
                            borderRadius='radius-xs'
                            backgroundColor='pw-int-bg-primary-color'
                            padding='spacing-none spacing-xxxs'
                            gap='spacing-xxxs'
                            cursor='pointer'
                            position='relative'
                            onMouseEnter={() => setFaucetHovered(true)}
                            onMouseLeave={() => setFaucetHovered(false)}
                        >
                            <Faucet size={16} color='pw-int-icon-primary-color' />
                            {faucetHovered && (
                                <Text textTransform="capitalize" color="pw-int-text-tertiary-color" css={css`margin-left: 4px;`}>
                                    Use for Gas
                                </Text>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* <Box>
                <Text variant='h5-semibold'>$3,225.21</Text>
                <Text textAlign='right'>-$125.37</Text>
            </Box> */}
        </Box>
    );
};

export { OriginChainTokenListItem };