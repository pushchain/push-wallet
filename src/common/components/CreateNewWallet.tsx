import { Box, Button, Text } from 'blocks';
import React, { FC } from 'react';
import { css } from 'styled-components';

type CreateNewWalletProps = {
    onSuccess: () => void
}

const CreateNewWallet: FC<CreateNewWalletProps> = ({
    onSuccess
}) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="spacing-md"
            width='100%'
        >
            <Text variant="h3-semibold" color="text-primary" textAlign="center">
                No existing wallet found, Create new one
            </Text>
            <Box display='flex' flexDirection='column' gap='spacing-xs'>

                <Button css={css`width:100%`} variant='primary' onClick={onSuccess}>Create New Wallet</Button>

                <Text variant="cs-regular" color="text-tertiary">
                    Tip: Creating a new wallet will make your old wallet inaccessible.
                </Text>
            </Box>
        </Box>
    );
};

export { CreateNewWallet };