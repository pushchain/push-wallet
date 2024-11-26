import React from 'react';
import { Box, ExternalLinkIcon, InternalLink, PushMonotone, Text } from '../../../blocks';
import { css } from 'styled-components';
import { convertCaipToObject, formatWalletCategory, getFixedTime } from '../Wallet.utils';
import { centerMaskWalletAddress, CHAIN_LOGO } from '../../../common';

const WalletActivityListItem = ({
    transaction,
    address
}) => {

    function getChainIcon(chainId) {
        if (!chainId) {
            //TODO: give a fallback icon here
            return <PushMonotone size={20} />;
        }
        const IconComponent = CHAIN_LOGO[chainId];
        if (IconComponent) {
            return <IconComponent size={20} color="icon-tertiary" />;
        } else {
            // TO Bypass some test cases addresses
            return <PushMonotone size={20} />;
        }
    }

    function fetchChainFromAddress(transaction) {
        let displayAddress = '';
        let additionalRecipients = 0;
        if (address === transaction.sender) {
            // Address is the sender
            const recipients = transaction.recipients.recipients;
            displayAddress = recipients[0].address; // Show first recipient
            additionalRecipients = recipients.length - 1; // Count additional recipients
        } else if (transaction.recipients.recipients.some(recipient => recipient.address === address)) {
            // Address is in recipients
            displayAddress = transaction.sender; // Show sender address
        }

        const { result } = convertCaipToObject(displayAddress);

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
                    {centerMaskWalletAddress(displayAddress)}
                </Text>
                <Text color="text-tertiary" variant="bes-semibold">
                    {additionalRecipients == 0 && ` +${additionalRecipients} more`}
                </Text>
            </Box>
        )

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
                    {address === transaction.sender ? <ExternalLinkIcon size={16} color="icon-primary" /> : transaction.recipients.recipients.some(recipient => recipient.address === address) && <InternalLink size={16} color="icon-primary" />}

                </Box>
                <Box display="flex" flexDirection="column" gap='spacing-xxxs'>
                    <Text variant="bm-regular">
                        {address === transaction.sender ? 'Send' : transaction.recipients.recipients.some(recipient => recipient.address === address) ? 'Receive' : null}
                    </Text>
                    {fetchChainFromAddress(transaction)}
                </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap="spacing-xxxs">
                <Text variant="bes-regular">{formatWalletCategory(transaction.category)}</Text>
                <Text variant="c-semibold" color='text-tertiary'>{getFixedTime(transaction.ts)}</Text>
            </Box>
        </Box>
    );
};

export { WalletActivityListItem };