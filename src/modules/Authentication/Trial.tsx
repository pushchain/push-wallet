import React, { useEffect } from "react";
import { APP_TO_WALLET_ACTION, WALLET_TO_APP_ACTION } from "./Trial.types";

export enum ACTION {
  AUTH_STATUS = "authStatus",
  IS_LOGGED_IN = "isLoggedIn",

  APP_CONNECTION_REJECTED = "appConnectionRejected",
  APP_CONNECTION_SUCCESS = "appConnectionSuccess",

  IS_LOGGED_OUT = "loggedOut",
}

const Trial = () => {
  // Function to send messages to the main tab
  const sendMessageToMainTab = (message) => {
    // Check if the main tab is available

    if (window.opener) {
      try {
        window.opener.postMessage(message, "http://localhost:5174"); // Use '*' to allow any origin or specify the origin of the main tab
      } catch (error) {
        console.error("Error sending message to main tab:", error);
      }
    }
  };

  // Function to handle status requests
  const handleNewConnectionRequestRes = (status: string) => {
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.APP_CONNECTION_SUCCESS,
      status,
    });
  };

  // Set up an event listener to listen for messages from the main tab
  useEffect(() => {
    const messageHandler = (event) => {
      // Check the origin of the message
      if (event.origin !== "http://localhost:5174") return; // Change this to your main tab's origin

      console.log("Message from main tab:", event.data);
      // Handle messages from the main tab here
      switch (event.data.type) {
        case APP_TO_WALLET_ACTION.NEW_CONNECTION_REQUEST:
          console.log("New Connection Request on wallet tab >>>", event.data);
          // Process the connection Request  and send WALLET_TO_APP_ACTION success or reject
          handleNewConnectionRequestRes("Success");
          break;
        case APP_TO_WALLET_ACTION.SIGN_MESSAGE:
          // Perform some action based on the message
          console.log("Signing Message on wallet tab");
          break;
        // Add more cases as needed
        default:
          console.warn("Unknown message type:", event.data.type);
      }
    };

    window.addEventListener("message", messageHandler);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  const handleUserLoggedIn = () => {
    console.log("User logged in sending message to app");

    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.IS_LOGGED_IN,
      data: "user_logged_In wallet_address",
    });
  };

  const handleUserLoggedOut = () => {
    console.log("User logged out sending message to app");
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.IS_LOGGED_OUT,
      data: "user_logged_out",
    });
  };

  const handleUserAuthStatus = () => {
    console.log("User auth status sending to app");
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.AUTH_STATUS,
      data: "currently logged in send wallet address",
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <button
        style={{
          color: "#FFF",
        }}
        onClick={handleUserLoggedIn}
      >
        {" "}
        User logged In
      </button>
      <button
        style={{
          color: "#FFF",
        }}
        onClick={handleUserLoggedOut}
      >
        {" "}
        User logged Out
      </button>

      <button
        style={{
          color: "#FFF",
        }}
        onClick={handleUserAuthStatus}
      >
        Authentication Status
      </button>
    </div>
  );
};

export default Trial;
