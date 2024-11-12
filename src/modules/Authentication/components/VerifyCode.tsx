import { FC, useState } from "react";
import { Back, Box, Text, TextInput } from "../../../blocks";
import { PoweredByPush } from "../../../common";

type VerifyCodeProps = {};

//replace email
//implement back
//recheck the otp input 
const VerifyCode: FC<VerifyCodeProps> = () => {
  const [code, setCode] = useState<Array<string>>(new Array(6).fill(""));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newCode = [...code];
    console.debug(e.target.value);
    if (!newCode[index] || (newCode[index] && e.target.value ==='')) {
      newCode[index] = e.target.value;
      setCode(newCode);
    }
  };
  return (
    <Box flexDirection="column" display="flex" gap="spacing-lg" width="100%">
      <Box cursor="pointer">
        <Back color="icon-tertiary" size={24} />
      </Box>
      <Box
        flexDirection="column"
        display="flex"
        gap="spacing-md"
        textAlign="center"
      >
        <Box
          flexDirection="column"
          display="flex"
          gap="spacing-xxl"
          textAlign="center"
        >
          <Box flexDirection="column" display="flex" gap="spacing-xxxs">
            <Text color="text-primary" variant="h4-semibold">
              Confirm verification code
            </Text>
            <Text color="text-primary" variant="bs-regular">
              We’ve sent a 6 digit code to zee@push.org. Enter the code to
              proceed.
            </Text>
          </Box>
          <Box display="flex" gap="spacing-xxs">
            {code.map((val: string, index: number) => (
              <TextInput
                key={index}
                value={val}
                onChange={(e) => handleChange(e, index)}
              />
            ))}
          </Box>
        </Box>
        <Box as="span">
          <Text color="text-secondary" variant="bes-semibold" as="span">
            Didn’t receive a code?
          </Text>{" "}
          <Text color="text-brand-medium" variant="bes-semibold" as="span">
            Send again
          </Text>
        </Box>
      </Box>

      <PoweredByPush />
    </Box>
  );
};

export { VerifyCode };
