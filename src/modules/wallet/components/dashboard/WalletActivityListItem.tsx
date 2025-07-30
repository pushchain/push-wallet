import { Box, DefaultChainMonotone, Doc, ExternalLinkIcon, InternalLink, PushChainMonotone, Text } from '../../../../blocks';
import { css } from 'styled-components';
import { convertCaipToObject, formatTokenValue, getFixedTime } from '../../Wallet.utils';
import { centerMaskWalletAddress, CHAIN_MONOTONE_LOGO } from '../../../../common';

import { FC } from 'react';
import { formatUnits } from 'viem';
import useUEAOrigin from '../../../../hooks/useUEAOrigin';
import { TransactionType } from '../../Wallet.types';
import { WalletActivitiesResponse } from '../../../../types/walletactivities.types';

type WalletActivityListItemProps = {
    transaction: WalletActivitiesResponse
    address: string
}

const WalletActivityListItem: FC<WalletActivityListItemProps> = ({
    transaction,
    address
}) => {

    // This tells us the to part
    const dataTo = transaction.to ? transaction.to : transaction.created_contract;
    const { ueaOrigin, isLoading: isLoadingOrigin } = useUEAOrigin(dataTo?.hash);

    let txTypes: Array<TransactionType>;
    if (isLoadingOrigin && dataTo?.hash != null) {
        txTypes = [];
    } else if (ueaOrigin?.isUEA && dataTo?.hash != null) {
        txTypes = ['universal_tx'];
    } else {
        txTypes = transaction.transaction_types;
    }

    function getChainIcon(chainId) {
        if (chainId == null) {
            return <PushChainMonotone size={10} />
        }
        if (chainId === 'devnet') {
            return <PushChainMonotone size={10} />;
        }
        const IconComponent = CHAIN_MONOTONE_LOGO?.[chainId];
        if (IconComponent) {
            return <IconComponent size={20} color="pw-int-icon-tertiary-color" />;
        } else {
            return <DefaultChainMonotone size={20} />;
        }
    }

    function fetchChainFromAddress(transaction: WalletActivitiesResponse) {

        let displayAddress = '';
        if (address === transaction.from.hash) {
            const dataTo = transaction.to ? transaction.to.hash : transaction.created_contract.hash;
            displayAddress = dataTo;
        }

        if (address === transaction.to?.hash) {
            const recipients = transaction.from.hash;
            displayAddress = recipients;
        }

        const { result } = convertCaipToObject(displayAddress);

        if (result.address) {
            return (
                <Box display="flex" gap="spacing-xxs" alignItems='center'>
                    <Box
                        height="18px"
                        width="18px"
                        backgroundColor="pw-int-bg-tertiary-color"
                        borderRadius="radius-xxxs"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {getChainIcon(result.chainId)}
                    </Box>

                    <Text color="pw-int-text-secondary-color" variant="bes-semibold">
                        {centerMaskWalletAddress(result.address)}
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
              border-bottom: var(--border-sm) solid var(--pw-int-border-secondary-color);
            `}
        >

            <Box display="flex" gap="spacing-xxs">
                <Box
                    display="flex"
                    padding="spacing-xxs"
                    alignItems="center"
                    borderRadius="radius-xs"
                    backgroundColor="pw-int-bg-primary-color"
                    border="border-sm solid pw-int-border-secondary-color"
                    width="32px"
                    height="32px"
                >
                    {address === transaction.from.hash && transaction.to && (
                        <ExternalLinkIcon size={16} color="pw-int-icon-brand-color" />
                    )}
                    {address === transaction.to?.hash && (
                        <InternalLink size={16} color="pw-int-icon-success-bold-color" />
                    )}
                    {transaction.to == null && transaction.created_contract && (
                        <Doc size={16} color="pw-int-icon-tertiary-color" />
                    )}
                </Box>
                <Box display="flex" flexDirection="column" gap='spacing-xxxs'>
                    {showTxType(txTypes, address, transaction)}
                    {fetchChainFromAddress(transaction)}
                </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap="spacing-xxxs">
                <Text variant="bes-regular" textAlign='right'>{formatTokenValue(formatUnits(transaction.value, 18), 2)} PC</Text>
                <Text variant="c-semibold" color='pw-int-icon-tertiary-color' textAlign='right'>{getFixedTime(transaction.timestamp)}</Text>
            </Box>

        </Box>
    );
};

export { WalletActivityListItem };


const showTxType = (
    types: Array<TransactionType>,
    address?: string,
    transaction?: WalletActivitiesResponse
) => {
    const TYPES_ORDER: Array<TransactionType> = [
        'blob_transaction',
        'token_creation',
        'contract_creation',
        'token_transfer',
        'contract_call',
        'coin_transfer',
        'universal_tx'
    ];

    let label;

    const typeToShow = types.sort((t1, t2) => TYPES_ORDER.indexOf(t1) - TYPES_ORDER.indexOf(t2))[0];

    switch (typeToShow) {
        case 'universal_tx':
            label = 'Universal Transaction';
            break;
        case 'contract_call':
            label = 'Contract Call';
            break;
        case 'blob_transaction':
            label = 'Blob txn';
            break;
        case 'contract_creation':
            label = 'Contract Creation';
            break;
        case 'token_transfer':
            label = 'Token Transfer';
            break;
        case 'token_creation':
            label = 'Token Creation';
            break;
        case 'coin_transfer':
            if (address && transaction) {
                if (address === transaction.from?.hash) {
                    label = 'Send';
                } else if (address === transaction.to?.hash) {
                    label = 'Receive';
                } else {
                    label = 'Coin Transfer';
                }
            } else {
                label = 'Coin Transfer';
            }
            break;
        default:
            label = 'Transaction';
    }

    return <Text variant="bm-regular">{label}</Text>
}