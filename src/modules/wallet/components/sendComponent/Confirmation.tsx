import { Box, Button, ExternalLink, Text, TickCircleFilled } from 'blocks';
import React from 'react';
import { css } from 'styled-components';
import { centerMaskWalletAddress } from 'common';
import { useWalletDashboard } from '../../../../context/WalletDashboardContext';
import { useSendTokenContext } from '../../../../context/SendTokenContext';

const Confirmation = () => {

    const { tokenSelected, receiverAddress, amount } = useSendTokenContext();
    const { setActiveState } = useWalletDashboard();

    const handleBackToHome = () => {
        setActiveState('wallet');
    }

    return (
        <Box
            display='flex'
            flexDirection='column'
            css={css`flex:1`}
        >
            <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                gap='spacing-md'
            >
                <Text variant='h3-semibold' color='text-primary' textAlign='center'> Sent </Text>
                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' width='100%'>
                    <Box display='flex' gap='spacing-xxs' alignSelf='stretch' justifyContent='center'>
                        <TickCircleFilled size={48} color='icon-state-success-subtle' />
                        <Text variant='h2-semibold' color='text-primary'>{amount} {tokenSelected.symbol}</Text>
                    </Box>
                    <Text color='text-secondary' variant='bs-regular'>$12.45</Text>
                </Box>

                <Box display='flex' flexDirection='column' width='100%'>
                    <Box
                        display='flex'
                        justifyContent='space-between'
                        padding='spacing-sm'
                        alignItems='center'
                        alignSelf='stretch'
                        css={css`
                        border-bottom: 1px solid var(--stroke-secondary, #313338);
                        `}
                    >
                        <Text color='text-tertiary' variant='bs-regular'>Status</Text>
                        <Text variant='bs-regular'>Success</Text>
                    </Box>
                    <Box
                        display='flex'
                        justifyContent='space-between'
                        padding='spacing-sm'
                        alignItems='center'
                        alignSelf='stretch'
                        css={css`
                        border-bottom: 1px solid var(--stroke-secondary, #313338);
                        `}
                    >
                        <Text color='text-tertiary' variant='bs-regular'>Date</Text>
                        <Text variant='bs-regular'>May 27, 2025 — 2:28 PM</Text>
                    </Box>
                    <Box
                        display='flex'
                        justifyContent='space-between'
                        padding='spacing-sm'
                        alignItems='center'
                        alignSelf='stretch'
                        css={css`
                        border-bottom: 1px solid var(--stroke-secondary, #313338);
                        `}
                    >
                        <Text color='text-tertiary' variant='bs-regular'>Network</Text>
                        <Text variant='bs-regular'>Push Chain Donut</Text>
                    </Box>
                    <Box
                        display='flex'
                        justifyContent='space-between'
                        padding='spacing-sm'
                        alignItems='center'
                        alignSelf='stretch'
                        css={css`
                        border-bottom: 1px solid var(--stroke-secondary, #313338);
                        `}
                    >
                        <Text color='text-tertiary' variant='bs-regular'>To</Text>
                        <Text variant='bs-regular'>{centerMaskWalletAddress(receiverAddress, 5)}</Text>
                    </Box>
                </Box>
            </Box>
            <Box
                display='flex'
                flexDirection='column'
                justifyContent='end'
                css={css`flex:1`}
                gap='spacing-xs'
                alignItems='center'
            >
                <Box display='flex' gap='spacing-xxxs'>
                    <ExternalLink color='icon-brand-medium' />
                    <Text color='text-brand-medium'>View on Explorer</Text>
                </Box>
                <Button
                    onClick={handleBackToHome}
                    block
                >
                    Back to Home
                </Button>
            </Box>
        </Box>
    );
};

export default Confirmation;