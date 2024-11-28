import { Box, Text, Spinner } from "blocks";
import { FC, ReactNode } from "react";
import styled, { keyframes, css } from "styled-components";

export type PopupLayoutProps = {
  children: ReactNode;
};

export const PopupLayout: FC<PopupLayoutProps> = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      backgroundColor="surface-primary"
      borderRadius="radius-md"
      width="376px"
      padding="spacing-xl spacing-lg spacing-lg spacing-lg"
      position="absolute"
      css={css`
        bottom: 0;
        left: 0;
        border-top: var(--border-xmd) solid var(--stroke-secondary);
        transition: transform 0.5s ease-in-out;
        animation: ${slideUp} 0.5s ease-out forwards;
      `}
    >
      {children}
    </Box>
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
