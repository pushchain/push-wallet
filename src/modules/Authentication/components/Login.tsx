import { FC } from "react";
import { Box, Button, Front, Google, Text, TextInput } from "../../../blocks";
import { PoweredByPush } from "../../../common";
import { WalletState } from "../Authentication.types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { APP_ROUTES } from "../../../constants";
import { usePersistedQuery } from "../../../common/hooks/usePersistedQuery";

export type LoginProps = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setConnectMethod: React.Dispatch<React.SetStateAction<WalletState>>;
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
});

const envRouteAlias =
  import.meta.env.VITE_DEV_MODE === "testing" ? "/push-wallet" : "";


const Login: FC<LoginProps> = ({ email, setEmail, setConnectMethod }) => {
  const persistQuery = usePersistedQuery();
  const formik = useFormik({
    initialValues: { email },
    validationSchema,
    onSubmit: (values) => {
      setEmail(values.email);

      if (values.email) {

        window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL
          }/auth/authorize-email?email=${encodeURIComponent(
            values.email
          )}&redirectUri=${encodeURIComponent(
            window.location.origin + envRouteAlias + persistQuery(APP_ROUTES.WALLET)
          )}`;
      }
    },
  });


  const handleSocialLogin = (
    provider: "github" | "google" | "discord" | "twitter" | "apple"
  ) => {

    window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL
      }/auth/authorize-social?provider=${provider}&redirectUri=${encodeURIComponent(
        window.location.origin + envRouteAlias + persistQuery(APP_ROUTES.WALLET)
      )}`;
  };

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
            <form onSubmit={formik.handleSubmit}>
              <TextInput
                value={formik.values.email}
                onChange={formik.handleChange("email")}
                placeholder="Enter your email"
                error={formik.touched?.email && Boolean(formik.errors?.email)}
                errorMessage={formik.touched?.email ? formik.errors?.email : ""}
                trailingIcon={
                  <Front
                    size={24}
                    onClick={() => {
                      formik.handleSubmit();
                      setConnectMethod("social");
                    }}
                  />
                }
              />
            </form>
          </Box>

          <Text variant="os-regular" color="text-tertiary">
            OR
          </Text>
          <Button
            variant="outline"
            block
            leadingIcon={<Google width={24} height={24} />}
            onClick={() => handleSocialLogin("google")}
          >
            Continue with Google
          </Button>
          {/* <Box
            display="flex"
            gap="spacing-xs"
            alignItems="center"
            justifyContent="center"
          >
            {socialLoginConfig.map((social) => (
              <Button
                key={social.name}
                variant="outline"
                iconOnly={social.icon}
                css={css`
                  width: 73px;
                `}
                onClick={() =>
                  handleSocialLogin(
                    social.name as
                    | "github"
                    | "google"
                    | "discord"
                    | "twitter"
                    | "apple"
                  )
                }
              />
            ))}
          </Box> */}
          <Text variant="os-regular" color="text-tertiary">
            OR
          </Text>
          <Button
            variant="outline"
            block
            onClick={() => setConnectMethod("connectWallet")}
          >
            Continue with a Wallet
          </Button>
        </Box>
        {/* TODO: after functional implementation */}
        {/* <Text variant="bes-semibold" color="text-brand-medium">
          Recover using Secret Key{" "}
        </Text> */}
      </Box>
      <PoweredByPush />
    </Box>
  );
};

export { Login };
