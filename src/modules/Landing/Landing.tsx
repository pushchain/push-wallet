import { Box,Text } from "../../blocks";
import { BoxLayout, ContentLayout } from "../../common";

const Landing = () => {
  return (
    <ContentLayout>
      <BoxLayout>
        <Box alignItems='center' display="flex" height="500px" width="376px" padding="spacing-md">
         <Text color="text-primary"> Welcome to Push Wallet</Text>
        </Box>
      </BoxLayout>
    </ContentLayout>
  );
};

export { Landing };
