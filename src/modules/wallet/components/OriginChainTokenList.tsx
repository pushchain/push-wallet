import { Box, Copy, DefaultChainMonotone, EthereumMonotone, PushMonotone, SolanaMonotone, Text, TickCircleFilled } from 'blocks';
import { centerMaskWalletAddress, CHAIN_MONOTONE_LOGO, handleCopy } from 'common';
import React, { useMemo, useState } from 'react';
import { OriginChainTokenListItem } from './OriginChainTokenListItem';
import { convertCaipToObject } from '../Wallet.utils';
import { css } from 'styled-components';

const ETHEREUM_TOKENS = [
    {
        name: 'Ethereum',
        symbol: 'ETH',
        icon: EthereumMonotone,
        address: '',
        decimals: 18,
    },
];

const SOLANA_TOKENS = [
    {
        name: 'Solana',
        symbol: 'SOL',
        icon: SolanaMonotone,
        address: '', // native
        decimals: 9,
    },
];

const OriginChainTokenList = ({
    originWalletAddress
}: {
    originWalletAddress: string
}) => {

    const [copied, setCopied] = useState(false);
    const [chainBoxHovered, setChainBoxHovered] = useState(false);

    const { result } = convertCaipToObject(originWalletAddress);

    const tokens = useMemo(() => {
        if (result.chain?.toLowerCase() === 'eip155' || result.chain?.toLowerCase() === 'ethereum') {
            return ETHEREUM_TOKENS;
        } else if (result.chain?.toLowerCase() === 'solana') {
            return SOLANA_TOKENS;
        }
        return [];
    }, [result.chain]);

    function getChainIcon(chainId) {
        if (chainId == null || chainId === 'devnet') {
            return <PushMonotone size={20} />
        }
        const IconComponent = CHAIN_MONOTONE_LOGO?.[chainId];
        if (IconComponent) {
            return <IconComponent size={20} color="pw-int-icon-tertiary-color" />;
        } else {
            return <DefaultChainMonotone size={20} />;
        }
    }

    return (
        <Box
            display='flex'
            flexDirection='column'
            borderRadius="radius-sm"
            border="border-sm solid pw-int-border-secondary-color"
            padding="spacing-xs"
            gap='spacing-xs'
        >
            <Box className='flex' justifyContent="space-between">

                <Box
                    display="flex"
                    gap="spacing-xxxs"
                    justifyContent="center"
                    alignItems="center"
                >
                    <DefaultChainMonotone />
                    <Text variant="os-regular" color="pw-int-text-tertiary-color">
                        {centerMaskWalletAddress(result.address, 5)}
                    </Text>
                    {copied ? (
                        <TickCircleFilled
                            autoSize
                            size={14}
                            color="pw-int-icon-success-bold-color"
                        />
                    ) : (
                        <Copy
                            color="pw-int-icon-tertiary-color"
                            size={14}
                            onClick={() => handleCopy(result.address, setCopied)}
                        />
                    )}
                </Box>
                <Box
                    display="flex"
                    alignItems="center"
                    onMouseEnter={() => setChainBoxHovered(true)}
                    onMouseLeave={() => setChainBoxHovered(false)}
                >
                    {chainBoxHovered && (
                        <Text
                            variant="os-regular"
                            color="pw-int-text-tertiary-color"
                            textTransform='capitalize'
                            css={css`margin-right: 8px;`}
                        >
                            Origin Chain
                        </Text>
                    )}
                    {getChainIcon(result.chainId)}
                </Box>
            </Box>

            {tokens && tokens.map((token) => (
                <OriginChainTokenListItem token={token} walletDetail={result} />
            ))}

        </Box>
    );
};

export default OriginChainTokenList;