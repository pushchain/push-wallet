import { SocialProvider, WalletKeyPairType } from "./Authentication.types";
import { allowedEvmWallets } from "./Authentication.constants";

export const getGroupedWallets = (walletOptions) => {
  return walletOptions.reduce((options, wallet) => {
    const key = wallet.group || wallet.key;
    const name = wallet.groupName || wallet.name;

    if (!options[key]) {
      options[key] = name;
    }

    return options;
  }, {});
};

export const filterEthereumWallets = (
  wallets: WalletKeyPairType
): WalletKeyPairType => {
  const result = Object.fromEntries(
    allowedEvmWallets
      .filter((key) => key in wallets)
      .map((key) => [key, wallets[key]])
  );

  return result;
};

export const getInstalledWallets = (
  wallets,
  walletOptions
): WalletKeyPairType => {
  const result = Object.fromEntries(
    Object.entries(wallets).filter(([key]) =>
      walletOptions.some(
        (item) => item.isInstalledOnBrowser === true && item.key === key
      )
    )
  );
  return result as WalletKeyPairType;
};

export const displayInstalledAndAllowedWallets = (
  wallets,
  walletOptions
): WalletKeyPairType => {
  const result = Object.fromEntries(
    Object.entries(wallets).filter(([key]) =>
      walletOptions.some(
        (item) => item.isInstalledOnBrowser === true || item.key === key
      )
    )
  );
  return result as WalletKeyPairType;
};

export const envRouteAlias =
  import.meta.env.VITE_DEV_MODE === "alpha" ? "" : "";

export const getEmailAuthRoute = (email: string, redirectRoute: string) =>
  `${import.meta.env.VITE_APP_BACKEND_URL
  }/auth/authorize-email?email=${encodeURIComponent(
    email
  )}&redirectUri=${encodeURIComponent(
    window.location.origin + envRouteAlias + redirectRoute
  )}`;

export const getSocialAuthRoute = (
  provider: SocialProvider,
  redirectRoute: string
) =>
  `${import.meta.env.VITE_APP_BACKEND_URL
  }/auth/authorize-social?provider=${provider}&redirectUri=${encodeURIComponent(
    window.location.origin + envRouteAlias + redirectRoute
  )}`;


export const getPushSocialAuthRoute = (
  provider: SocialProvider,
  redirectRoute: string
) =>
  `${import.meta.env.VITE_APP_BACKEND_URL
  }/auth/authorize-push-social?provider=${provider}&redirectUri=${encodeURIComponent(
    window.location.origin + envRouteAlias + redirectRoute
  )}`;

export const getOTPEmailAuthRoute = (email: string, redirectRoute: string) =>
  `${import.meta.env.VITE_APP_BACKEND_URL
  }/auth/authorize-email-otp?email=${encodeURIComponent(
    email
  )}&redirectUri=${encodeURIComponent(
    window.location.origin + envRouteAlias + redirectRoute
  )}`;

export const verifyOTPEmailAuth = async (
  otp: string,
  state: string,
  challengeId: string,
  email: string,
) => {
  const response = await fetch(
    `${import.meta.env.VITE_APP_BACKEND_URL}/auth/verify-email-otp`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp,
        state,
        challengeId,
        email,
      })
    }
  );

  if (!response.ok) {
    throw new Error('OTP verification failed');
  }

  return response;
};

// Helper to parse URL parameters for OTP verification page
export const getOTPVerificationParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    state: params.get('state'),
    challengeId: params.get('challengeId'),
    email: params.get('email'),
  };
};

export const getAuthWindowConfig = () => {
  // Calculate the screen width and height
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const width = 500;
  const height = 600;

  // Calculate the position to center the window
  const left = (screenWidth - width) / 2;
  const top = (screenHeight - height) / 2;

  // Open a new window with the calculated position
  const windowFeatures = `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`;

  return windowFeatures;
};
