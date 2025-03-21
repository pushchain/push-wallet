import { WALLET_TO_WALLET_ACTION } from "common";
import { useEffect, FC } from "react";

const OAuthRedirect: FC = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const state = params.get("state");

    if (state) {

      window.opener?.postMessage(
        { type: WALLET_TO_WALLET_ACTION.AUTH_STATE_PARAM, state: state },
        window.location.origin
      );

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
