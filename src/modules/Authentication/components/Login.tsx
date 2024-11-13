import { FC } from "react";
import {
  Box,
  Button,
  Google,
  Text,
  TextInput,
 
} from "../../../blocks";
import {  PoweredByPush } from "../../../common";
import { socials } from "../Authentication.constants";

//formik for email validation ask
//shift illustrations to icon
//input arrow fix
type LoginProps = {
  email: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>
};

const Login:FC<LoginProps> = ({email,setEmail}) => {
  return (
    <Box
      alignItems="center"
      flexDirection="column"
      display="flex"
      justifyContent="space-between"
      width="100%"
      gap="spacing-xl"
      margin="spacing-md spacing-none spacing-none spacing-none"
    >
      <Text variant="h3-semibold" color="text-primary">
        {" "}
        Welcome to
        <br /> Push Wallet
      </Text>
      <Box
        flexDirection="column"
        display="flex"
        gap="spacing-lg"
        width="100%"
        alignItems="center"
      >
        <Box
          flexDirection="column"
          display="flex"
          gap="spacing-xs"
          width="100%"
          alignItems="center"
        >
          <Box width="100%">
            <TextInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </Box>

          <Text variant="os-regular" color="text-tertiary">
            OR
          </Text>
          <Button
            variant="outline"
            block
            leadingIcon={<Google width={18} height={18} />}
          >
            Continue with Google
          </Button>
          <Box
            display="flex"
            gap="spacing-xs"
            alignItems="center"
            justifyContent="center"
          >
            {socials.map((social) => (
              <Box
                display="flex"
                key={social.name}
                alignItems="center"
                justifyContent="center"
                border="border-sm solid stroke-tertiary"
                borderRadius="radius-sm"
                padding="spacing-sm spacing-md"
              >
               {social.icon}
              </Box>
            ))}
          </Box>
          <Text variant="os-regular" color="text-tertiary">
            OR
          </Text>
          <Button variant="outline" block>
            Continue with a Wallet
          </Button>
        </Box>
        <Text variant="bes-semibold" color="text-brand-medium">
          Recover using Secret Key{" "}
        </Text>
      </Box>
      <PoweredByPush />
    </Box>
  );
};

export { Login };
