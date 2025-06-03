import { Box, Button, Copy, PushAlpha, Text, TickCircleFilled } from 'blocks';
import React, { useState, useEffect } from 'react';
import WalletHeader from './WalletHeader';
import styled, { css } from 'styled-components';
import { useGlobalState } from '../../../context/GlobalContext';
import { convertCaipToObject } from '../Wallet.utils';
import { useWalletDashboard } from '../../../context/WalletDashboardContext';

const Receive = () => {
    const { state } = useGlobalState();
    const { selectedWallet, setActiveState } = useWalletDashboard();
    const [isCopied, setIsCopied] = useState(false);

    const parsedWallet =
        selectedWallet?.address || state?.externalWallet?.address;

    const { result } = convertCaipToObject(parsedWallet);

    const handleCopyAddress = () => {
        if (result?.address) {
            navigator.clipboard.writeText(result.address);
            setIsCopied(true);
        }
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isCopied) {
            timeout = setTimeout(() => {
                setIsCopied(false);
            }, 3000);
        }
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [isCopied]);

    return (
        <Box
            flexDirection="column"
            display="flex"
            height={{ initial: "570px", ml: "100%" }}
            gap="spacing-md"
            position="relative"
        >
            <WalletHeader selectedWallet={selectedWallet} handleBackButton={() => setActiveState('walletDashboard')} />

            <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                gap='spacing-md'
                css={css`flex:1`}
            >
                <Box
                    display='flex'
                    padding='spacing-sm'
                    borderRadius='radius-md'
                    border='border-sm solid stroke-tertiary'
                    backgroundColor='surface-primary'
                    position='relative'
                >
                    <Image
                        src='/Push_QR.png'
                        alt='Push QR'
                        width={164}
                        height={164}
                    />
                    <LogoContainer>
                        <PushAlpha />
                    </LogoContainer>
                </Box>
                <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    gap='spacing-xs'
                    width='100%'

                >
                    <Text color='text-primary' variant='h4-semibold'>Push Address</Text>

                    <Box
                        padding='spacing-xs'
                        alignSelf='stretch'
                        borderRadius='radius-xs'
                        backgroundColor='surface-primary'
                        border='border-sm solid stroke-tertiary'
                    >
                        <Text variant='bs-semibold' wrap>{result?.address}</Text>
                    </Box>

                    <Box
                        display='flex'
                        gap='spacing-xxxs'
                        justifyContent='center'
                        alignItems='center'
                        padding='spacing-xxxs'
                        onClick={handleCopyAddress}
                        cursor='pointer'
                    >
                        {isCopied ? (
                            <TickCircleFilled color='icon-brand-medium' size={24} />
                        ) : (
                            <Copy color='icon-brand-medium' size={24} />
                        )}
                        <Text variant='bs-semibold' color='text-brand-medium'>
                            {isCopied ? 'Address Copied!' : 'Copy Address'}
                        </Text>
                    </Box>
                    <Text variant='c-regular' color='text-tertiary'>
                        Only send to Push chain addresses. Other networks may result in lost tokens
                    </Text>
                </Box>
                <Box
                    css={css`flex:1`}
                    display='flex'
                    alignItems='end'
                    width='100%'
                >

                    <Button block onClick={() => setActiveState('walletDashboard')}>Close</Button>
                </Box>
            </Box>

        </Box>
    );
};

export { Receive };

const Image = styled.img``

const LogoContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`
