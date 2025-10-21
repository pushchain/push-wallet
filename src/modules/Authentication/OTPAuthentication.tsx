import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { WALLET_TO_WALLET_ACTION } from "../../common/Common.types";

const OTPAuthentication = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const state = searchParams.get('state') || '';
        const challengeId = searchParams.get('challengeId') || '';
        const email = searchParams.get('email') || '';

        const params = {
            state, challengeId, email
        }

        window.opener?.postMessage(
            { type: WALLET_TO_WALLET_ACTION.REAUTH_PARAM, params: params },
            window.location.origin
        );

        window.close();
    }, []);
    
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <p>Redirecting back to the app...</p>
        </div>
    );
}

export default OTPAuthentication;