import React, { FC, useMemo } from 'react';
import { TokensListItem } from './TokensListItem';
import { Box, Text, YieldFarming } from 'blocks';
import { ActiveStates, TokenFormat } from '../../../types';
import { useTokenManager } from '../../../hooks/useTokenManager';
import OriginChainTokenList from './OriginChainTokenList';
import { useGlobalState } from '../../../context/GlobalContext';
import { usePushChain } from '../../../hooks/usePushChain';
import { convertCaipToObject, getWalletlist } from '../Wallet.utils';
import { css } from 'styled-components';
import { PushChain } from '@pushchain/core';

type TokensListProps = {
    setActiveState: (activeStates: ActiveStates) => void;
}
const TokensList: FC<TokensListProps> = ({
    setActiveState
}) => {

    const { tokens } = useTokenManager();
    const { state } = useGlobalState();
    const { executorAddress } = usePushChain();

    const pushWallet = useMemo(() => getWalletlist(state.wallet)[0], [state.wallet]);
    const readOnlyWallet = state.pushWallet ? PushChain.utils.account.toChainAgnostic(state.pushWallet.address, { chain: state.pushWallet.chain }) : null;
    const parsedWallet = pushWallet?.fullAddress || readOnlyWallet || state?.externalWallet?.originAddress;

    const { result } = useMemo(() => convertCaipToObject(parsedWallet), [parsedWallet]);

    return (

        <Box
            display='flex'
            flexDirection='column'
            gap='spacing-xs'
        >
            <Box
                display='flex'
                flexDirection='column'
                gap='spacing-xs'
                overflow="hidden scroll"
                height='240px'
                customScrollbar
                css={css`
                    padding-right: 6px;
                    margin-right: -8px;
                `}
            >
                {executorAddress !== result.address && <OriginChainTokenList originWalletAddress={parsedWallet} />}
                {tokens.map((token: TokenFormat) => (
                    <TokensListItem token={token} key={token.address} />
                ))}
            </Box>
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                gap='spacing-xxs'
                padding='spacing-xxs'
                cursor='pointer'
                onClick={() => setActiveState('addTokens')}
            >
                <YieldFarming color='pw-int-icon-brand-color' />
                <Text variant='bs-regular' color='pw-int-text-link-color'>Manage Tokens</Text>
            </Box>
        </Box>

    );
};

export { TokensList };