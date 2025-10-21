import { Box, CopyFilled, DefaultChainMonotone, Text, TickCircleFilled } from 'blocks';
import { centerMaskWalletAddress, handleCopy } from 'common';
import { useMemo, useState } from 'react';
import { OriginChainTokenListItem } from './OriginChainTokenListItem';
import { convertCaipToObject } from '../Wallet.utils';
import { css } from 'styled-components';
import { TOKEN_LISTS } from '../../../helpers/TokenHelper';

const OriginChainTokenList = ({
    originWalletAddress
}: {
    originWalletAddress: string
}) => {

    const { result } = convertCaipToObject(originWalletAddress);

    const tokens = useMemo(() => {
        const chainNs = result.chain?.toLowerCase();
        const chainId = Number(result.chainId);

        if (chainNs === 'solana') return TOKEN_LISTS.SOLANA;

        // EVM chains
        if (chainNs === 'eip155' || chainNs === 'ethereum') {
            switch (chainId) {
                case 11155111: return TOKEN_LISTS.ETHEREUM;
                case 84532:    return TOKEN_LISTS.BASE;
                case 421614:   return TOKEN_LISTS.ARBITRUM;
                default:       return TOKEN_LISTS.ETHEREUM;
            }
        }
    }, [result.chain, result.chainId]);

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

                {/* {getMonotoneChainIcon(result.chainId)} */}
            </Box>
        </Box>

    )
}