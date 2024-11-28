import { FC, ReactNode } from "react";
import { Box } from "../../blocks";
import React from "react";

type BoxLayoutProps = {
  children: ReactNode;
};

const BoxLayout: FC<BoxLayoutProps> = ({children}) => {
  return (
    <Box
      alignItems="center"
      backgroundColor="surface-primary"
      display="flex"
      flexDirection="column"
      borderRadius="radius-md"
      position="relative"
      border="border-xmd solid stroke-secondary"
      justifyContent="center"
      width= "auto"
    >{children}
    </Box>
  );
};

export { BoxLayout };
