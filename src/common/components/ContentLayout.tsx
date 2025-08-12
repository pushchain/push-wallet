import { FC, ReactNode } from "react";
import { Box } from "../../blocks";
import { css } from "styled-components";
import React from "react";
import { getAppParamValue } from "../Common.utils";


type ContentLayoutProps = {
  children: ReactNode;
  footer?: ReactNode;
};

const ContentLayout: FC<ContentLayoutProps> = ({ children, footer }) => {

  const isOpenedInIframe = !!getAppParamValue();
  return (
    <Box
      alignItems="center"
      alignSelf="center"
      backgroundColor={isOpenedInIframe ? "pw-int-bg-transparent" : "pw-int-bg-primary-color"}
      display="flex"
      gap="spacing-lg"
      flexDirection="column"
      justifyContent="center"
      width="100%"
      height="100vh"
      css={css`
        flex: initial;
        margin: 0 0 auto 0;
      `}
    >
      {children}
      {footer}
    </Box>
  );
};

export { ContentLayout };
