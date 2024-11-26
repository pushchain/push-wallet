import { FC } from "react";
import { BellRingFilled, Box, Text } from "../../blocks";
import React from "react";

const PoweredByPush: FC = () => {
  return (
    <Box display='flex' justifyContent='center'>
      <Text as="span" variant="bes-semibold" color="text-tertiary">
       Powered by{" "}
      </Text>
     <BellRingFilled width={10} color="icon-tertiary"/>
      <Text as="span" variant="bes-semibold" color="text-tertiary">
        Push Chain{" "}
      </Text>
      
    </Box>
  );
};

export { PoweredByPush };
