import { FC } from "react";
import { BellRingFilled, Box, Text } from "../../blocks";
import React from "react";

const PoweredByPush: FC = () => {
  return (
    <Box display='flex' justifyContent='center'>
      <Text as="span" variant="bes-semibold" color="pw-int-text-tertiary-color">
       Powered by{" "}
      </Text>
     <BellRingFilled width={10} color="pw-int-icon-tertiary-color"/>
      <Text as="span" variant="bes-semibold" color="pw-int-text-tertiary-color">
        Push Chain{" "}
      </Text>
      
    </Box>
  );
};

export { PoweredByPush };
