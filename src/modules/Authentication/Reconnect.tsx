import { FC } from 'react';
import { Box, Button } from '../../blocks';
import { ContentLayout, BoxLayout } from '../../common';
import { css } from 'styled-components';
import { APP_ROUTES } from '../../constants';
import { getPushSocialAuthRoute, getAuthWindowConfig } from './Authentication.utils';


export const Reconnect: FC = () => {
	const handleClick = () => {
		const backendURL = getPushSocialAuthRoute(
			"google",
			APP_ROUTES.OAUTH_REDIRECT
		);
		window.open(backendURL, "Google OAuth", getAuthWindowConfig());
	}
  
  return (
    <ContentLayout>
      <BoxLayout>
				<Box
					alignItems="center"
					justifyContent="center"
					flexDirection="column"
					display="flex"
					width={{ initial: "var(--pw-int-modal-width)", ml: "100%" }}
					height="570px"
					css={css`
						padding: var(--pw-int-modal-padding);  
					`}
				>
					<Button
						variant="outline"
						block
						onClick={handleClick}
					>
						Reconnect Wallet
					</Button>
				</Box>
      </BoxLayout>
    </ContentLayout>
  );
};

export default Reconnect;