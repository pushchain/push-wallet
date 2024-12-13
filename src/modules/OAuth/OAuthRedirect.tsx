import React, { useEffect } from 'react';

const OAuthRedirect = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const state = params.get("state");

        console.log("state", state);

        if (state) {
            console.log("Posting app from the url", state);

            // Post the app value back to the parent tab
            window.opener?.postMessage({ type: 'state', state }, "http://localhost:5173");

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