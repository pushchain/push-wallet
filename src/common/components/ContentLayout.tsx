import { FC, ReactNode } from "react";
import { Box } from "../../blocks";
import {css} from "styled-components";
import React from "react";
import { Footer } from "./Footer";

type ContentLayoutProps = {
  children: ReactNode;
};

const ContentLayout: FC<ContentLayoutProps> = ({children}) => {
  return (
    <Box
      alignItems="center"
      alignSelf="center"
      backgroundColor="surface-secondary"
      display="flex"
      gap="spacing-lg"
      flexDirection="column"
      justifyContent="center"
      width="100%"
      height='100vh'
      css={css`
        flex: initial;
        margin: 0 0 auto 0;
      `}
    >{children}
    <Footer/>
    </Box>
  );
};

export { ContentLayout };
