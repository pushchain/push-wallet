import React, { FC, ReactNode } from "react";
import { css } from "styled-components";
import { Box } from "../../blocks";

export type DrawerWrapperProps = {
 children:ReactNode
};

const DrawerWrapper: FC<DrawerWrapperProps> = ({children}) => {


  return (
    <Box
      position="absolute"
      height="100%"
      width="100%"
      alignItems="flex-end"
      display="flex"
      borderRadius="radius-md"
      css={css`
        background: rgba(0, 0, 0, 0.5);
        bottom: 0;
        left: 0;
        z-index: 10;
      `}
    >

    </Box>
  );
};

export { DrawerWrapper };
