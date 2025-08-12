import { FC } from "react";
import { Box, PushChainMonotone, Text } from "../../blocks";

const PoweredByPush: FC = () => {
  return (
    <Box display='flex' justifyContent='center' gap='spacing-xxxs'>
      <Text as="span" variant="bes-semibold" color="pw-int-text-tertiary-color">
        Powered by{" "}
      </Text>
      <Box display='flex' justifyContent='center' gap='spacing-xxxs'>
        <PushChainMonotone width={10} color="pw-int-icon-tertiary-color" />
        <Text as="span" variant="bes-semibold" color="pw-int-text-tertiary-color">
          Push Chain{" "}
        </Text>
      </Box>

    </Box>
  );
};

export { PoweredByPush };
