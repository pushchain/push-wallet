import { Box } from 'blocks';
import React from 'react';
import WalletHeader from '../WalletHeader';
import { useWalletDashboard } from '../../WalletContext';
import { TokenType } from '../../../../types/wallet.types';
import { SelectToken } from './SelectToken';
import SelectRecipient from './SelectRecipient';
import Review from './Review';
import Confirmation from './Confirmation';
import { SendProvider, useSend } from './SendContext';

const SendContent = () => {
    const { selectedWallet } = useWalletDashboard();
    const { sendState, setTokenSelected, setSendState } = useSend();


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
        <SendProvider>
            <SendContent />
        </SendProvider>
    );
};

export { Send };