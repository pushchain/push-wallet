import { FC, useState } from 'react';
import { Box, Text, Button, TextInput } from '../../blocks';
import { DrawerWrapper, LoadingContent, ErrorContent, WALLET_TO_WALLET_ACTION, ContentLayout, BoxLayout, getAppParamValue } from '../../common';
import { verifyOTPEmailAuth } from './Authentication.utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { css } from 'styled-components';
import { Footer } from '../../common/components/Footer';
import { APP_ROUTES } from '../../constants';

type OTPVerificationProps = {
  userId: string;
  onVerificationComplete: () => void;
};

export const OTPVerification: FC<OTPVerificationProps> = ({
  userId,
  onVerificationComplete
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const state = searchParams.get('state') || '';
      const challengeId = searchParams.get('challengeId') || '';
      const email = searchParams.get('email') || '';
      const response = await verifyOTPEmailAuth(otp, state, challengeId, email);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      if (response.ok && data.success) {
        onVerificationComplete();

        if (window.opener) {
          window.opener?.postMessage(
            { type: WALLET_TO_WALLET_ACTION.AUTH_STATE_PARAM, state: data.state },
            window.location.origin
          );
          window.close();
        } else {
          window.location.href = `${window.location.origin}${APP_ROUTES.WALLET}?state=${data.state}`;
        }






      }
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContentLayout footer={<Footer />}>
      <BoxLayout>
        <Box
          flexDirection="column"
          display="flex"
          gap="spacing-lg"
          width="100%"
          maxWidth="400px"
          padding="spacing-lg"
        >
          <Box flexDirection="column" display="flex" gap="spacing-md">
            <Text
              color="text-primary"
              variant="h4-semibold"
              css={css`
            font-size: 24px;
            margin-bottom: 8px;
          `}
            >
              Enter Verification Code
            </Text>
            <Text
              color="text-secondary"
              variant="bs-regular"
            >
              Please enter the verification code sent to your device
            </Text>

            <TextInput
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              css={css`
            padding: 12px;
            font-size: 16px;
            width: 100%;
            margin: 16px 0;
          `}
            />

            <Button
              onClick={handleSubmit}
              disabled={!otp || isLoading}
              loading={isLoading}
              variant="primary"
              css={css`
            width: 100%;
            max-width: 200px;
            margin: 0 auto;
          `}
            >
              Verify
            </Button>
          </Box>

          {isLoading && (
            <DrawerWrapper>
              <LoadingContent
                title="Verifying Code"
                subTitle="Please wait while we verify your code"
              />
            </DrawerWrapper>
          )}

          {error && (
            <DrawerWrapper>
              <ErrorContent
                title="Verification Failed"
                subTitle={error}
                onClose={() => setError('')}
              />
            </DrawerWrapper>
          )}
        </Box>
      </BoxLayout>
    </ContentLayout>
  );
};

export default OTPVerification; 