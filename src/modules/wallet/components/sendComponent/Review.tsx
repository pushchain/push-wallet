import React from 'react';
import { Box, Button, SendNotification, Text } from 'blocks';
import { centerMaskWalletAddress } from 'common';
import { css } from 'styled-components';
import { useSendTokenContext } from '../../../../context/SendTokenContext';

const Review = () => {
    const { tokenSelected, receiverAddress, amount, handleSendTransaction, sendingTransaction } = useSendTokenContext();

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
                <Text variant='h3-semibold' color='text-primary' textAlign='center'> Review </Text>
                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' width='100%'>
                    <Box display='flex' gap='spacing-xxs' alignSelf='stretch' justifyContent='center'>
                        <SendNotification size={48} color='icon-brand-medium' />
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
                        <Text color='text-tertiary' variant='bs-regular'>Send To</Text>
                        <Text variant='bs-regular'>{centerMaskWalletAddress(receiverAddress, 5)}</Text>
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
                        <Text color='text-tertiary' variant='bs-regular'>Network Fee</Text>
                        <Text variant='bs-regular'>0.00002</Text>
                    </Box>
                </Box>
            </Box>
            <Box
                display='flex'
                alignItems='end'
                css={css`flex:1`}

            >
                <Button
                    onClick={handleSendTransaction}
                    block
                    loading={sendingTransaction}
                >
                    Confirm send
                </Button>
            </Box>
        </Box>
    );
};

export default Review;