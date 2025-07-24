import { Box, CopyFilled, DefaultChainMonotone, PushMonotone, Text, TickCircleFilled } from 'blocks';
import { centerMaskWalletAddress, CHAIN_MONOTONE_LOGO, handleCopy } from 'common';
import React, { useMemo, useState, useCallback } from 'react';
import { OriginChainTokenListItem } from './OriginChainTokenListItem';
import { convertCaipToObject } from '../Wallet.utils';
import { css } from 'styled-components';

const ETHEREUM_TOKENS = [
    {
        name: 'Ethereum',
        symbol: 'Sepolia ETH',
        address: '',
        decimals: 18,
    },
];

const SOLANA_TOKENS = [
    {
        name: 'Solana',
        symbol: 'SOL',
        address: '',
        decimals: 9,
    },
];

const OriginChainTokenList = ({
    originWalletAddress
}: {
    originWalletAddress: string
}) => {

    const { result } = convertCaipToObject(originWalletAddress);

    const tokens = useMemo(() => {
        if (result.chain?.toLowerCase() === 'eip155' || result.chain?.toLowerCase() === 'ethereum') {
            return ETHEREUM_TOKENS;
        } else if (result.chain?.toLowerCase() === 'solana') {
            return SOLANA_TOKENS;
        }
        return [];
    }, [result.chain]);

    return (
        <Box
            display='flex'
            flexDirection='column'
            borderRadius="radius-sm"
            border="border-sm solid pw-int-border-secondary-color"
            padding="spacing-xs"
            gap='spacing-xs'
        >
            <OriginChainWalletHeader result={result} />

            {tokens && tokens.map((token, id) => (
                <OriginChainTokenListItem token={token} walletDetail={result} key={id} />
            ))}

        </Box>
    );
};

export default OriginChainTokenList;

const OriginChainWalletHeader = ({ result }) => {
    const [copied, setCopied] = useState(false);

    const getMonotoneChainIcon = useCallback((chainId) => {
        if (chainId == null || chainId === 'devnet') {
            return <PushMonotone size={20} />
        }
        const IconComponent = CHAIN_MONOTONE_LOGO?.[chainId];
        if (IconComponent) {
            return <IconComponent size={20} color="pw-int-icon-tertiary-color" />;
        } else {
            return <DefaultChainMonotone size={20} />;
        }
    }, []);

    return (
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
                <Box
                    cursor='pointer'
                >
                    {copied ? (
                        <TickCircleFilled
                            autoSize
                            size={14}
                            color="pw-int-icon-success-bold-color"
                        />
                    ) : (
                        <CopyFilled
                            color="pw-int-icon-tertiary-color"
                            size={14}
                            onClick={() => handleCopy(result.address, setCopied)}
                        />
                    )}
                </Box>
            </Box>
            <Box
                display="flex"
                alignItems="center"
            >
                <Text
                    variant="os-regular"
                    color="pw-int-text-tertiary-color"
                    textTransform='capitalize'
                    css={css`margin-right: 8px;`}
                >
                    Origin Chain Funds
                </Text>

                {getMonotoneChainIcon(result.chainId)}
            </Box>
        </Box>

    )
}