// src/common/hooks/useWalletEvents.ts

import { useEffect, useRef } from "react";
import { APP_TO_WALLET_ACTION, WALLET_TO_APP_ACTION } from "../Common.types";
import { GlobalState, useGlobalState } from "../../context/GlobalContext";

const useWalletEvents = () => {
  const { dispatch, state } = useGlobalState();
  const walletRef = useRef(state.wallet);
  useEffect(() => {
    walletRef.current = state.wallet;
  }, [state.wallet]);

  // Function to send messages to the main tab
  const sendMessageToMainTab = (message) => {
    if (window.opener) {
      try {
        window.opener.postMessage(message, "http://localhost:5174");
      } catch (error) {
        console.error("Error sending message to main tab:", error);
      }
    }
  };

  console.log("Wallet in hook", state.wallet);

  // Function to handle status requests
  const handleNewConnectionRequest = (origin: any) => {
    /**
     * New Connection Request
     * User -> Connection Request
     * 1.Accept : WALLET_TO_APP_ACTION.APP_CONNECTION_SUCCESS
     * 2.Reject: WALLET_TO_APP_ACTION.APP_CONNECTION_Reject
     */

    console.log("Push wallet >>>>", walletRef.current);

    walletRef?.current.requestToConnect(origin);

    const appConnections = localStorage.getItem("appConnections")
      ? JSON.parse(localStorage.getItem("appConnections"))
      : [];
    dispatch({
      type: "INITIALIZE_WALLET",
      payload: {
        ...walletRef.current,
        appConnections: appConnections,
      } as GlobalState["wallet"],
    });

    // sendMessageToMainTab({
    //   type: WALLET_TO_APP_ACTION.APP_CONNECTION_SUCCESS,
    //   status,
    // });
  };

  // Set up an event listener to listen for messages from the main tab
  useEffect(() => {
    console.log("Listener initiated");

    const messageHandler = (event) => {
      if (event.origin !== "http://localhost:5174") return;

      console.log("Message from main tab:", event.data);
      switch (event.data.type) {
        case APP_TO_WALLET_ACTION.NEW_CONNECTION_REQUEST:
          console.log("New Connection Request on wallet tab >>>", event);
          handleNewConnectionRequest(event.origin);
          break;
        case APP_TO_WALLET_ACTION.SIGN_MESSAGE:
          console.log("Signing Message on wallet tab");
          break;
        default:
          console.warn("Unknown message type:", event.data.type);
      }
    };

    window.addEventListener("message", messageHandler);

    // window.onbeforeunload = () => {
    //   if (window.opener) {
    //     // Send a message to the parent app using the target origin (parent's URL)
    //     sendMessageToMainTab({
    //       type: WALLET_TO_APP_ACTION.TAB_CLOSED,
    //     });
    //   }
    // };

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  useEffect(() => {
    console.log("Wallet Ref", walletRef.current);

    if (walletRef.current) {
      console.log("Push wallet found ", walletRef.current);
      handleUserLoggedIn();
    }
  }, [walletRef.current]);

  const handleAppConnectionSuccess = (origin: string) => {
    console.log("Sending app Conenction success request");

    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.APP_CONNECTION_SUCCESS,
      data: "Connection successful",
    });

    walletRef?.current.acceptConnectionReq(origin);
  };
  const handleAppConnectionRejected = () => {
    console.log("Sending app Conenction rejected request");
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.APP_CONNECTION_REJECTED,
      data: "App Connection Rejected",
    });

    walletRef?.current.rejectConnectionReq(origin);
  };

  const handleRejectAllAppConnections = () => {
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.APP_CONNECTION_REJECTED,
      data: "App Connection Rejected",
    });

    walletRef?.current.rejectAllConnectionReqs();
  };

  const handleUserLoggedIn = () => {
    console.log("User logged in sending message to app");
    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.IS_LOGGED_IN,
      data: "user_logged_In wallet_address",
    });
  };

  const handleLogOutEvent = () => {
    console.log("User logged out sending message to app");

    sendMessageToMainTab({
      type: WALLET_TO_APP_ACTION.IS_LOGGED_OUT,
      data: "user_logged_out",
    });
  };

  //   const handleUserAuthStatus = () => {
  //     console.log("User auth status sending to app");
  //     sendMessageToMainTab({
  //       type: WALLET_TO_APP_ACTION.AUTH_STATUS,
  //       data: "currently logged in send wallet address",
  //     });
  //   };

  return {
    handleUserLoggedIn,
    handleLogOutEvent,
    handleAppConnectionSuccess,
    handleAppConnectionRejected,
    handleRejectAllAppConnections,
    // handleUserAuthStatus,
  };
};

export { useWalletEvents };
