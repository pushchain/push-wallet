import { FC, useState, useRef, useEffect } from 'react';
import { Box, Text, Button, Back } from '../../blocks';
import { DrawerWrapper, LoadingContent, ErrorContent, WALLET_TO_WALLET_ACTION, ContentLayout, BoxLayout, getAppParamValue, PoweredByPush } from '../../common';
import { verifyOTPEmailAuth } from './Authentication.utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
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
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);

      inputRefs.current[5]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const state = searchParams.get('state') || '';
      const challengeId = searchParams.get('challengeId') || '';
      const email = searchParams.get('email') || '';
      const otpString = otp.join('');
      const response = await verifyOTPEmailAuth(otpString, state, challengeId, email);

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
          <Box onClick={() => navigate(APP_ROUTES.AUTH)}>
            <Back color='icon-tertiary' size={24} />
          </Box>

          <Box flexDirection="column" display="flex" gap="spacing-xxl">
            <Box flexDirection="column" display="flex" gap='spacing-xxxs' justifyContent="center" alignItems="center">
              <Text
                color="text-primary"
                variant="h4-semibold"
              >
                Confirm Verification Code
              </Text>
              <Text
                color="text-secondary"
                variant="bs-regular"
                textAlign="center"
              >
                We've sent a 6 digit code to your Email Address. Enter the code to proceed.
              </Text>
            </Box>

            <Box display="flex" gap="spacing-xxs" justifyContent="space-between" alignItems="center">
              {otp.map((digit, index) => (
                <StyledOTPInput
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  ref={(el) => (inputRefs.current[index] = el)}
                  maxLength={1}
                />
              ))}
            </Box>

            <Button
              onClick={handleSubmit}
              disabled={!otp.every(digit => digit) || isLoading}
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

          <PoweredByPush />

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

const StyledOTPInput = styled.input`
  width: 50px;
  padding: var(--spacing-xs, 12px);
  font-size: 18px;
  text-align: center;
  border: 1.5px solid var(--components-inputs-stroke-default, #313338);
  border-radius: 8px;
  background: var(--components-inputs-background-focus, #313338);
  color: var(--components-inputs-text-default);
  font-family: var(--font-family);
  
  &:focus {
    border-color: var(--components-inputs-stroke-focus, #CF59E2);
    outline: none;
  }
  
  &::placeholder {
    color: var(--components-inputs-text-placeholder);
  }
`;