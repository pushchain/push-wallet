import { Box } from 'blocks';
import React from 'react';
import WalletHeader from '../WalletHeader';
import { SelectToken } from './SelectToken';
import SelectRecipient from './SelectRecipient';
import Review from './Review';
import Confirmation from './Confirmation';
import { TokenType } from '../../../../types';
import { useWalletDashboard } from '../../../../context/WalletDashboardContext';
import { SendTokenProvider, useSendTokenContext } from '../../../../context/SendTokenContext';

const SendContent = () => {
    const { selectedWallet } = useWalletDashboard();
    const { sendState, setTokenSelected, setSendState } = useSendTokenContext();

    const handleTokenSelection = (token: TokenType) => {
        setTokenSelected(token);
        setSendState('selectRecipient');
    }

    return (
        <Box
            flexDirection="column"
            display="flex"
            height={{ initial: "570px", ml: "100%" }}
            gap="spacing-md"
            position="relative"
        >
            <WalletHeader selectedWallet={selectedWallet} />

            {sendState === 'selectToken' && <SelectToken handleTokenSelection={handleTokenSelection} />}
            {sendState === 'selectRecipient' && <SelectRecipient />}
            {sendState === 'review' && <Review />}
            {sendState === 'confirmation' && <Confirmation />}
        </Box>
    );
};

const Send = () => {
    return (
        <SendTokenProvider>
            <SendContent />
        </SendTokenProvider>
    );
};

export { Send };