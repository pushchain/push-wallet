import { Box, DefaultChainMonotone, ExternalLinkIcon, InternalLink, PushMonotone, Text } from '../../../blocks';
import { css } from 'styled-components';
import { convertCaipToObject, formatWalletCategory, getFixedTime } from '../Wallet.utils';
import { centerMaskWalletAddress, CHAIN_MONOTONE_LOGO } from '../../../common';
import { TxResponse } from '@pushchain/devnet/src/lib/tx/tx.types';
import { FC } from 'react';

type WalletActivityListItemProps = {
    transaction: TxResponse
    address: string
}

const WalletActivityListItem: FC<WalletActivityListItemProps> = ({
    transaction,
    address
}) => {
    function getChainIcon(chainId) {
        if (chainId === 'devnet') {
            return <PushMonotone size={20} />;
        }
        const IconComponent = CHAIN_MONOTONE_LOGO?.[chainId];
        if (IconComponent) {
            return <IconComponent size={20} color="icon-tertiary" />;
        } else {
            //TODO: give a fallback icon here
            return <DefaultChainMonotone size={20} />;
        }
    }

    function fetchChainFromAddress(transaction: TxResponse) {

        let displayAddress = '';
        let additionalRecipients = 0;
        if (address === transaction.from) {
            // Address is the sender
            const recipients = transaction.recipients;
            displayAddress = recipients[0]; // Show first recipient
            additionalRecipients = recipients.length - 1; // Count additional recipients
        } else if (transaction.recipients.some(recipient => recipient === address)) {
            // Address is in recipients
            displayAddress = transaction.from; // Show sender address

        }

        const { result } = convertCaipToObject(displayAddress);

        if (result.address) {
            return (
                <Box display="flex" gap="spacing-xxs" alignItems='center'>
                    <Box
                        height="16px"
                        width="16px"
                        backgroundColor="surface-tertiary"
                        borderRadius="radius-xxxs"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Text
                            color="text-tertiary"
                            variant="os-bold"
                            css={css`
                    font-size: 8px;
                    padding-top: 1px;
                  `}
                        >

                            {result.chainId && getChainIcon(result.chainId)}
                        </Text>
                    </Box>
                    <Text color="text-secondary" variant="bes-semibold">
                        {centerMaskWalletAddress(result.address)}
                    </Text>
                    <Text color="text-tertiary" variant="bes-semibold">
                        {additionalRecipients >= 0 && ` +${additionalRecipients} more`}
                    </Text>
                </Box>
            )
        }


    }

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            padding="spacing-sm spacing-xxxs"
            css={css`
              border-bottom: var(--border-sm) solid var(--stroke-secondary);
            `}
        >

            <Box display="flex" gap="spacing-xxs">
                <Box
                    display="flex"
                    padding="spacing-xxs"
                    alignItems="center"
                    borderRadius="radius-xs"
                    backgroundColor="surface-primary"
                    border="border-sm solid stroke-secondary"
                    width="32px"
                    height="32px"
                >
                    {address === transaction.from ? <ExternalLinkIcon size={16} color="icon-primary" /> : transaction.recipients.some(recipient => recipient === address) && <InternalLink size={16} color="icon-primary" />}

                </Box>
                <Box display="flex" flexDirection="column" gap='spacing-xxxs'>
                    <Text variant="bm-regular">
                        {address === transaction.from ? 'Send' : transaction.recipients.some(recipient => recipient === address) ? 'Receive' : null}
                    </Text>
                    {fetchChainFromAddress(transaction)}
                </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap="spacing-xxxs">
                <Text variant="bes-regular">{formatWalletCategory(transaction.category)}</Text>
                <Text variant="c-semibold" color='text-tertiary'>{getFixedTime(transaction.timestamp)}</Text>
            </Box>

        </Box>
    );
};

export { WalletActivityListItem };