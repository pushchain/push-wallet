import React from 'react';
import { APP_ROUTES } from '../../constants';

const ParentTab = () => {
    const [appValue, setAppValue] = React.useState<string | null>(null);

    const envRouteAlias =
        import.meta.env.VITE_DEV_MODE === "testing" ? "/push-wallet" : "";


    const openGoogleOAuth = () => {
        const backendURL = `${import.meta.env.VITE_APP_BACKEND_URL
            }/auth/authorize-social?provider=google&redirectUri=${encodeURIComponent(
                window.location.origin + envRouteAlias + APP_ROUTES.OAUTH_REDIRECT
            )}`;
        // Open the child tab with the OAuth URL
        const oauthWindow = window.open(
            backendURL,
            "Google OAuth",
            "width=500,height=600"
        );

        // Add a listener for messages from the child window
        const messageListener = (event: MessageEvent) => {
            // if (event.origin !== "https://push-auth.push.org") {
            //     console.warn("Untrusted origin:", event.origin);
            //     return;
            // }

            console.log("Event", event);

            console.log('Message from child Tab: ', event.data);
            switch (event.data.type) {
                case 'app':
                    console.log("App Data received", event.data.app)
                    setAppValue(event.data.app)
                    window.removeEventListener("message", messageListener);
                    break;
            }

            // const data = event.data;
            // console.log("Event Data", data);

            // if (data?.app) {
            //     // Update the app value and redirect if needed
            //     setAppValue(data.app);

            //     // Example of redirection or further processing
            //     console.log("App Value:", data.app);
            // }

            // Clean up the event listener after receiving the message
            // window.removeEventListener("message", messageListener);
        };

        // Attach the event listener
        window.addEventListener("message", messageListener);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Parent Tab</h1>
            <button onClick={openGoogleOAuth}>Continue with Google</button>
            {appValue && <p>Redirected with app: {appValue}</p>}
        </div>
    );
};

export { ParentTab };