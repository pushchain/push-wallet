import { FC, ReactNode } from "react";
import { Box } from "../../blocks";
import React from "react";
import { css } from "styled-components";
import { useDarkMode } from "../hooks";

type BoxLayoutProps = {
  children: ReactNode;
};

const BoxLayout: FC<BoxLayoutProps> = ({ children }) => {
  const { isDarkMode } = useDarkMode();
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
        position: relative;
        padding: 1.5px;
        overflow: hidden;

        &::before {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          z-index: 0;
          background: linear-gradient(
            160deg,
            ${isDarkMode ? 'rgb(49, 51, 56)' : 'rgb(240, 240, 240)'} 0px,
            ${isDarkMode ? 'rgb(49, 51, 56)' : 'rgb(240, 240, 240)'} 25%,
            ${isDarkMode ? 'rgba(213, 72, 236, 0.8)' : 'rgba(243, 174, 255, 1)'},
            ${isDarkMode ? 'rgba(0, 86, 208, 0.8)' : 'rgba(162, 201, 255, 1)'},
            ${isDarkMode ? 'rgb(49, 51, 56)' : 'rgb(240, 240, 240)'} 55%,
            ${isDarkMode ? 'rgb(49, 51, 56)' : 'rgb(240, 240, 240)'} 100%
          );
          animation: anim_rotate 14s linear infinite;
          border-radius: inherit;
        }

        &::after {
          content: "";
          position: absolute;
          inset: 1.5px;
          background: ${isDarkMode ? 'rgb(49, 51, 56)' : 'rgb(255, 255, 255)'};
          border-radius: inherit;
          z-index: 1;
        }

        > * {
          position: relative;
          z-index: 2;
        }

        @keyframes anim_rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
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
