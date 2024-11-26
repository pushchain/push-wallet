import { FC } from "react";
import styled, { keyframes, css } from "styled-components";

export type LoadingScreenProps = {
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
};

export const LoadingPage: FC<LoadingScreenProps> = ({
  isLoading = false,
  title = "Loading Push Wallet",
  subtitle = "Hang tight, creating a seamless web3 experience for you...",
}) => {
  if (!isLoading) return null;

  return (
    <LoadingContainer $isLoading={isLoading}>
      <ContentWrapper>
        <Content>
          <Spinner />
          <TextContent>
            <Title>{title}</Title>
            <Subtitle>{subtitle}</Subtitle>
          </TextContent>
        </Content>
      </ContentWrapper>
    </LoadingContainer>
  );
};

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div<{ $isLoading: boolean }>`
  position: absolute; // Change from fixed to absolute
  top: 50%;
  left: 0%;
  bottom: 0%;
  border-radius: 24px;
  transform: translate(-50%, -50%);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #09090b; // zinc-950
  transition: transform 0.5s ease-in-out;
  animation: ${slideUp} 0.5s ease-out forwards;
  ${(props) =>
    !props.$isLoading &&
    css`
      animation: ${slideUp} 0.5s ease-out reverse forwards;
    `}
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 28rem;
  border-radius: 1rem;
  background-color: rgba(24, 24, 27, 0.5); // zinc-900 with 50% opacity
  padding: 2rem;
  backdrop-filter: blur(4px);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.5rem;
`;

const Spinner = styled.div`
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  border-top: 2px solid #a855f7; // purple-500
  animation: ${spin} 1s linear infinite;
`;

const TextContent = styled.div`
  animation: ${fadeIn} 0.5s ease-out 0.2s both;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
`;

const Subtitle = styled.p`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #a1a1aa; // zinc-400
`;
