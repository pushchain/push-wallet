import { WALLET_TO_WALLET_ACTION } from "common";
import { useEffect, FC } from "react";

const OAuthRedirect: FC = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const state = params.get("state");

    if (state) {
      // Post the app value back to the parent tab
      window.opener?.postMessage(
        { type: WALLET_TO_WALLET_ACTION.AUTH_STATE_PARAM, state: state },
        window.location.origin
      );

      // Close the current tab
      window.close();
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <p>Redirecting back to the app...</p>
    </div>
  );
};

export { OAuthRedirect };
