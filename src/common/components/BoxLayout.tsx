import { FC, ReactNode } from "react";
import { Box } from "../../blocks";
import React from "react";
import { css } from "styled-components";

type BoxLayoutProps = {
  children: ReactNode;
};

const BoxLayout: FC<BoxLayoutProps> = ({ children }) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      borderRadius="radius-md"
      justifyContent="center"
      position="relative"
      width={{ initial: "auto", ml: "90%" }}
      css={css`
        background: linear-gradient(
          160deg,
          #313338 0 25%,
          #d548ec,
          #0056d0,
          #313338 75% 100%
        );
        padding: 1.5px;
      `}
    >
      <Box
        backgroundColor="surface-primary"
        alignItems="center"
        display="flex"
        flexDirection="column"
        borderRadius="radius-md"
        justifyContent="center"
        width={{ initial: "auto", ml: "100%" }}
      >
        {children}
      </Box>
    </Box>
  );
};

export { BoxLayout };
